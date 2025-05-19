#pragma once

template<typename T, size_t N>
class RingBuffer {
public:
  RingBuffer(): head(0), tail(0) {}

  bool empty() const            { return head == tail; }
  bool full()  const            { return ((tail + 1) % N) == head; }

  // push newest, drop oldest on overflow
  void push(const T& v) {
    if (full()) head = (head + 1) % N;
    buf[tail] = v;
    tail = (tail + 1) % N;
  }

  // get front element or nullptr
  T* front() {
    return empty() ? nullptr : &buf[head];
  }

  // pop front
  void pop() {
    if (!empty()) head = (head + 1) % N;
  }

  // ←––– NEW: expose head/tail for debugging
  size_t getHead() const { return head; }
  size_t getTail() const { return tail; }

private:
  T buf[N];
  size_t head, tail;
};
