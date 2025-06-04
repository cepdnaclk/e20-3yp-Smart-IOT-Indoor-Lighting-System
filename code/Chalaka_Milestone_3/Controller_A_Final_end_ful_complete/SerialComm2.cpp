#include "SerialComm.h"
#include "frame_protocol.h"
#include "ring_buffer.h"
#include <ArduinoJson.h>
#include <map>
#include <set>

static HardwareSerial& uart = Serial2;
static FrameParser        parser;

// Single chunk entry
struct ChunkEntry {
  String    json;
  uint32_t  seq;
  uint16_t  idx;
};

// Transmit queue holds ChunkEntry
static RingBuffer<ChunkEntry,32> txQ;
// outstanding[seq] = set of chunkIndex still waiting for ACK
static std::map<uint32_t,std::set<uint16_t>> outstanding;

// next sequence number
static uint32_t nextSeq = 1;

static std::function<void(const String&)> rxCb = nullptr;

// Buffer for packFrame
static const size_t FRAME_BUF_SIZE = 1024;
static uint8_t frameBuf[FRAME_BUF_SIZE];

namespace SerialComm2 {

  void begin(uint32_t baud) {
    uart.begin(baud, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
    Serial.printf("[SerialComm] begin @ %u baud\n", baud);
  }

  void loop() {
    // —— Receive side ——
    while (uart.available()) {
      uint8_t b = uart.read();
      String envelope;
      if (parser.parse(b, envelope)) {
        // Try to parse as ACK
        StaticJsonDocument<256> doc;
        auto err = deserializeJson(doc, envelope);
        if (!err && doc["type"] == String("ack")) {
          uint32_t seq = doc["seq"];
          uint16_t idx = doc["chunkIndex"];
          Serial.printf("[SerialComm] ACK seq=%u idx=%u\n", seq, idx);
          // mark it done
          auto it = outstanding.find(seq);
          if (it != outstanding.end()) {
            it->second.erase(idx);
            if (it->second.empty()) outstanding.erase(it);
          }
          // if this was the front chunk, pop it
          if (!txQ.empty()) {
            auto &fe = *txQ.front();
            if (fe.seq == seq && fe.idx == idx) {
              txQ.pop();
              Serial.printf("[SerialComm] popped seq=%u idx=%u\n", seq, idx);
            }
          }
        } else {
          // normal data payload
          Serial.printf("[SerialComm] RX payload len=%u\n", envelope.length());
          if (rxCb) rxCb(envelope);
        }
      }
    }

    // —— Transmit side ——
    if (!txQ.empty() && uart.availableForWrite() > 0) {
      auto &entry = *txQ.front();
      // if already ACK’d, drop it
      if (outstanding.count(entry.seq) == 0 ||
          outstanding[entry.seq].count(entry.idx) == 0) {
        txQ.pop();
        return;
      }
      // otherwise (re)send it
      Serial.printf("[SerialComm] sending chunk seq=%u idx=%u len=%u\n",
                    entry.seq, entry.idx, entry.json.length());
      size_t len;
      if (packFrame(entry.json, frameBuf, len)) {
        uart.write(frameBuf, len);
        Serial.printf("[SerialComm] wrote %u bytes (head=%u tail=%u)\n",
                      len, txQ.getHead(), txQ.getTail());
      } else {
        Serial.println("[SerialComm] ERROR: frame too big!");
      }
    }
  }

  void sendJson(const String& rawJson) {
    const size_t CHUNK_SIZE = 256;
    size_t totalLen = rawJson.length();
    uint32_t seq    = nextSeq++;
    uint16_t num    = (totalLen + CHUNK_SIZE - 1) / CHUNK_SIZE;

    Serial.printf("[SerialComm] sendJson seq=%u total=%u chunks=%u\n",
                  seq, totalLen, num);

    // initialize outstanding set
    auto &pending = outstanding[seq];
    for (uint16_t i = 0; i < num; i++) {
      pending.insert(i);
      size_t offset = i * CHUNK_SIZE;
      size_t len    = min(CHUNK_SIZE, totalLen - offset);
      String slice  = rawJson.substring(offset, offset + len);

      // envelope
      StaticJsonDocument<512> doc;
      doc["type"]       = "data";
      doc["seq"]        = seq;
      doc["chunkIndex"] = i;
      doc["numChunks"]  = num;
      doc["data"]       = slice;
      String out;
      serializeJson(doc, out);

      // enqueue
      ChunkEntry ce{ out, seq, i };
      txQ.push(ce);
      Serial.printf("[SerialComm] enq seq=%u idx=%u len=%u (head=%u tail=%u)\n",
                    seq, i, out.length(),
                    txQ.getHead(), txQ.getTail());
    }
  }

  void onJsonReceived(std::function<void(const String&)> cb) {
    rxCb = cb;
  }

} // namespace SerialComm
