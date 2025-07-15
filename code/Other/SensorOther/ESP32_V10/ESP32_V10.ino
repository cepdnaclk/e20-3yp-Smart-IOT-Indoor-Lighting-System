#include <ArduinoJson.h>
#include <Preferences.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <math.h>
#include <WiFi.h>
#include <vector>
#include <string> 
//✅✅✅✅✅ Define Variables
// ⏱ Global timer variables
unsigned long lastAutomationCheck = 0;
const long automationInterval = 500;  // 0.5 seconds
Preferences preferences;
//PIN define
// ——— BLE UUIDs must match controller ———————————
#define SERVICE_UUID       "12345678-1234-1234-1234-1234567890AB"
#define UUID_MAC_CHAR      "12345678-1234-1234-1234-1234567890AC"
#define UUID_SSID_CHAR     "12345678-1234-1234-1234-1234567890AD"
#define UUID_PASS_CHAR     "12345678-1234-1234-1234-1234567890AE"
#define UUID_CHANNEL_CHAR  "12345678-1234-1234-1234-1234567890AF"

// BLE client globals
BLEAddress controllerAddr("");  // address of BLE controller
bool        doConnect     = false;   // flag to connect after discovery
BLEClient*  pClient       = nullptr; // BLE client pointer
BLERemoteCharacteristic* macChar;    // remote characteristic for MAC\ BLERemoteCharacteristic* ssidChar;   // remote characteristic for SSID
BLERemoteCharacteristic* ssidChar;
BLERemoteCharacteristic* passChar;   // remote characteristic for password
BLERemoteCharacteristic* chanChar;   // remote characteristic for channel
uint8_t    peerMac[6];   // peer MAC address buffer
#define RX_PIN 16
#define TX_PIN 17
#define BAUD_RATE 256000
uint8_t RX_BUF[64] = {0};
uint8_t RX_count = 0;
uint8_t RX_temp = 0;
int16_t target1_x = 0;
int16_t target1_y = 0;
uint16_t target1_speed = 0;
uint16_t target1_distance_res = 0;
float target1_distance = 0.0f;
float target1_angle = 0.0f;
struct tm ti;
//Shape structure define
struct Shape {
    String name;
    String type;
    int16_t x[4];
    int16_t y[4];
    int count;
    String equation;  
};
Shape shapes[10];  // Store up to 10 shapes
int shapeCount = 0;
uint8_t Single_Target_Detection_CMD[12] = {0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x80, 0x00, 0x04, 0x03, 0x02, 0x01};
//✅✅✅✅✅
// ——— JSON‐BUFFER QUEUE FOR SENDING ———
struct JSONMsg {
  uint32_t seq;       // sequence number
  uint16_t len;       // length of JSON data
  char     data[250]; // JSON payload buffer
};

// ——— simple ring-buffer queue for up to 64 messages ———
static const int QUEUE_SIZE = 64;
JSONMsg queueBuf[QUEUE_SIZE]; // message buffer
int     queueHead = 0, queueTail = 0; // head/tail indices

// ——— SEND STATE ———
static uint32_t seqNum       = 0;  // next sequence number
static uint32_t lastSeqSent  = 0;  // last seq sent awaiting ack
static bool     awaitingAck  = false; // flag if waiting for ack
bool            sendShapesFlag = false;  // unused flag for including shapes

