#pragma once
#include <Arduino.h>

namespace WebSocketManager {
  void begin(const String& validUser);
  void broadcast(const String& msg);
}
