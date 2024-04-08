#include <Arduino.h>
#include "LedRing.h"
#include "NFC.h"
#include "RelayOut.h"
#include "Network.h"

void setup(void) {

  RelayOut::setup();
  Serial.begin(115200);
  Serial.println("Hello!");
  LedRing::setup();

  LedRing::setMode(LedRing::modeNFCSetup);
  NFC::setup();
  LedRing::setMode(LedRing::modeNFCSetupComplete);

  Network::setup();
}

void loop(void)
{

  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)

  // if (bReading && NFC::loop(uid, &uidLength))
  // {
  //   // successfully read!
  //   LedRing::setMode(LedRing::modeReading);
  //   bReading = false;
  //   msLastSuccessfulRead = millis();
  //   RelayOut::power(true);
  // }

  // if (millis() - msLastSuccessfulRead > 1000) {
  //   bReading = true;
  //   RelayOut::power(false);
  // }

  LedRing::loop();
  Network::loop();
  if (NFC::loop(uid, &uidLength))
  {
    Serial.println("Main loop is aware of a successful read.");
  }
}