String automationJson = R"json(
{
  "command": "update_automation_mode",
  "payload": {
    "Mode_Name": "Normal_Mode",
    "Areas": [
  {
    "type": "point",
    "name": "LightZone1",
    "equation": "(x - 1500)^2 + (y + 2000)^2 = 9000000",
    "x": [1500],
    "y": [-2000]
  },
  {
    "type": "Door",
    "name": "Door1",
    "equation": "y = -4800",
    "x": [-1000, 1000],
    "y": [-4800, -4800]
  },
  {
    "type": "Bed/Table",
    "name": "Bed1",
    "equation": "Rectangle with corners (-1500,-2500), (-500,-2500), (-500,-3500), (-1500,-3500)",
    "x": [-1500, -500, -500, -1500],
    "y": [-2500, -2500, -3500, -3500]
  },
  {
    "type": "point",
    "name": "DeskZone",
    "equation": "(x + 1000)^2 + (y + 3000)^2 = 1600000",
    "x": [-1000],
    "y": [-3000]
  },
  {
    "type": "Bed/Table",
    "name": "Table2",
    "equation": "Rectangle with corners (2000,-3000), (2800,-3000), (2800,-3800), (2000,-3800)",
    "x": [2000, 2800, 2800, 2000],
    "y": [-3000, -3000, -3800, -3800]
  }
],
    "Rules": [
      {
        "Rule_Name": "SleepZoneRule",
        "Area": {
          "type": "Bed/Table",
          "name": "Bed1",
          "equation": "Rectangle with corners (1000,2000), (1200,2000), (1200,2200), (1000,2200)",
          "x": [1000, 1200, 1200, 1000],
          "y": [2000, 2000, 2200, 2200]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b1", "intensity": 80 },
            { "bulb": "b2", "intensity": 60 }
          ],
          "OFF": [
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "22:00",
        "End_Time": "21:00",
        "Priority": "High"
      },
      {
        "Rule_Name": "BedMorningRule",
        "Area": {
          "type": "Bed/Table",
          "name": "Bed1",
          "equation": "Rectangle with corners (1000,2000), (1200,2000), (1200,2200), (1000,2200)",
          "x": [1000, 1200, 1200, 1000],
          "y": [2000, 2000, 2200, 2200]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b3", "intensity": 70 }],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "06:00",
        "End_Time": "05:59",
        "Priority": "Medium"
      },
      {
        "Rule_Name": "DoorMonitorMorning",
        "Area": {
          "type": "Door",
          "name": "Door1",
          "equation": "y = 1.5x + 300.0",
          "x": [1200, 1800],
          "y": [1800, 2400]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b4", "intensity": 50 }],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 }
          ]
        },
        "Start_Time": "08:00",
        "End_Time": "7:59",
        "Priority": "Low"
      },
      {
        "Rule_Name": "DoorEveningAlert",
        "Area": {
          "type": "Door",
          "name": "Door1",
          "equation": "y = 1.5x + 300.0",
          "x": [1200, 1800],
          "y": [1800, 2400]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b1", "intensity": 90 },
            { "bulb": "b4", "intensity": 90 }
          ],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 }
          ]
        },
        "Start_Time": "17:00",
        "End_Time": "16:59",
        "Priority": "High"
      },
      {
        "Rule_Name": "LightZoneDaytime",
        "Area": {
          "type": "point",
          "name": "LightZone1",
          "equation": "(x - 1500)^2 + (y - 2000)^2 = 9000000",
          "x": [1500],
          "y": [2000]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b2", "intensity": 70 },
            { "bulb": "b3", "intensity": 70 }
          ],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "09:00",
        "End_Time": "08:59",
        "Priority": "Low"
      },
      {
        "Rule_Name": "LightZoneEvening",
        "Area": {
          "type": "point",
          "name": "LightZone1",
          "equation": "(x - 1500)^2 + (y - 2000)^2 = 9000000",
          "x": [1500],
          "y": [2000]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 }],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "14:00",
        "End_Time": "13:59",
        "Priority": "Medium"
      },
            {
        "Rule_Name": "DeskZoneEvening",
        "Area": {
        "type": "point",
        "name": "DeskZone",
        "equation": "(x + 1000)^2 + (y + 3000)^2 = 1600000",
        "x": [-1000],
        "y": [-3000]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 },
                { "bulb": "b2", "intensity": 70 }
          ],
          "OFF": [
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "14:00",
        "End_Time": "13:59",
        "Priority": "Medium"
      },
      {
        "Rule_Name": "None",
        "Area": {
        "type": "None",
        "name": "None",
        "equation": "",
        "x": [],
        "y": []
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 },
                { "bulb": "b4", "intensity": 70 }
          ],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 }
          ]
        },
        "Start_Time": "14:00",
        "End_Time": "13:59",
        "Priority": "Medium"
      }
    ]
  }
}
)json";
//⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕
//🚪🚪🚪🚪🚪🚪🚪🚪🚪🚪🚪
////////////////////////////////////////////////////CHECK WEATHER INSIDE LINE////////////////////////////////////////////////////////
bool isInsideBoundaryArea(int x, int y) {
    return x >= -5000 && x <= 5000 && y >= -5000 && y <= 0;
}
int getSideOfLine(int x1, int y1, int x2, int y2, int px, int py) {
    int A = y2 - y1;
    int B = x1 - x2;
    int C = x2 * y1 - x1 * y2;
    int value = A * px + B * py + C;

    if (value > 0) return 1;  // One side
    if (value < 0) return -1; // Other side
    return 0;                  // Exactly on the line
}
int getOriginSide(int x1, int y1, int x2, int y2) {
    return getSideOfLine(x1, y1, x2, y2, 0, 0);
}
bool isPersonOnOriginSideOfLine(int x1, int y1, int x2, int y2, int personX, int personY) {
    if (!isInsideBoundaryArea(personX, personY)) {
        return false;  // Outside the area
    }

    int personSide = getSideOfLine(x1, y1, x2, y2, personX, personY);
    int originSide = getOriginSide(x1, y1, x2, y2);

    return personSide == originSide;
}
///////////////////////////////////////////////////CHECK INSIDE THE SHAPE//////////////////////////////////////////////
bool isInsideLine(int x, int y, Shape& shape) {
    // Assuming a line shape always has exactly 2 points (start and end).
    if (shape.count < 2) return false;

    int x1 = shape.x[0];
    int y1 = shape.y[0];
    int x2 = shape.x[1];
    int y2 = shape.y[1];

    return isPersonOnOriginSideOfLine(x1, y1, x2, y2, x, y);
}
//🚨🚨🚨🚨🚨🚨🚨🚨🚨
///////////////////////////////////////////////////CHECK WEATHER INSIDE CIRCLE///////////////////////////////////////////////////////
// Check if (x, y) is inside a circle (point shape with radius)
bool isInsideCircle(int x, int y, Shape& s) {
  // 1) Find the “=” in the equation, then grab everything after it as r²
  int eqPos = s.equation.indexOf('=');
  long radiusSq = 0;
  if (eqPos >= 0) {
    // substring from just after '=' to end, toInt() skips any leading spaces
    radiusSq = s.equation.substring(eqPos + 1).toInt();
  }
  // 2) Compute dx² + dy²
  long dx = (long)x - s.x[0];
  long dy = (long)y - s.y[0];
  // 3) Test circle membership
  return dx*dx + dy*dy <= radiusSq;
}

