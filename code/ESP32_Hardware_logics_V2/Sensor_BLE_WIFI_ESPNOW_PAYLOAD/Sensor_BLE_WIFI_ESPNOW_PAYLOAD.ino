#include <WiFi.h>
#include <esp_wifi.h>
#include <esp_now.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <ArduinoJson.h>
#include <math.h>

// ——— BLE UUIDs must match controller ———
#define SERVICE_UUID       "12345678-1234-1234-1234-1234567890AB"
#define UUID_MAC_CHAR      "12345678-1234-1234-1234-1234567890AC"
#define UUID_SSID_CHAR     "12345678-1234-1234-1234-1234567890AD"
#define UUID_PASS_CHAR     "12345678-1234-1234-1234-1234567890AE"
#define UUID_CHANNEL_CHAR  "12345678-1234-1234-1234-1234567890AF"

// BLE client globals
BLEAddress controllerAddr("");  
bool        doConnect     = false;
BLEClient*  pClient       = nullptr;
BLERemoteCharacteristic* macChar;
BLERemoteCharacteristic* ssidChar;
BLERemoteCharacteristic* passChar;
BLERemoteCharacteristic* chanChar;
uint8_t    peerMac[6];

// Radar serial pins & buffer
#define RX_PIN      16
#define TX_PIN      17
#define BAUD_RATE   256000
uint8_t RX_BUF[64];
uint8_t RX_count = 0;

// Radar‐derived globals
int16_t  target1_x = 0, target1_y = 0;
uint16_t target1_speed = 0, target1_distance_res = 0;
float    target1_distance = 0.0f, target1_angle = 0.0f;
int16_t  previous_target1_x = 0, previous_target1_y = 0;

uint8_t Single_Target_Detection_CMD[12] = {0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x80, 0x00, 0x04, 0x03, 0x02, 0x01};

// ——— JSON‐BUFFER QUEUE ———
struct JSONMsg {
  uint32_t seq;
  uint16_t len;
  char     data[512];
};

// ——— simple ring-buffer queue for up to 128 messages ———
static const int QUEUE_SIZE = 64;
JSONMsg queueBuf[QUEUE_SIZE];
int     queueHead = 0, queueTail = 0;

// ——— SEND STATE ———
static uint32_t seqNum       = 0;
static uint32_t lastSeqSent  = 0;
static bool     awaitingAck  = false;
bool            sendShapesFlag = false;  // toggle this if you want "shapes":[ ] in your JSON

// ——— PROCESS ONE FRAME ———
void processRadarData() {
  // Decode X
  uint16_t rawX = (RX_BUF[4] | (RX_BUF[5] << 8));
  int16_t  newX = (rawX >= 32768 ? -(int16_t)(rawX - 32768)
                                 :  (int16_t)rawX);
  // Decode Y
  uint16_t rawY = (RX_BUF[6] | (RX_BUF[7] << 8));
  int16_t  newY = -(int16_t)(rawY >= 32768 ? rawY - 32768 : rawY);

  // Avoid zero drop-outs
  target1_x = (newX != 0 ? newX : previous_target1_x);
  target1_y = (newY != 0 ? newY : previous_target1_y);
  previous_target1_x = target1_x;
  previous_target1_y = target1_y;

  // Speed & distance resolution
  target1_speed        = (RX_BUF[8]  | (RX_BUF[9]  << 8));
  target1_distance_res = (RX_BUF[10] | (RX_BUF[11] << 8));
  target1_distance     = sqrtf(float(target1_x)*target1_x
                              + float(target1_y)*target1_y);
  target1_angle        = atan2f(float(target1_y),
                                float(target1_x))
                        * (180.0f / M_PI);

  // ——— BUILD & QUEUE JSON ———

  // 1) Fill a document
  StaticJsonDocument<512> doc;
  doc["seq"]      = seqNum;
  doc["x"]        = target1_x;
  doc["y"]        = target1_y;
  doc["speed"]    = target1_speed;
  doc["distance"] = target1_distance;
  doc["angle"]    = target1_angle;
  if (sendShapesFlag) {
    doc.createNestedArray("shapes");  // empty array if you need it
  }

  // 2) Serialize into our JSONMsg buffer
  char buf[512];
  size_t n = serializeJson(doc, buf, sizeof(buf));

  JSONMsg m;
  m.seq = seqNum++;
  m.len = n;
  memcpy(m.data, buf, n);

  queuePush(m);

  // Clear the radar buffer for next frame
  RX_count = 0;
  memset(RX_BUF, 0, sizeof(RX_BUF));
}



