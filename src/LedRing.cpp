#include <Arduino.h>
#include <FastLED.h>
#include "LedRing.h"

FASTLED_USING_NAMESPACE

namespace LedRing {

#define BPM 36
#define DATA_PIN 4
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
#define NUM_LEDS 12
CRGB leds[NUM_LEDS];

#define BRIGHTNESS 196
#define FAIL_DISPLAY_TIME 2500

mode_t mode = modeReady;
uint32_t msModeStartTime;
uint32_t msModeReadingTime = 0; // if non-zero, the time we started the modeReading animation
uint32_t msPumpTime = 1000;

void setMode(const mode_t _mode)
{
  mode = _mode;
  msModeStartTime = millis();
  if (mode == modeReading)
    msModeReadingTime = msModeStartTime;
  loop();
}

void setPumpTime(uint32_t pumpTimeInSeconds)
{
  msPumpTime = pumpTimeInSeconds * 1000;
}

void setup() {

  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);
  setMode(modeWakeUp);
}

void loop()
{
  mode_t modeEffective(mode); // shows the animation from the current mode
                              // UNLESS we are within one second of starting to
                              // read, in which case, keep showing the reading spinny
                              // to simulate the effect of somebody is actually
                              // thinking very hard about whether or not to turn on
                              // the water for you even though we basically knew
                              // the minute your common ass showed up in here

  if (msModeReadingTime)
  {
    if (millis() - msModeReadingTime < 360)
    {
      modeEffective = modeReading;
    }
    else
    {
      msModeReadingTime = 0; // reset
    }
  }

  switch (modeEffective)
  {

  case modeWakeUp:
    leds[0] = CRGB::Green;
    fill_solid(leds + 1, NUM_LEDS - 1, CRGB::Black);
    break;

  case modeNFCSetup:
    leds[0] = CRGB::Green;
    leds[1] = CRGB::Yellow;
    fill_solid(leds + 2, NUM_LEDS - 2, CRGB::Black);
    break;

  case modeNFCSetupComplete:
    leds[0] = leds[1] = CRGB::Green;
    fill_solid(leds + 2, NUM_LEDS - 2, CRGB::Black);
    break;

  case modeTryDHCP:
    leds[0] = leds[1] = CRGB::Green;
    leds[2] = CRGB::Yellow;
    fill_solid(leds + 3, NUM_LEDS - 3, CRGB::Black);
    break;

  case modeDHCPFailed:
    leds[0] = leds[1] = CRGB::Green;
    leds[2] = CRGB::Red;
    fill_solid(leds + 3, NUM_LEDS - 3, CRGB::Black);
    break;

  case modeDHCPSuccess:
    fill_solid(leds, 3, CRGB::Green);
    fill_solid(leds + 3, NUM_LEDS - 3, CRGB::Black);
    break;

  case modeTryServer:
    fill_solid(leds, 3, CRGB::Green);
    leds[3] = CRGB::Yellow;
    fill_solid(leds + 4, NUM_LEDS - 4, CRGB::Black);
    break;

  case modeServerFailed:
    fill_solid(leds, 3, CRGB::Green);
    leds[3] = CRGB::Red;
    fill_solid(leds + 4, NUM_LEDS - 4, CRGB::Black);
    break;

  case modeReady:
    fill_solid(leds, NUM_LEDS, CHSV(160, 212, beatsin8(BPM, 64, 192)));
    break;

  case modeReading:
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    {
      uint32_t elapsedTime = millis() - msModeStartTime;
      int curPos = elapsedTime / 24;
      CRGB color = CRGB::White;
      uint8_t tailLength = 6;
      while (curPos >= 0 && tailLength)
      {
        leds[curPos % NUM_LEDS] = color;
        curPos--;
        tailLength--;
        color.subtractFromRGB(40);
      }
    }
    break;

  case modeFail:
  {
    fill_solid(leds, NUM_LEDS, CRGB::Red);
    leds[0] = leds[3] = leds[6] = leds[9] = CRGB::Black;
    uint32_t elapsedTime = millis() - msModeStartTime;
    if (elapsedTime > FAIL_DISPLAY_TIME)
    {
      setMode(modeReady);
    }
  }
  break;

  case modeSuccess:
  {
    leds[0] = leds[1] = CRGB::Red;
    leds[2] = leds[3] = leds[4] = CRGB::Orange;
    leds[5] = leds[6] = leds[7] = leds[8] = leds[9] = leds[10] = leds[11] = CRGB::Green;
    uint32_t elapsedTime = millis() - msModeStartTime;
    if (elapsedTime < msPumpTime)
    {
      int curPos = NUM_LEDS - elapsedTime / (msPumpTime / NUM_LEDS);
      for (int i = curPos; i < NUM_LEDS; i++)
      {
        leds[i] = CRGB::Black;
      }
    }
    else
    {
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      mode = modeReady;
    }
  }
  break;

  default:
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    break;
  }

  FastLED.show();
}
};
