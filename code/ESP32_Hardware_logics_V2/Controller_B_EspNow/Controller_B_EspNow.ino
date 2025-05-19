#include <Arduino.h>
#include "ring_buffer.h"
#include "frame_protocol.h"

// Sensor message type for TX
struct CtrlBMsg {
  uint32_t seq;
  int16_t  reading;
};

// TX queue: sensor readings
RingBuffer<CtrlBMsg, 32> txQ;
// RX queue: raw JSON strings from Controller A
RingBuffer<String, 32>  rxQ;

// Frame parser for incoming bytes
FrameParser parser;

// Use Serial2 (GPIO16 RX, GPIO17 TX)
HardwareSerial& comm = Serial2;
const uint32_t   BAUD = 115200;

uint32_t nextSeq = 0;
uint32_t lastGen = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  Serial.println("[Setup] Controller B starting...");

  // Initialize UART
  comm.begin(BAUD, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
  Serial.printf("[Setup] Serial2 @ %u baud, RX=16, TX=17\n", BAUD);
}

void loop() {
  uint32_t now = millis();

  // —— 1) Generate sensor reading every 2000 ms ——
  if (now - lastGen >= 2000) {
    lastGen = now;
    CtrlBMsg m{ nextSeq++, (int16_t)analogRead(34) };
    txQ.push(m);
    // Serial.printf("[Gen] seq=%u reading=%d\n", m.seq, m.reading);
  }

  // —— 2) Send next queued sensor frame ——
  if (!txQ.empty() && comm.availableForWrite() > 0) {
    CtrlBMsg* m = txQ.front();
    String payload = String("{\"seq\":") + m->seq +
                     ",\"reading\":" + m->reading + "}";
    uint8_t buf[300];
    size_t  len;
    if (packFrame(payload, buf, len)) {
      comm.write(buf, len);
      // Serial.printf("[Send] seq=%u len=%u payload=%s\n", m->seq, len, payload.c_str());
      txQ.pop();
      // Serial.printf("[Send] Popped seq=%u\n", m->seq);
    } else {
      Serial.println("[Error] packFrame failed!");
    }
  }

  // —— 3) Parse incoming bytes for JSON frames from Controller A ——
  while (comm.available()) {
    uint8_t b = comm.read();
    // Serial.printf("[Debug] Read byte 0x%02X\n", b);
    String json;
    if (parser.parse(b, json)) {
      Serial.println("[Recv JSON] " + json);
      rxQ.push(json);
      // Serial.printf("[Debug] rxQ head=%u tail=%u\n", rxQ.getHead(), rxQ.getTail());
    }
  }

  // —— 4) Process any queued JSON commands ——
  while (!rxQ.empty()) {
    String* pCmd = rxQ.front();
    if (pCmd) {
      String cmd = *pCmd;
      Serial.println("[Process Cmd] " + cmd);
    }
    rxQ.pop();
    // Serial.printf("[Debug] rxQ head=%u tail=%u\n", rxQ.getHead(), rxQ.getTail());
    // TODO: deserializeJson(cmd) and act on it
  }
}
