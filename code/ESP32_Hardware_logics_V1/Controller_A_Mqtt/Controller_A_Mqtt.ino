#include <Arduino.h>
#include "ring_buffer.h"
#include "frame_protocol.h"

// Controller A message type
struct CtrlAMsg {
  uint32_t seq;
  String   json;
};

// 32-entry queues
RingBuffer<CtrlAMsg, 32> txQ, rxQ;
FrameParser            parser;

HardwareSerial& comm = Serial2;
const uint32_t   BAUD = 115200;
uint32_t         nextSeq  = 0;
uint32_t         lastGen  = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  Serial.println("[Setup] Controller A starting...");
  comm.begin(BAUD, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
  Serial.printf("[Setup] Serial2 @ %u baud, RX=%d, TX=%d\n", BAUD, 16, 17);
}

void loop() {
  uint32_t now = millis();

  // 1) Generate a JSON-seq message every 1000ms
  if (now - lastGen >= 1000) {
    lastGen = now;
    CtrlAMsg m;
    m.seq  = nextSeq++;
    m.json = String("{\"seq\":") + m.seq + ",\"time\":" + now + "}";
    txQ.push(m);
    // Serial.printf("[Gen] Pushed msg seq=%lu json=%s\n",
    //               m.seq, m.json.c_str());
    // Serial.printf("[Debug] txQ after push: head=%u, tail=%u\n",
    //               txQ.getHead(), txQ.getTail());
  }

  // 2) Send next queued frame if possible
  if (!txQ.empty() && comm.availableForWrite() > 0) {
    CtrlAMsg* m = txQ.front();
    uint8_t buf[300];
    size_t  len;
    if (packFrame(m->json, buf, len)) {
      comm.write(buf, len);
      // Serial.printf("[Send] Sent frame seq=%lu len=%u payload=%s\n",
      //               m->seq, len, m->json.c_str());
      txQ.pop();
      // Serial.printf("[Send] Popped msg seq=%lu\n", m->seq);
      // Serial.printf("[Debug] txQ after pop:  head=%u, tail=%u\n",
      //               txQ.getHead(), txQ.getTail());
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
      CtrlAMsg m{0, payload};
      rxQ.push(m);
      Serial.println("[Recv] Pushed to rxQ");
      // Serial.printf("[Debug] rxQ after push: head=%u, tail=%u\n",
      //               rxQ.getHead(), rxQ.getTail());
    }
  }

  // 4) Print any received messages
  while (!rxQ.empty()) {
    CtrlAMsg* m = rxQ.front();
    Serial.println(String("[Print] ⇦ CTRL: ") + m->json);
    rxQ.pop();
    Serial.println("[Print] Popped rxQ");
    // Serial.printf("[Debug] rxQ after pop:  head=%u, tail=%u\n",
    //               rxQ.getHead(), rxQ.getTail());
  }
}



// #include <Arduino.h>
// #include "ring_buffer.h"
// #include "frame_protocol.h"

// // Controller A message type
// struct CtrlAMsg {
//   uint32_t seq;
//   String   json;
// };

// RingBuffer<CtrlAMsg, 32> txQ, rxQ;
// FrameParser            parser;

// HardwareSerial& comm = Serial2;
// const uint32_t   BAUD = 115200;
// uint32_t         nextSeq  = 0;
// uint32_t         lastGen  = 0;

// void setup() {
//   Serial.begin(115200);
//   while (!Serial) delay(10);
//   Serial.println("[Setup] Controller A starting...");
//   comm.begin(BAUD, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
//   Serial.printf("[Setup] Serial2 @ %u baud, RX=%d, TX=%d\n", BAUD, 16, 17);
// }

// void loop() {
//   uint32_t now = millis();

//   // 1) Generate a JSON-seq message every 100ms
//   if (now - lastGen >= 1000) {
//     lastGen = now;
//     CtrlAMsg m;
//     m.seq  = nextSeq++;
//     m.json = String("{\"seq\":") + m.seq + ",\"time\":" + now + "}";
//     txQ.push(m);
//     Serial.printf("[Gen] Pushed msg seq=%lu json=%s\n", m.seq, m.json.c_str());
//   }

//   // 2) Send next queued frame if possible
//   if (!txQ.empty() && comm.availableForWrite() > 0) {
//     CtrlAMsg* m = txQ.front();
//     uint8_t buf[300];
//     size_t  len;
//     if (packFrame(m->json, buf, len)) {
//       comm.write(buf, len);
//       Serial.printf("[Send] Sent frame seq=%lu len=%u payload=%s\n",
//                     m->seq, len, m->json.c_str());
//       txQ.pop();
//       Serial.printf("[Send] Popped msg seq=%lu\n", m->seq);
//     } else {
//       Serial.println("[Error] packFrame failed!");
//     }
//   }

//   // 3) Parse incoming bytes into JSON payloads
//   while (comm.available()) {
//     uint8_t b = comm.read();
//     String payload;
//     if (parser.parse(b, payload)) {
//       Serial.printf("[Recv] Parsed payload: %s\n", payload.c_str());
//       CtrlAMsg m{0, payload};
//       rxQ.push(m);
//       Serial.println("[Recv] Pushed to rxQ");
//     }
//   }

//   // 4) Print any received messages
//   while (!rxQ.empty()) {
//     CtrlAMsg* m = rxQ.front();
//     Serial.println(String("[Print] ⇦ CTRL: ") + m->json);
//     rxQ.pop();
//     Serial.println("[Print] Popped rxQ");
//   }
// }
