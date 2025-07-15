#include "SerialComm.h"
#include "frame_protocol.h"
#include "ring_buffer.h"

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
    uart.begin(baud, SERIAL_8N1, 16, 17);
  }

  void loop() {
    // — Receive bytes —
    while (uart.available()) {
      uint8_t b = uart.read();
      String payload;
      if (parser.parse(b, payload)) {
        // Got a full JSON
        if (rxCb) rxCb(payload);
      }
    }

    // — Transmit queued JSONs —
    if (!txQ.empty() && uart.availableForWrite() > 0) {
      String s = *txQ.front();
      uint8_t buf[512];
      size_t len;
      if (packFrame(s, buf, len)) {
        uart.write(buf, len);
        txQ.pop();
      } else {
        // too large, drop it
        txQ.pop();
      }
    }
  }

  void sendJson(const String& json) {
    // push into our TX queue
    txQ.push(json);
  }

  void onJsonReceived(std::function<void(const String&)> cb) {
    rxCb = cb;
  }

} // namespace SerialComm