bool queueEmpty() { return queueHead == queueTail; }
bool queueFull()  { return ((queueTail + 1) % QUEUE_SIZE) == queueHead; }

// Push new message: if full, flush everything first
void queuePush(const JSONMsg &m) {
  if (queueFull()) {
    Serial.println("⚠️ JSON queue full — flushing");
    queueHead = queueTail;  // drop everything
  }
  queueBuf[queueTail] = m;
  queueTail = (queueTail + 1) % QUEUE_SIZE;
}

JSONMsg* queueFront() {
  if (queueEmpty()) return nullptr;
  return &queueBuf[queueHead];
}

void queuePop() {
  if (!queueEmpty()) {
    queueHead = (queueHead + 1) % QUEUE_SIZE;
  }
}


// ——— ESP-NOW send callback ———
void onEspNowSent(const uint8_t* mac_addr, esp_now_send_status_t status) {
  char buf[18];
  snprintf(buf, sizeof(buf),
    "%02X:%02X:%02X:%02X:%02X:%02X",
     mac_addr[0],mac_addr[1],mac_addr[2],
     mac_addr[3],mac_addr[4],mac_addr[5]
  );
  Serial.printf("seq=%u send to %s %s\n",
                lastSeqSent,
                buf,
                (status == ESP_NOW_SEND_SUCCESS ? "✓" : "✗"));

  // on success, pop that message off the queue
  if (status == ESP_NOW_SEND_SUCCESS) {
    JSONMsg *front = queueFront();
    if (front && front->seq == lastSeqSent) {
      queuePop();
    }
  }
  awaitingAck = false;
}

// ——— BLE channel-notify callback ———
static void onChanNotify(
  BLERemoteCharacteristic* rc, uint8_t* data,
  size_t length, bool isNotify
) {
  uint8_t newCh = data[0];
  Serial.printf("🔔 Channel update: %d\n", newCh);

  esp_now_deinit();
  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(newCh, WIFI_SECOND_CHAN_NONE);
  if (esp_now_init() == ESP_OK) {
    esp_now_peer_info_t peer = {};
    memcpy(peer.peer_addr, peerMac, 6);
    peer.channel = newCh;
    peer.encrypt = false;
    esp_now_add_peer(&peer);
    Serial.println("🔄 ESP-NOW reconfigured");
  } else {
    Serial.println("❌ ESP-NOW re-init failed");
  }
}

// ——— BLE scan callback ———
class ScanCB: public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertised) override {
    if (advertised.haveServiceUUID() &&
        advertised.isAdvertisingService(BLEUUID(SERVICE_UUID))) {
      controllerAddr = advertised.getAddress();
      Serial.print("📡 Found controller at ");
      Serial.println(controllerAddr.toString().c_str());
      BLEDevice::getScan()->stop();
      doConnect = true;
    }
  }
};