//🛏🛏🛏🛏🛏🛏🛏🛏🛏🛏
////////////////////////////////////////////////////////CHECK WHEATHER INSIDE TRIANGLE//////////////////////////////////////////////////
// Check if (x, y) is inside rectangle (simple bounding box check)
bool isInsideRectangle(int x, int y, Shape& shape) {
    int minX = shape.x[0];
    int maxX = shape.x[0];
    int minY = shape.y[0];
    int maxY = shape.y[0];

    for (int i = 1; i < shape.count; i++) {
        if (shape.x[i] < minX) minX = shape.x[i];
        if (shape.x[i] > maxX) maxX = shape.x[i];
        if (shape.y[i] < minY) minY = shape.y[i];
        if (shape.y[i] > maxY) maxY = shape.y[i];
    }

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
}
//⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕
// ── at the top ──
DynamicJsonDocument autoDoc(32768);
JsonArray rules;           // will hold payload.Rules
// ── revised loadShapesFromJson ──
void loadShapesFromJson(const String& jsonStr) {
  // 1) parse the whole document
  DeserializationError err = deserializeJson(autoDoc, jsonStr);
  if (err) {
    Serial.print("❌ JSON parse error: ");
    Serial.println(err.c_str());
    return;
  }

  // 2) grab the payload object
  JsonObject payload = autoDoc["payload"].as<JsonObject>();

  // 3) extract Areas → shapes[]
  JsonArray areas = payload["Areas"].as<JsonArray>();
  shapeCount = 0;
  for (JsonObject area : areas) {
    if (shapeCount >= 10) break;

    shapes[shapeCount].name     = area["name"].as<String>();
    String rawType              = area["type"].as<String>();
    shapes[shapeCount].type     = (rawType == "point") ? "point"
                                : (rawType == "Door")  ? "line"
                                :                       "rectangle";
    shapes[shapeCount].equation = area["equation"].as<String>();
    shapes[shapeCount].count    = area["x"].size();

    for (int i = 0; i < shapes[shapeCount].count; i++) {
      shapes[shapeCount].x[i] = area["x"][i].as<int>();
      shapes[shapeCount].y[i] = area["y"][i].as<int>();
    }
    shapeCount++;
  }
  Serial.printf("✅ Loaded %d shapes\n", shapeCount);

  // 4) extract Rules once into our global rules
  rules = payload["Rules"].as<JsonArray>();
}
static const char*  NTP_SERVER1     = "pool.ntp.org";
static const char*  NTP_SERVER2     = "time.nist.gov";
const long          GMT_OFFSET_SEC  = 19800;    // +5:30
const int           SYNC_TIMEOUT_MS = 60000;    // give up after 60 s
const int           RETRY_INTERVAL  = 1000;     // try every 1 s
bool timeSynced = false;
// Call this once in setup(), before anything else needs time:
void syncTimeOnce() {
  configTime(GMT_OFFSET_SEC, 0, NTP_SERVER1, NTP_SERVER2);
  unsigned long start = millis();
  struct tm tminfo;

  while (!timeSynced && millis() - start < SYNC_TIMEOUT_MS) {
    if (getLocalTime(&tminfo)) {
      // success!
      Serial.println(&tminfo, "⏰ Time synced: %Y-%m-%d %H:%M:%S");
      timeSynced = true;
      break;
    }
    Serial.println("⏳ Time sync failed, retrying in 1 s…");
    delay(RETRY_INTERVAL);
  }

  if (!timeSynced) {
    Serial.println("❌ Could not sync time—restarting ESP32");
    ESP.restart();
  }

  // Once synced, turn off Wi-Fi to save power / free the radio
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  Serial.println("🔌 Wi-Fi turned off; clock will now run locally");
}
std::vector<String> getHighestPriorityShape() {
    std::vector<String> bestNames;
    int bestPriority = -1;

    // --- 1) Early-out for (0,0) as a special “no-shape” case ---
    if (target1_x == 0 && target1_y == 0) {
        bestNames.push_back("None");    // priority 0
        return bestNames;
    }

    // --- 2) Your existing loop to find any matching shapes ---
    for (int i = 0; i < shapeCount; i++) {
        bool isInside = false;
        int priority = 0;

        if (shapes[i].type == "rectangle" &&
            isInsideRectangle(target1_x, target1_y, shapes[i])) {
            isInside = true;  priority = 3;
        }
        else if (shapes[i].type == "point" &&
                 isInsideCircle(target1_x, target1_y, shapes[i])) {
            isInside = true;  priority = 2;
        }
        else if (shapes[i].type == "line" &&
                 isInsideLine(target1_x, target1_y, shapes[i])) {
            isInside = true;  priority = 1;
        }

        if (!isInside) continue;

        if (priority > bestPriority) {
            bestPriority = priority;
            bestNames.clear();
            bestNames.push_back(shapes[i].name);
        }
        else if (priority == bestPriority) {
            bestNames.push_back(shapes[i].name);
        }
    }

    // --- 3) If nothing matched, give “None” at priority 0 ---
    if (bestNames.empty()) {
        bestNames.push_back("None");
    }
    //🖨🖨🖨🖨🖨🖨
        for (size_t i = 0; i < bestNames.size(); ++i) {
        Serial.print(bestNames[i]);
        if (i + 1 < bestNames.size()) {
            Serial.print(", ");
        }
    }
    Serial.println();
    //🖨🖨🖨🖨🖨🖨
    return bestNames;
}

