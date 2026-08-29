#pragma once
#include <Arduino.h>

namespace WebSocketManager {

  // Initialize WebSocket with a valid username
  void begin(const String& validUser);

  // Immediately broadcast a message (only if client is authenticated)
  void broadcast(const String& msg);

  // Queue a message to be sent once a client is connected and authenticated
  void enqueueMessage(const String& msg);

  // Flush any queued messages to the client (used internally)
  void flushQueue();

}
