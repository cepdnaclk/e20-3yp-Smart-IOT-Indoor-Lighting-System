// #pragma once
// #include <Arduino.h>

// namespace WebSocketManager {
//   void begin(const String& validUser);
//   void broadcast(const String& msg);
// }

#pragma once
#include <Arduino.h>

namespace WebSocketManager {

  // Initialize WebSocket with a valid username
  void begin(const String& validUser);

  // Immediately broadcast a message (only if client is authenticated)
  void broadcast(const String& msg);

  // 🆕 Queue a message to be sent when WebSocket is ready
  void enqueueMessage(const String& msg);

  // 🆕 Flush any queued messages to client (used internally)
  void flushQueue();
  
}