void applyAutomationRules() {
  auto matched = getHighestPriorityShape();
  if (matched.empty()) return;

  struct tm ti;
  if (!getLocalTime(&ti)) return;
  int nowMins = ti.tm_hour*60 + ti.tm_min;

  int b1=0, b2=0, b3=0, b4=0;
  bool any = false;

  for (JsonObject r : rules) {
    // only rules for our matched shapes
    String nm = r["Area"]["name"].as<String>();
    if (!std::count(matched.begin(), matched.end(), nm)) continue;

    // time window
    String S = r["Start_Time"].as<String>(),
           E = r["End_Time"].as<String>();
    int sH=S.substring(0,2).toInt(), sM=S.substring(3,2).toInt();
    int eH=E.substring(0,2).toInt(), eM=E.substring(3,2).toInt();
    int sTot=sH*60+sM, eTot=eH*60+eM;
    bool inRange = (eTot<sTot) ? (nowMins>=sTot||nowMins<=eTot)
                               : (nowMins>=sTot&&nowMins<=eTot);
    if (!inRange) continue;
    any = true;

    // merge ON intensities
    for (JsonObject b : r["Selected_Bulbs"]["ON"].as<JsonArray>()) {
      String bulb = b["bulb"].as<String>();
      int val     = b["intensity"].as<int>();
      if      (bulb == "b1" && val > b1) b1 = val;
      else if (bulb == "b2" && val > b2) b2 = val;
      else if (bulb == "b3" && val > b3) b3 = val;
      else if (bulb == "b4" && val > b4) b4 = val;
    }
  }

  if (any) {
    Serial.printf("💡 Merged Bulbs → b1:%d b2:%d b3:%d b4:%d\n", b1,b2,b3,b4);
    sendBulbStatus(b1,b2,b3,b4);
  } else {
    Serial.println("No active rule right now");
  }
}


