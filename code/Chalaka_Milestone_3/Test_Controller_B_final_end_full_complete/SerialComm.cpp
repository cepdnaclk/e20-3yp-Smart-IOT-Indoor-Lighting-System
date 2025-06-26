#include "SerialComm.h"
#include "frame_protocol.h"
#include "ring_buffer.h"
#include <Arduino.h>  // for Serial.printf/String

// We’ll use Serial2 for the wire between A↔B
static HardwareSerial& uart = Serial2;

// Incoming JSON parser
static FrameParser parser;

// Outgoing queue of JSON strings
static RingBuffer<String, 32> txQ;

// User’s receive‐callback
static std::function<void(const String&)> rxCb = nullptr;

namespace SerialComm {

  void begin(uint32_t baud) {
    // RX=16, TX=17
    uart.begin(baud, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
    Serial.printf("[SerialComm] begin @ %u baud (RX=16, TX=17)\n", baud);
  }

  void loop() {
    // — Receive bytes with debug —
    while (uart.available()) {
      uint8_t b = uart.read();
      // Serial.printf("[RX] 0x%02X\n", b);

      String payload;
// 2) Feed it into the frame‐parser
      if (parser.parse(b, payload)) {
        // 3) When a complete frame emerges:
        Serial.printf("[RX] → complete frame, len=%u\n", payload.length());
        Serial.println(payload);

        // 4) If someone registered an onJsonReceived callback, call it:
        if (rxCb) {
          Serial.println("[RX] Calling rxCb(...) now");
          rxCb(payload);
          Serial.println("[RX] Return from rxCb(...)");
        }
      }
    }

    // — Transmit queued JSONs —
    if (!txQ.empty() && uart.availableForWrite() > 0) {
      String s = *txQ.front();
      uint8_t buf[512];
      size_t  len;
      if (packFrame(s, buf, len)) {
        uart.write(buf, len);
        txQ.pop();
      } else {
        // too large, drop it (you may choose to retry instead)
        Serial.println("[SerialComm] packFrame failed on transmit, dropping chunk");
        txQ.pop();
      }
    }
  }

  void sendJson(const String& json) {
    // push into our TX queue
    txQ.push(json);
    Serial.printf("[SerialComm] queued JSON len=%u  head=%u tail=%u\n",
                  json.length(), txQ.getHead(), txQ.getTail());
  }

  void onJsonReceived(std::function<void(const String&)> cb) {
    rxCb = cb;
  }

} // namespace SerialComm
