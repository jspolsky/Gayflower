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
        Serial.printf("MAC: %02x:%02x:%02x:%02x:%02x:%02x\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }

    void setup()
    {
        LedRing::setMode(LedRing::modeTryDHCP);
        bool fIPConnected = false;

        while (!fIPConnected)
        {
            byte mac[6];
            teensyMAC(mac);

            if (Ethernet.begin(mac, 15000UL, 4000UL) == 0)
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

        bool fServerConnected = false;

        while (!fServerConnected)
        {
            // UNDONE sample code sometimes has a delay(1000) here

            LedRing::setMode(LedRing::modeTryServer);

            if (client.connect(IPAddress(192, 168, 126, 107), 3001))
            {
                Serial.println("Connected to server");
                fServerConnected = true;
                LedRing::setMode(LedRing::modeReady);
            }
            else
            {
                Serial.println("Not connected to server");
                fServerConnected = false;
                LedRing::setMode(LedRing::modeServerFailed);
                delay(1000);
            }
        }
    }

    void loop()
    {
        // if there are incoming bytes available
        // from the server, read them and print them:
        if (client.available())
        {
            char c = client.read();
            Serial.print(c);
        }

        // if the server's disconnected, stop the client, and try to reestablish it.
        if (!client.connected())
        {
            Serial.println();
            Serial.println("disconnecting; will try to reconnect");
            client.stop();
            setup();
        }
    }
}