// 🔁 Track previous bulb values to avoid redundant sends
int prev_b1 = -1, prev_b2 = -1, prev_b3 = -1, prev_b4 = -1;

void sendBulbStatus(int b1, int b2, int b3, int b4) {
  // Check if bulbs changed before sending
  if (b1 == prev_b1 && b2 == prev_b2 && b3 == prev_b3 && b4 == prev_b4) {
    return; // No change, do not send
  }

  // Update previous values
  prev_b1 = b1;
  prev_b2 = b2;
  prev_b3 = b3;
  prev_b4 = b4;

  // Prepare the JSON using snprintf
  char json[250];
  snprintf(json, sizeof(json),
           "{\"c\":\"a\",\"p\":{\"m\":[{\"b\":1,\"l\":%d},"
           "{\"b\":2,\"l\":%d},{\"b\":3,\"l\":%d},{\"b\":4,\"l\":%d}]}}",
           b1, b2, b3, b4);

  // Print for debugging
  Serial.println(json);

  // Send the message via ESP-NOW (convert to char array first)
  JSONMsg m;
  m.seq = seqNum++;
  m.len = strlen(json);
  memcpy(m.data, json, m.len);
  queuePush(m);
  Serial.println(json);
}


// void sendBulbStatus(int b1, int b2, int b3, int b4) {
//   // Check if bulbs changed before sending
//   if (b1 == prev_b1 && b2 == prev_b2 && b3 == prev_b3 && b4 == prev_b4) {
//     return; // No change, do not send
//   }

//   // Update previous values
//   prev_b1 = b1;
//   prev_b2 = b2;
//   prev_b3 = b3;
//   prev_b4 = b4;
// StaticJsonDocument<250> doc;
// doc["c"] = "a";
// JsonObject p = doc.createNestedObject("p");
// JsonArray jarr = p.createNestedArray("m");
// JsonObject e1 = jarr.createNestedObject();
// e1["b"] = 1; 
// e1["l"] = b1;
// JsonObject e2 = jarr.createNestedObject();
// e2["b"] = 2; 
// e2["l"] = b2;
// JsonObject e3 = jarr.createNestedObject();
// e3["b"] = 3; 
// e3["l"] = b3;
// JsonObject e4 = jarr.createNestedObject();
// e4["b"] = 4; 
// e4["l"] = b4;
// // serialize to buffer
// char buf[250];
// size_t n = serializeJson(doc, buf, sizeof(buf));
//   JSONMsg m;
//   m.seq = seqNum++;
//   m.len = n;
//   memcpy(m.data, buf, n);
//   queuePush(m);
//   Serial.println(buf);
// }
//🚨🚨🚨🚨🚨
bool queueEmpty() { return queueHead == queueTail; }
bool queueFull()  { return ((queueTail + 1) % QUEUE_SIZE) == queueHead; }

