#include "LightManager.h"
#include <Ticker.h>
#include <dimmable_light.h>

static DimmableLight* lights[4];
static Ticker         ticker;
static int            currBri[4], targBri[4];

static int mapPct(int p){
  if (p <= 0)   return 0;
  if (p > 100)  p = 100;
  // map 1–100% to 40–255
  return 40 + ((p - 1) * 215) / 99;
}

static void step() {
  Serial.println("[LightManager][Debug] step(): updating brightness");  // debug
  bool again = false;
  for (int i = 0; i < 4; i++) {
    if (currBri[i] < targBri[i]) {
      currBri[i]++;
      again = true;
    }
    else if (currBri[i] > targBri[i]) {
      currBri[i]--;
      again = true;
    }
    lights[i]->setBrightness(currBri[i]);
    Serial.printf("[LightManager][Debug] Light %d -> currBri=%d\n", i, currBri[i]);
  }
  if (again) {
    ticker.once(0.02, step);
  }
}

namespace LightManager {
  void begin(uint8_t zc, uint8_t p1, uint8_t p2, uint8_t p3, uint8_t p4) {
    Serial.printf("[LightManager][Debug] begin(): ZC pin = %u\n", zc);
    DimmableLight::setSyncPin(zc);
    DimmableLight::begin();

    uint8_t pins[4] = {p1, p2, p3, p4};
    for (int i = 0; i < 4; i++) {
      lights[i] = new DimmableLight(pins[i]);
      currBri[i] = targBri[i] = 0;
      lights[i]->setBrightness(0);
      Serial.printf("[LightManager][Debug] Created light %d on pin %u, initial bri=0\n", i, pins[i]);
    }
  }

  void setTarget(uint8_t idx, uint8_t pct) {
    if (idx < 4) {
      targBri[idx] = mapPct(pct);
      // Serial.printf("[LightManager][Debug] setTarget(): idx=%u pct=%u -> targBri=%d\n",
      //               idx, pct, targBri[idx]);
      ticker.once(0.02, step);
    }
  }

  void update() {
    // nothing here—Ticker invokes step() asynchronously
    // Serial.println("[LightManager][Debug] update()");  // debug if needed
  }
}
