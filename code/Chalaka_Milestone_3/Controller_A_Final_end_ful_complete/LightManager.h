#pragma once
#include <Arduino.h>

namespace LightManager {
  // pins: zero-cross, then 4 PWM pins
  void begin(uint8_t zcPin, uint8_t pin1, uint8_t pin2, uint8_t pin3, uint8_t pin4);
  // percent [0–100]
  void setTarget(uint8_t index, uint8_t percent);
  // must be called in loop()
  void update();
}
