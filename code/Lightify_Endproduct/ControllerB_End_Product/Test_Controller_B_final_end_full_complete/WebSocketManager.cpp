#include "WebSocketManager.h"
#include <WebSocketsServer.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <queue>

// — static state only visible in this translation unit —
static WebSocketsServer ws(81);
static String         validUser;
static int            wsClient = -1;
static bool           authOK[8] = {};
// Sensor updates arrive before the app connects and authenticates, so they
// are held here rather than dropped. The cap stops an absent app from
// growing this queue without limit.
static std::queue<String> pendingQueue;
static const size_t MAX_QUEUE_SIZE = 30;


// Send everything held while the client was away.
static void flushQueueInternal() {
  if (wsClient >= 0 && authOK[wsClient]) {
    while (!pendingQueue.empty()) {
      String msg = pendingQueue.front();
      pendingQueue.pop();
      ws.sendTXT(wsClient, msg);
      Serial.printf("📤 [FLUSH] Sent buffered message to client %d: %s\n", wsClient, msg.c_str());
    }
  }
}

// — WebSocket event handler —
static void onEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t len) {
  switch (type) {
    case WStype_CONNECTED:
      wsClient = num;
      authOK[num] = false;
      Serial.printf("🌐 WS client %u connected\n", num);
      Serial.printf("🔌 WebSocket CONNECTED → client=%u\n", num);
      break;

    case WStype_DISCONNECTED:
      Serial.printf("🌐 WS client %u disconnected\n", num);
      Serial.printf("⚠️ WebSocket DISCONNECTED → client=%u\n", num);
      authOK[num] = false;
      if (wsClient == num) wsClient = -1;
      break;

    case WStype_TEXT: {
      Serial.printf("📩 WS client %u sent message: %.*s\n", num, len, (char*)payload);
      StaticJsonDocument<200> d;
      DeserializationError err = deserializeJson(d, payload, len);
      if (err) {
        Serial.printf("❌ [WS] JSON parse error from client %u: %s\n", num, err.c_str());
        break;
      }

      const char* u = d["username"];
      if (u && validUser == String(u)) {
        authOK[num] = true;
        ws.sendTXT(num, "{\"status\":\"ok\"}");
        Serial.printf("✅ WS client %u authenticated successfully\n", num);

        // 🆕 Now flush any buffered messages
        flushQueueInternal();
      } else {
        Serial.printf("❌ Authentication failed for client %u (username = %s)\n", num, u ? u : "NULL");
        ws.sendTXT(num, "{\"error\":\"bad user\"}");
      }
      break;
    }

    default:
      Serial.printf("⚠️ WS client %u triggered unhandled event type: %d\n", num, type);
      break;
  }
}


static void wsTask(void* param) {
  for (;;) {
    ws.loop();

    // Dequeue and send messages if any and client is connected/authenticated
    if (!pendingQueue.empty() && wsClient >= 0 && authOK[wsClient]) {
      String msg = pendingQueue.front();  // get the first message
      pendingQueue.pop();                  // remove it from queue
      ws.sendTXT(wsClient, msg);           // send via websocket
      Serial.printf("📤 [Queued] Broadcasted to client %d: %s\n", wsClient, msg.c_str());
    }

    vTaskDelay(pdMS_TO_TICKS(10));
  }
}

namespace WebSocketManager {

  void begin(const String& user) {
    validUser = user;
    Serial.printf("🔐 WebSocket valid username set to: %s\n", validUser.c_str());

    ws.begin();
    ws.onEvent(onEvent);

    Serial.println("📡 Starting WebSocket loop task...");
    xTaskCreatePinnedToCore(
      wsTask,
      "wsTask",
      4096,
      nullptr,
      1,  // Task priority
      nullptr,
      1
    );

    Serial.println("🚀 WebSocket server started on port 81");
  }

  void updateUser(const String& user) {
    validUser = user;
    Serial.printf("🔁 Updated WebSocket valid username to: %s\n", validUser.c_str());
  }

  void broadcast(const String& msg) {
    Serial.printf("[DBG] Attempting broadcast → client=%d authOK=%d\n", wsClient, (wsClient >= 0 ? authOK[wsClient] : 0));
    if (wsClient >= 0 && authOK[wsClient]) {
      String temp = msg;
      ws.sendTXT(wsClient, temp);

      Serial.printf("📤 Broadcast sent to client %d: %s\n", wsClient, msg.c_str());
    } else {
      Serial.println("⚠️ Broadcast failed: No authenticated WebSocket client");
    }
  }

  void enqueueMessage(const String& msg) {
    if (pendingQueue.size() >= MAX_QUEUE_SIZE) {
      Serial.println("⚠️ Queue full! Dropping all existing messages and adding new one...");

      // Drop all messages
      while (!pendingQueue.empty()) {
        pendingQueue.pop();
      }
    }

    pendingQueue.push(msg);
    Serial.printf("📦 Queued message for later: %s\n", msg.c_str());
  }


  void flushQueue() {
    Serial.println("🔁 Flushing queued messages...");
    flushQueueInternal();
  }

} // namespace WebSocketManager
