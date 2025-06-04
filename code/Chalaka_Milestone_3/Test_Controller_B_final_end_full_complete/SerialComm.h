#pragma once
#include <Arduino.h>
#include <functional>

// Framed‐UART over Serial2: pack/unpack JSON strings
namespace SerialComm {
  // Call in setup(): opens Serial2 at given baud
  void begin(uint32_t baud);

  // Call in loop(): pumps bytes in & out
  void loop();

  // Enqueue a JSON string to be sent (framed) to Controller A
  void sendJson(const String& json);

  // Register a callback to fire whenever a complete JSON is received
  void onJsonReceived(std::function<void(const String&)> cb);
}
