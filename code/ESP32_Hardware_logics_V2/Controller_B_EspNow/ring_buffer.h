#pragma once
#include <cstddef>

// Simple fixed-size ring buffer that drops the oldest element on overflow
template<typename T, size_t N>
class RingBuffer {
public:
  RingBuffer(): head(0), tail(0) {}

  bool empty() const            { return head == tail; }
  bool full()  const            { return ((tail + 1) % N) == head; }

  // push newest, drop oldest if full
  void push(const T& v) {
    if (full()) head = (head + 1) % N;
    buf[tail] = v;
    tail = (tail + 1) % N;
  }

  // get pointer to front element, or nullptr
  T* front() {
    return empty() ? nullptr : &buf[head];
  }

  // pop front element
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
