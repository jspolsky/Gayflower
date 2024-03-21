namespace LedRing {

typedef enum mode_t {
  modeReady,
  modeReading,
  modeFail,
  modeSuccess,
} mode_t;

void setMode(mode_t modeNew);
void setup();
void loop();
};