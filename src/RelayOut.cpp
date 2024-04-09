#include <Arduino.h>
#include "RelayOut.h"

namespace RelayOut {

  uint32_t msTimeShutoff = 0;

  void setup()
  {
    pinMode(5, OUTPUT);
    power(false);
  }
  
  void power(bool f)
  {
    digitalWrite(5, f ? HIGH : LOW);
  }

  void runFor(uint32_t timeInSeconds)
  {
    msTimeShutoff = millis() + (timeInSeconds * 1000);
    power(true);
  }

  void loop()
  {
    if (msTimeShutoff && millis() > msTimeShutoff)
    {
      power(false);
      msTimeShutoff = 0;
    }
  }
};
