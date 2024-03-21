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
#define READING_SPEED 850
#define READING_LOOPS 3
#define FAIL_DISPLAY_TIME 2500
#define HOW_MUCH_WATER 30000

mode_t mode = modeReady;
uint32_t msModeStartTime;

void setMode(mode_t modeNew)
{
  mode = modeNew;
  msModeStartTime = millis();
}

void setup() {

  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);

}

void loop() {


  switch (mode) {

    case modeReady:
      fill_solid(leds, NUM_LEDS, CHSV(160, 212, beatsin8(BPM, 64, 192)));
      break;

    case modeReading:
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      {
        uint32_t elapsedTime = millis() - msModeStartTime;
        if (elapsedTime < READING_SPEED)
        {
          int curPos = elapsedTime / (READING_SPEED / (NUM_LEDS * READING_LOOPS));
          CRGB color = CRGB::White;
          uint8_t tailLength = 6;
          while (curPos >= 0 && curPos < NUM_LEDS * READING_LOOPS && tailLength)
          {
            leds[curPos % NUM_LEDS] = color;
            curPos--;
            tailLength--;
            color.subtractFromRGB(40);
          }
        }
        else
        {
          mode = modeFail;
          msModeStartTime = millis();
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
          mode = modeSuccess;
          msModeStartTime = millis();
        }
      }
      break;

    case modeSuccess:
      {
        leds[0] = leds[1] = CRGB::Red;
        leds[2] = leds[3] = leds[4] = CRGB::Orange;
        leds[5] = leds[6] = leds[7] = leds[8] = leds[9] = leds[10] = leds[11] = CRGB::Green;
        uint32_t elapsedTime = millis() - msModeStartTime;
        if (elapsedTime < HOW_MUCH_WATER)
        {
          int curPos = NUM_LEDS - elapsedTime / (HOW_MUCH_WATER / NUM_LEDS);
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
