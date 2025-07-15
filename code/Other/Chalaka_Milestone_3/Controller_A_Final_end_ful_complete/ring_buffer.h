#pragma once

// Simple fixed-size ring buffer that drops oldest on overflow
template<typename T, size_t N>
class RingBuffer {
public:
  RingBuffer(): head(0), tail(0) {}
  bool empty() const            { return head == tail; }
  bool full()  const            { return ((tail + 1) % N) == head; }

  void push(const T& v) {
    if (full()) head = (head + 1) % N;
    buf[tail] = v;
    tail = (tail + 1) % N;
  }

  T* front() {
    return empty() ? nullptr : &buf[head];
  }

  void pop() {
    if (!empty()) head = (head + 1) % N;
  }

  // debug accessors
  size_t getHead() const { return head; }
  size_t getTail() const { return tail; }

private:
  T      buf[N];
  size_t head, tail;
};
