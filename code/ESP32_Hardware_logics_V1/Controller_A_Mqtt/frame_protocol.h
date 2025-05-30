#pragma once
#include <Arduino.h>

static const uint8_t FRAME_START = 0x7E;

// XOR checksum over payload bytes
inline uint8_t computeChecksum(const uint8_t* data, size_t len) {
  uint8_t c = 0;
  for (size_t i = 0; i < len; ++i) c ^= data[i];
  return c;
}

// Build a frame into outBuf; outLen = total bytes written
// Format: [START][LEN_H][LEN_L][payload...][CHK]
inline bool packFrame(const String& payload, uint8_t* outBuf, size_t& outLen) {
  size_t L = payload.length();
  if (L > 0xFFFF) return false;
  outBuf[0] = FRAME_START;
  outBuf[1] = (L >> 8) & 0xFF;
  outBuf[2] = (L     ) & 0xFF;
  memcpy(outBuf + 3, payload.c_str(), L);
  outBuf[3 + L] = computeChecksum((uint8_t*)payload.c_str(), L);
  outLen = 4 + L;
  return true;
}

// Stateful parser; call parse(byte, outPayload). Returns true when a full valid frame is done.
class FrameParser {
public:
  FrameParser(): state(WAIT_START), length(0), idx(0), chk(0) {}

  bool parse(uint8_t b, String& outPayload) {
    switch (state) {
      case WAIT_START:
        if (b == FRAME_START) state = READ_LEN_H;
        break;
      case READ_LEN_H:
        length = (uint16_t)b << 8;
        state = READ_LEN_L;
        break;
      case READ_LEN_L:
        length |= b;
        if (length > sizeof(buffer)) { state = WAIT_START; }
        else { idx = 0; chk = 0; state = READ_PAYLOAD; }
        break;
      case READ_PAYLOAD:
        buffer[idx++] = b;
        chk ^= b;
        if (idx >= length) state = READ_CHECK;
        break;
      case READ_CHECK:
        if (b == chk) {
          outPayload = String((char*)buffer, length);
          state = WAIT_START;
          return true;
        }
        state = WAIT_START;
        break;
    }
    return false;
  }

private:
  enum { WAIT_START, READ_LEN_H, READ_LEN_L, READ_PAYLOAD, READ_CHECK } state;
  uint16_t length;
  uint16_t idx;
  uint8_t  chk;
  uint8_t  buffer[256];
};
