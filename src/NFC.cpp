#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>
#include "LedRing.h"

namespace NFC {

const uint8_t PN532_SCK = 13;
const uint8_t PN532_MOSI = 11;
const uint8_t PN532_SS = 2;
const uint8_t PN532_MISO = 12;
Adafruit_PN532 nfc(PN532_SCK, PN532_MISO, PN532_MOSI, PN532_SS);

void setup() {
  
  while (!nfc.begin())
  {
    delay(100);
  }

  uint32_t versiondata = false;
  while (!versiondata) {
    versiondata = nfc.getFirmwareVersion();
    if (!versiondata)
    {
      Serial.println("Didn't find PN53x board");
      // imperically, sometimes this thing doesn't respond right away.
      // If you try a few times it eventually appears.
      delay(100);
    }
  }

  // Got ok data, print it out!
  Serial.print("Found chip PN5");
  Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("Firmware ver. ");
  Serial.print((versiondata >> 16) & 0xFF, DEC);
  Serial.print('.');
  Serial.println((versiondata >> 8) & 0xFF, DEC);

  Serial.println("Waiting for an ISO14443A Card ...");
}

bool loop(uint8_t *uid, uint8_t *uidLength) {

  // don't try to read more than once a second or so
  static bool bReading = true;
  static uint32_t msLastSuccessfulRead = 0;
  uint8_t success;

  if (!bReading)
  {
    if (millis() - msLastSuccessfulRead > 1000)
    {
      bReading = true;
    }
    else
    {
      return false;
    }
  }

  // Wait for an ISO14443A type cards (Mifare, etc.).  When one is found
  // 'uid' will be populated with the UID, and uidLength will indicate
  // if the uid is 4 bytes (Mifare Classic) or 7 bytes (Mifare Ultralight)
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, uidLength, 50);
  // timeout ^ of 50 ms determined by trial and error, just enough to read 7 bytes.
  // use a longer timeout for more reliable reading of cards
  // use a shorter timeout for smoother LED animation....

  if (success) {
    LedRing::setMode(LedRing::modeReading);
    // Display some basic information about the card
    Serial.println("Found an ISO14443A card");
    Serial.print("  UID Length: ");
    Serial.print(*uidLength, DEC);
    Serial.println(" bytes");
    Serial.print("  UID Value: ");
    nfc.PrintHex(uid, *uidLength);
    Serial.println("");

    bReading = false; // don't read again for 1000 ms
    msLastSuccessfulRead = millis();
  }

  return success;
}
};