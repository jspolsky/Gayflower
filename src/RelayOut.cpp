#include <Arduino.h>

namespace RelayOut {

  void setup()
  {
    pinMode(5, OUTPUT);
    digitalWrite(5, LOW);
  }
  
  void power(bool f)
  {
    digitalWrite(5, f ? HIGH : LOW);
  }

};
