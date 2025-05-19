#include <Arduino.h>
#include "ring_buffer.h"
#include "frame_protocol.h"

// Controller B message type
struct CtrlBMsg {
  uint32_t seq;
  int16_t  reading;
};

RingBuffer<CtrlBMsg, 32> txQ, rxQ;
FrameParser              parser;

HardwareSerial& comm = Serial2;
const uint32_t   BAUD = 115200;
uint32_t         nextSeq  = 0;
uint32_t         lastGen  = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  Serial.println("[Setup] Controller B starting...");
  comm.begin(BAUD, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
  Serial.printf(
    "[Setup] Serial2 @ %u baud, RX=%d, TX=%d\n",
    BAUD, 16, 17
  );
}

void loop() {
  uint32_t now = millis();

  // 1) Generate sensor reading every 100ms
  if (now - lastGen >= 2000) {
    lastGen = now;
    CtrlBMsg m{ nextSeq++, (int16_t)analogRead(34) };
    txQ.push(m);
    // Serial.printf(
    //   "[Gen] Pushed sensor msg seq=%lu reading=%d\n",
    //   m.seq, m.reading
    // );
    // Serial.printf(
    //   "[Debug] txQ after push: head=%u, tail=%u\n",
    //   txQ.getHead(), txQ.getTail()
    // );
  }

  // 2) Send next queued frame
  if (!txQ.empty() && comm.availableForWrite() > 0) {
    CtrlBMsg* m = txQ.front();
    String payload = String("{\"seq\":") + m->seq +
                     ",\"reading\":" + m->reading + "}";
    // Serial.printf(
    //   "[Send] Preparing to send seq=%lu reading=%d\n",
    //   m->seq, m->reading
    // );

    uint8_t buf[300];
    size_t  len;
    if (packFrame(payload, buf, len)) {
      comm.write(buf, len);
      // Serial.printf(
      //   "[Send] Sent frame seq=%lu len=%u payload=%s\n",
      //   m->seq, len, payload.c_str()
      // );
      txQ.pop();
      // Serial.printf(
      //   "[Send] Popped txQ seq=%lu\n", 
      //   m->seq
      // );
      // Serial.printf(
      //   "[Debug] txQ after pop:  head=%u, tail=%u\n",
      //   txQ.getHead(), txQ.getTail()
      // );
    } else {
      Serial.println("[Error] packFrame failed!");
    }
  }

  // 3) Parse incoming bytes into JSON payloads
  while (comm.available()) {
    uint8_t b = comm.read();
    // Serial.printf("[Debug] Read byte: 0x%02X\n", b);

    String payload;
    if (parser.parse(b, payload)) {
      Serial.printf("[Recv] Parsed payload: %s\n", payload.c_str());
      // enqueue for later processing (or parsing)
      CtrlBMsg m{0, 0};
      rxQ.push(m);
      Serial.println("[Recv] Pushed to rxQ");
      // Serial.printf(
      //   "[Debug] rxQ after push: head=%u, tail=%u\n",
      //   rxQ.getHead(), rxQ.getTail()
      // );
    }
  }

  // 4) Print any received messages
  while (!rxQ.empty()) {
    CtrlBMsg* m = rxQ.front();
    Serial.println("[Print] ⇦ SENSOR: (raw JSON above)");
    rxQ.pop();
    Serial.println("[Print] Popped rxQ");
    // Serial.printf(
    //   "[Debug] rxQ after pop:  head=%u, tail=%u\n",
    //   rxQ.getHead(), rxQ.getTail()
    // );
  }
}