void setup() {
  Serial.begin(115200);
  delay(500);

  // 1) Scan for controller via BLE
  BLEDevice::init("");
  BLEScan* scanner = BLEDevice::getScan();
  scanner->setAdvertisedDeviceCallbacks(new ScanCB());
  scanner->setInterval(100);
  scanner->setWindow(99);
  scanner->setActiveScan(true);
  scanner->start(0, nullptr);
  Serial.println("🔍 Scanning for BLE service...");
  while (!doConnect) delay(50);

  // 2) Connect & read characteristics
  pClient = BLEDevice::createClient();
  pClient->connect(controllerAddr);
  Serial.println("🔗 BLE connected");
  auto svc = pClient->getService(SERVICE_UUID);

  macChar  = svc->getCharacteristic(UUID_MAC_CHAR);
  ssidChar = svc->getCharacteristic(UUID_SSID_CHAR);
  passChar = svc->getCharacteristic(UUID_PASS_CHAR);
  chanChar = svc->getCharacteristic(UUID_CHANNEL_CHAR);

  std::string smac  = macChar->readValue();
  std::string ssid  = ssidChar->readValue();
  std::string pass  = passChar->readValue();
  std::string chVal = chanChar->readValue();

  Serial.print("Controller MAC: ");  Serial.println(smac.c_str());
  Serial.print("SSID: ");            Serial.println(ssid.c_str());
  Serial.print("PASSWORD: ");        Serial.println(pass.c_str());

  uint8_t initCh = (uint8_t)chVal[0];
  Serial.printf("Initial channel: %d\n", initCh);

  sscanf(smac.c_str(),
         "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx",
         &peerMac[0], &peerMac[1], &peerMac[2],
         &peerMac[3], &peerMac[4], &peerMac[5]);

  // 3) Bring up ESP-NOW
  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(initCh, WIFI_SECOND_CHAN_NONE);

  if (esp_now_init() == ESP_OK) {
    esp_now_register_send_cb(onEspNowSent);
    esp_now_peer_info_t peer = {};
    memcpy(peer.peer_addr, peerMac, 6);
    peer.channel = initCh;
    peer.encrypt = false;
    esp_now_add_peer(&peer);
    Serial.println("✅ ESP-NOW ready");
  } else {
    Serial.println("❌ ESP-NOW init failed");
  }

  // 4) Subscribe to channel-change notifications
  if (chanChar->canNotify()) {
    chanChar->registerForNotify(onChanNotify);
    Serial.println("🔔 Subscribed to channel updates");
  }

  Serial1.write(Single_Target_Detection_CMD, sizeof(Single_Target_Detection_CMD));
  delay(200);
  Serial.println("Single-target detection mode activated.");

  Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
}

void loop() {
  // 1) Read radar bytes & detect end-of-frame
  // Serial.printf(Serial1.available());
  while (Serial1.available()) {
    RX_BUF[RX_count++] = Serial1.read();
    if (RX_count >= sizeof(RX_BUF)) RX_count = sizeof(RX_BUF)-1;

    // Frame trailer 0x55,0xCC → decode & queue JSON
    if (RX_count > 1 &&
        RX_BUF[RX_count-2] == 0x55 &&
        RX_BUF[RX_count-1] == 0xCC) {
      processRadarData();       // builds JSON and queuePush()
    }

    // 2) Try to send one queued message immediately
    if (!queueEmpty() && !awaitingAck) {
      JSONMsg *m = queueFront();
      lastSeqSent  = m->seq;
      awaitingAck = true;

      esp_err_t res = esp_now_send(peerMac,
                                   (uint8_t*)m->data,
                                   m->len);
      if (res != ESP_OK) {
        Serial.printf("seq=%u send error\n", lastSeqSent);
        awaitingAck = false;   // will retry next iteration
      }
    }
  }

  // 3) And in case there was no serial data but we still have backlog,
  //    keep trying to send once per loop()
  if (!queueEmpty() && !awaitingAck) {
    JSONMsg *m = queueFront();
    lastSeqSent  = m->seq;
    awaitingAck = true;

    esp_err_t res = esp_now_send(peerMac,
                                 (uint8_t*)m->data,
                                 m->len);
    if (res != ESP_OK) {
      Serial.printf("seq=%u send error\n", lastSeqSent);
      awaitingAck = false;
    }
  }

  // non-blocking; loop continues immediately
}
