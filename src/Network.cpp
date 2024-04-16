#include <Arduino.h>
#include <NativeEthernet.h>
#include <SPI.h>
#include "Network.h"
#include "LedRing.h"

namespace Network
{
    EthernetClient client;

    void teensyMAC(uint8_t *mac)
    {
        for (uint8_t by = 0; by < 2; by++)
            mac[by] = (HW_OCOTP_MAC1 >> ((1 - by) * 8)) & 0xFF;
        for (uint8_t by = 0; by < 4; by++)
            mac[by + 2] = (HW_OCOTP_MAC0 >> ((3 - by) * 8)) & 0xFF;
        Serial.printf("MAC: %02x:%02x:%02x:%02x:%02x:%02x\r\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }

    void setup()
    {
        LedRing::setMode(LedRing::modeTryDHCP);
        bool fIPConnected(false);
        bool fServerConnected(false);

        while (!fIPConnected || !fServerConnected)
        {

            while (!fIPConnected)
            {
                byte mac[6];
                teensyMAC(mac);

                if (Ethernet.begin(mac, 30000UL, 4000UL) == 0)
                {
                    LedRing::setMode(LedRing::modeDHCPFailed);
                    Serial.println("Unable to get an IP address from a DHCP server.");

                    if (Ethernet.linkStatus() == LinkOFF)
                    {
                        Serial.println("Link status OFF");
                    }
                }
                else
                {
                    LedRing::setMode(LedRing::modeDHCPSuccess);
                    fIPConnected = true;
                    Serial.print("My IP address: ");
                    Serial.println(Ethernet.localIP());
                }
            }

            // UNDONE sample code sometimes has a delay(1000) here

            LedRing::setMode(LedRing::modeTryServer);

            if (client.connect(IPAddress(192, 168, 66, 1), 3001))
            {
                Serial.println("Connected to server");
                fServerConnected = true;
                LedRing::setMode(LedRing::modeReady);
            }
            else
            {
                Serial.println("Not connected to server");
                Ethernet.maintain(); // renew DHCP?
                fIPConnected = fServerConnected = false;
                LedRing::setMode(LedRing::modeServerFailed);
                delay(1000);
            }
        }
    }

    result_t loop(uint32_t *piPumpTimeInSeconds)
    {
        *piPumpTimeInSeconds = 0;
        result_t result = resultNoop;

        static char msg[128];
        static char *pchNext = msg;
        static uint8_t cb = 0;

        // if there are incoming bytes available
        // from the server, read them and print them:
        while (client.available())
        {
            *pchNext = client.read();
            if (*pchNext == '\r' || *pchNext == '\n' || cb == 126)
            {
                *pchNext = '\0';
                if (cb > 0)
                {
                    Serial.printf("Message from server [%s]\r\n", msg);
                    if (!strncmp(msg, "401 ", 4))
                    {
                        result = resultUnauthorized;
                    }
                    else if (!strncmp(msg, "PUMP ", 5))
                    {
                        result = resultPump;
                        *piPumpTimeInSeconds = atoi(msg + 5);
                    }
                    else if (!strncmp(msg, "200 ", 4))
                    {
                        result = resultAuthorized;
                        *piPumpTimeInSeconds = atoi(msg + 7);
                    }
                }
                pchNext = msg;
                cb = 0;
            }
            else
            {
                pchNext++;
                cb++;
            }
        }

        // if the server's disconnected, stop the client, and try to reestablish it.
        if (!client.connected())
        {
            Serial.println();
            Serial.println("disconnecting; will try to reconnect");
            client.stop();
            setup();
        }

        return result;
    }

    // send swipe message
    void swipe(uint8_t *uid, uint8_t uidLength)
    {
        char msg[32];
        char *pmsg = msg;

        pmsg += sprintf(pmsg, "SWIP ");
        while (uidLength)
        {
            pmsg += sprintf(pmsg, "%02x", *uid++);
            uidLength--;
        }

        sprintf(pmsg, "\r\n");

        Serial.println(msg);
        client.write(msg);
    }
}