// Push new message: if full, flush everything first
void queuePush(const JSONMsg &m) {
  if (queueFull()) {
    Serial.println("⚠ JSON queue full — flushing");
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
//🚨🚨🚨🚨🚨
// ——— ESP-NOW send callback ———
void onEspNowSent(const uint8_t* mac_addr, esp_now_send_status_t status) {
    Serial.printf("→ onEspNowSent(status=%d)\n", status);
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
//🚨🚨🚨🚨🚨
int16_t previous_target1_x = 0;
int16_t previous_target1_y = 0;
void trySendNextMsg() {
  if (queueEmpty() || awaitingAck) return;
  JSONMsg *front = queueFront();
  if (!front) return;

  lastSeqSent = front->seq;
  awaitingAck = true;
  Serial.printf("→ Sending seq=%u (%u bytes)\n",
                (unsigned)front->seq,
                (unsigned)front->len);

  esp_err_t res = esp_now_send(peerMac, (uint8_t*)front->data, front->len);
  if (res != ESP_OK) {
    Serial.printf("⚠ esp_now_send error: %d\n", (int)res);
    awaitingAck = false;
  }
}

void processRadarData() {
    // Only proceed if we have a full 0x55,0xCC frame
    if (RX_count < 32) return;

    // 1) Parse raw X/Y from RX_BUF
    uint16_t rawX = (RX_BUF[4] | (RX_BUF[5] << 8));
    int16_t newX;
    if (rawX >= 32768) {
      rawX -= 32768;
      newX = (int16_t)rawX;
    } else {
      newX = -(int16_t)rawX;
    }

    uint16_t rawY = (RX_BUF[6] | (RX_BUF[7] << 8));
    int16_t newY;
    if (rawY >= 32768) {
      rawY -= 32768;
    }
    newY = -(int16_t)rawY;

    // 2) Only update if non-zero; otherwise keep the previous coordinate
    if (newX != 0) {
      target1_x = newX;
    }
    if (newY != 0) {
      target1_y = newY;
    }
    previous_target1_x = target1_x;
    previous_target1_y = target1_y;

    // 3) Print to Serial so we know we actually got some data
    Serial.print("Target 1 → X: ");
    Serial.print(target1_x);
    Serial.print("   Y: ");
    Serial.println(target1_y);
char buf[100];
  int n = snprintf(buf, sizeof(buf),
    "{\"command\":\"coordinates\",\"payload\":"
      "{\"seq\":%u,\"x\":%d,\"y\":%d}}",
    seqNum,
    target1_x,
    target1_y
  );

  if (n < 0 || n >= (int)sizeof(buf)) {
    Serial.println(F("⚠ snprintf truncated or error!"));
    // Clear RX buffer and abort:
    RX_count = 0;
    memset(RX_BUF, 0, sizeof(RX_BUF));
    return;
  }

  Serial.printf("→ JSON‐len: %d   Contents: %s\n", n, buf);

  // ── Queue it for ESP-NOW ──
  JSONMsg m;
  m.seq = seqNum++;
  m.len = (uint16_t)n;
  memcpy(m.data, buf, n);
  queuePush(m);
  Serial.printf("→ queued %u bytes (head=%d, tail=%d)\n",
                (unsigned)m.len, queueHead, queueTail);

  // ── Clear RX buffer for next frame ──
  RX_count = 0;
  memset(RX_BUF, 0, sizeof(RX_BUF));
}

void initLinks() {
  // —— 1) BLE scan + connect ——  
  BLEDevice::init("");
  BLEScan* scanner = BLEDevice::getScan();
  scanner->setAdvertisedDeviceCallbacks(new ScanCB());
  scanner->setInterval(100);
  scanner->setWindow(99);
  scanner->setActiveScan(true);
  Serial.println("🔍 Scanning for BLE service...");
  scanner->start(0, nullptr);  // scan indefinitely
  
  // Block until ScanCB::onResult sets doConnect = true
  while (!doConnect) {
    delay(50);
  }
  scanner->stop();
  Serial.println("✅ BLE controller found, connecting...");

  // Create client and block until connected
  while (true) {
    pClient = BLEDevice::createClient();
    if (pClient->connect(controllerAddr)) {
      Serial.println("🔗 BLE connected");
      break;
    }
    Serial.println("⚠ BLE connection failed, retrying in 500ms...");
    delay(500);
  }

  // —— 2) Get service + characteristics ——  
  BLERemoteService* svc = nullptr;
  while (!svc) {
    svc = pClient->getService(SERVICE_UUID);
    if (!svc) {
      Serial.println("⚠ Service not found yet, retrying in 500ms...");
      delay(500);
    }
  }

  macChar  = svc->getCharacteristic(UUID_MAC_CHAR);
  ssidChar = svc->getCharacteristic(UUID_SSID_CHAR);
  passChar = svc->getCharacteristic(UUID_PASS_CHAR);
  chanChar = svc->getCharacteristic(UUID_CHANNEL_CHAR);

  // If any characteristic is missing, retry until all four are valid
  while (!(macChar && ssidChar && passChar && chanChar)) {
Serial.println("⚠ Missing one or more BLE characteristics, retrying in 500ms...");
delay(500);

// Attempt to get the service and characteristics again
svc = pClient->getService(SERVICE_UUID);

// Try to get each characteristic and check if it's found
macChar  = svc->getCharacteristic(UUID_MAC_CHAR);
if (macChar) {
  Serial.println("✅ MAC Characteristic received.");
} else {
  Serial.println("❌ MAC Characteristic not found.");
}

ssidChar = svc->getCharacteristic(UUID_SSID_CHAR);
if (ssidChar) {
  Serial.println("✅ SSID Characteristic received.");
} else {
  Serial.println("❌ SSID Characteristic not found.");
}

passChar = svc->getCharacteristic(UUID_PASS_CHAR);
if (passChar) {
  Serial.println("✅ PASS Characteristic received.");
} else {
  Serial.println("❌ PASS Characteristic not found.");
}

chanChar = svc->getCharacteristic(UUID_CHANNEL_CHAR);
if (chanChar) {
  Serial.println("✅ CHANNEL Characteristic received.");
} else {
  Serial.println("❌ CHANNEL Characteristic not found.");
}

  }

  // Read BLE characteristic values
  // Read into Arduino String first:
  String smacA  = macChar->readValue();
  String ssidA  = ssidChar->readValue();
  String passA  = passChar->readValue();
  String chValA = chanChar->readValue();

  // Then convert each to std::string via c_str():
  std::string smac  = std::string(smacA.c_str());
  std::string ssid  = std::string(ssidA.c_str());
  std::string pass  = std::string(passA.c_str());
  std::string chVal = std::string(chValA.c_str());

  Serial.print("Controller MAC: ");  Serial.println(smac.c_str());
  Serial.print("SSID: ");            Serial.println(ssid.c_str());
  Serial.print("PASSWORD: ");        Serial.println(pass.c_str());

  uint8_t initCh = (uint8_t)chVal[0];
  Serial.printf("Initial channel: %d\n", initCh);

  sscanf(smac.c_str(),
         "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx",
         &peerMac[0], &peerMac[1], &peerMac[2],
         &peerMac[3], &peerMac[4], &peerMac[5]);



    WiFi.mode(WIFI_STA);  // Station mode (no AP)
    WiFi.begin(ssid.c_str(), pass.c_str());
    //WiFi.begin("SLT_FIBRE", "slt56540");
    //WiFi.begin("Redmi13C", "Hiruni2001");
    //WiFi.begin("iPhone (2)", "12345678");
    //WiFi.begin("MSI 2106", "863J67;u");
    //WiFi.begin("Eng-Student", "3nG5tuDt");
    //WiFi.begin("PeraComStaff", "pera1234");
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("WiFi connected!");
    syncTimeOnce();

  // —— 3) ESP-NOW init + peer add ——  
  // 3) Bring up ESP-NOW
  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(initCh, WIFI_SECOND_CHAN_NONE);
  Serial.println("⏳ Initializing ESP-NOW...");
  while (true) {
    if (esp_now_init() == ESP_OK) {
      esp_now_register_send_cb(onEspNowSent);
 //     esp_now_register_recv_cb(onDataRecv);
      esp_now_peer_info_t peer = {};
      memcpy(peer.peer_addr, peerMac, 6);
      peer.channel = initCh;
      peer.encrypt = false;
      esp_err_t peerRes = esp_now_add_peer(&peer);
      if (peerRes == ESP_OK) {
        Serial.println("✅ ESP-NOW ready");
        break;
      } else {
        Serial.printf("⚠ esp_now_add_peer returned %d, retrying in 500ms...\n", peerRes);
        esp_now_deinit();
      }
    } else {
      Serial.println("⚠ esp_now_init() failed, retrying in 500ms...");
    }
    delay(500);
  }

  // —— 4) Subscribe to channel-change notifications ——  
  if (chanChar->canNotify()) {
    chanChar->registerForNotify(onChanNotify);
    Serial.println("🔔 Subscribed to channel updates");
  } else {
    Serial.println("⚠ Channel characteristic does not support notifications");
  }
}
void setup() {
    Serial.begin(115200);
    Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
    WiFi.mode(WIFI_STA);  // Station mode (no AP)
    //WiFi.begin("Dialog 4G C9D", "g2dM273d");  // Replace with real Wi-Fi credentials
    // //WiFi.begin("SLT_FIBRE", "slt56540");
    // //WiFi.begin("Redmi13C", "Hiruni2001");
    // //WiFi.begin("iPhone (2)", "12345678");
    // //WiFi.begin("MSI 2106", "863J67;u");
    // //WiFi.begin("Eng-Student", "3nG5tuDt");
    // //WiFi.begin("PeraComStaff", "pera1234");
    // while (WiFi.status() != WL_CONNECTED) {
    //   delay(500);
    //   Serial.print(".");
    // }
    // Serial.println("WiFi connected!");
    // syncTimeOnce();
    initLinks();
    Serial1.setRxBufferSize(64);  // Set buffer size
    Serial.println("RD-03D Radar Module Initialized");
    Serial.println(WiFi.localIP());
    Serial1.write(Single_Target_Detection_CMD, sizeof(Single_Target_Detection_CMD));
    delay(200);
    Serial.println("Single-target detection mode activated.");
    loadShapesFromJson(automationJson);  // ✅ dynamically load from JSON
    deserializeJson(autoDoc, automationJson);
    rules = autoDoc["payload"]["Rules"].as<JsonArray>();
    lastAutomationCheck = millis();
}

void loop() {
    static unsigned long lastBlink = 0;
  if (millis() - lastBlink >= 1000) {
    Serial.println(F("🔄 loop() is alive"));
    lastBlink = millis();
  }
      if (!pClient || !pClient->isConnected()) {
        Serial.println(F("⚠ BLE died, re-initializing…"));
        initLinks();
      }
      if (!esp_now_is_peer_exist(peerMac)) {
        Serial.println(F("⚠ ESP-NOW peer gone, re-initializing…"));
        initLinks();
      }
        while (Serial1.available()) {
    RX_temp = Serial1.read();
    RX_BUF[RX_count++] = RX_temp;

    // Prevent buffer overflow
    if (RX_count >= sizeof(RX_BUF)) {
      RX_count = sizeof(RX_BUF) - 1;
    }

    // Check for end of frame (0xCC, 0x55)
    if ((RX_count > 1) && (RX_BUF[RX_count - 1] == 0xCC) && (RX_BUF[RX_count - 2] == 0x55)) {
      processRadarData();
    
    }
  }
      //readRadarFrames();
      trySendNextMsg();
// —— D) Automation Rules Every 0.5 s ——  
    if (timeSynced && millis() - lastAutomationCheck >= automationInterval) {
    lastAutomationCheck = millis();
    applyAutomationRules();
  }
}