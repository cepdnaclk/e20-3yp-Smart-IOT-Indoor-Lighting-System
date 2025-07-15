#pragma once
#include <Arduino.h>
#include <functional>

using JsonCallback = std::function<void(const String& json)>;

namespace SerialComm {
  // Initialize Serial2 at given baud (GPIO16=RX,17=TX)
  void begin(uint32_t baud=115200);

  // Register a callback for each complete JSON frame received
  void onJsonReceived(JsonCallback cb);

  // Enqueue a raw JSON string to be sent (it will be wrapped in {"seq":…,"payload":…})
  void sendJson(const String& rawJson);

  // Call in your main loop to drive TX and RX
  void loop();
}

// #ifndef SERIALCOMM_H
// #define SERIALCOMM_H

// #include <Arduino.h>
// #include <functional>

// namespace SerialComm {
//   using JsonCallback = std::function<void(const String&)>;

//   void begin(uint32_t baud = 115200); // ✅ Default only here
//   void loop();
//   void sendJson(const String& rawJson);
//   void onJsonReceived(JsonCallback cb);
// }

// #endif

