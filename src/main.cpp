#include <Arduino.h>
#include "LedRing.h"
#include "NFC.h"

void setup(void) {
  Serial.begin(115200);
  Serial.println("Hello!");
  LedRing::setup();
  NFC::setup();
}

void loop(void) {

  // bReading and msLastSuccessfulRead are temporary hacks
  // so that we don't try to read the card more than once a second.
  // 
  static bool bReading = true;
  static uint32_t msLastSuccessfulRead = 0;

  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
  if (bReading && NFC::loop(uid, &uidLength))
  {
    // successfully read!
    LedRing::setMode(LedRing::modeReading);
    bReading = false;
    msLastSuccessfulRead = millis();
  }

  if (millis() - msLastSuccessfulRead > 1000)
    bReading = true;

  LedRing::loop();

}
