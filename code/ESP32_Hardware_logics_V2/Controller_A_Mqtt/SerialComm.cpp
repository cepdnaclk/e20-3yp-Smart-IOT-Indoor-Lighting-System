#include "SerialComm.h"
#include "ring_buffer.h"
#include "frame_protocol.h"
#include <Arduino.h>

namespace SerialComm {
  // transmit‐queue
  static RingBuffer<String,32> txQ;

  // for parsing incoming frames
  static FrameParser           parser;

  // user callback when a full JSON arrives
  static JsonCallback          userCb = nullptr;

  // global sequence counter
  static uint32_t              seqCounter = 0;

  void begin(uint32_t baud) {
    Serial2.begin(baud, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
    // Serial.println("[SerialComm] Serial2 started"); // debug
  }

  void onJsonReceived(JsonCallback cb) {
    userCb = cb;
    // Serial.println("[SerialComm] onJsonReceived registered"); // debug
  }

  void sendJson(const String& rawJson) {
    // wrap with sequence number
    String wrapped = String("{\"seq\":") + seqCounter++ +
                     ",\"payload\":" + rawJson + "}";
    txQ.push(wrapped);
    Serial.printf("[SerialComm][Gen] Pushed seq=%u payload=%s\n",
                  seqCounter-1, wrapped.c_str());
    // Serial.printf("[SerialComm][Debug] txQ head=%u, tail=%u\n",
    //               txQ.getHead(), txQ.getTail());
  }

  void loop() {
    // —— 1) Transmit queued frames ——
    if (!txQ.empty() && Serial2.availableForWrite() > 0) {
      String* msg = txQ.front();

      // serialize into a frame
      uint8_t buf[300];
      size_t  len;
      if (packFrame(*msg, buf, len)) {
        // Serial.printf("[SerialComm][Send] Sending seq payload=%s len=%u\n",
        //               msg->c_str(), len);
        Serial2.write(buf, len);
      } else {
        Serial.println("[SerialComm][Error] packFrame failed");
      }

      txQ.pop();
      // Serial.printf("[SerialComm][Send] Popped txQ, head=%u, tail=%u\n",
      //               txQ.getHead(), txQ.getTail());
    }

    // —— 2) Read & parse incoming bytes ——
    while (Serial2.available()) {
      uint8_t b = Serial2.read();
      // Serial.printf("[SerialComm][Debug] Read byte: 0x%02X\n", b);

      String payload;
      if (parser.parse(b, payload) && userCb) {
        // Serial.printf("[SerialComm][Recv] Parsed payload: %s\n",
        //               payload.c_str());
        userCb(payload);
      }
    }
  }
}
