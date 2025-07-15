//correct
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

#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#include <LittleFS.h>
#include <ArduinoJson.h>

#define JSON_FILE_PATH "/automation.json"

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
// right below your other characteristic pointers…
static BLERemoteCharacteristic* dataChar = nullptr;

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

// String automationJson = R"json(
// {
//   "command": "update_automation_mode",
//   "payload": {
//     "Mode_Name": "Normal_Mode",
//     "Areas": [
//   {
//     "type": "point",
//     "name": "LightZone1",
//     "equation": "(x - 1500)^2 + (y + 2000)^2 = 9000000",
//     "x": [1500],
//     "y": [-2000]
//   },
//   {
//     "type": "Door",
//     "name": "Door1",
//     "equation": "y = -4800",
//     "x": [-1000, 1000],
//     "y": [-4800, -4800]
//   },
//   {
//     "type": "Bed/Table",
//     "name": "Bed1",
//     "equation": "Rectangle with corners (-1500,-2500), (-500,-2500), (-500,-3500), (-1500,-3500)",
//     "x": [-1500, -500, -500, -1500],
//     "y": [-2500, -2500, -3500, -3500]
//   },
//   {
//     "type": "point",
//     "name": "DeskZone",
//     "equation": "(x + 1000)^2 + (y + 3000)^2 = 1600000",
//     "x": [-1000],
//     "y": [-3000]
//   },
//   {
//     "type": "Bed/Table",
//     "name": "Table2",
//     "equation": "Rectangle with corners (2000,-3000), (2800,-3000), (2800,-3800), (2000,-3800)",
//     "x": [2000, 2800, 2800, 2000],
//     "y": [-3000, -3000, -3800, -3800]
//   }
// ],
//     "Rules": [
//       {
//         "Rule_Name": "SleepZoneRule",
//         "Area": {
//           "type": "Bed/Table",
//           "name": "Bed1",
//           "equation": "Rectangle with corners (1000,2000), (1200,2000), (1200,2200), (1000,2200)",
//           "x": [1000, 1200, 1200, 1000],
//           "y": [2000, 2000, 2200, 2200]
//         },
//         "Selected_Bulbs": {
//           "ON": [
//             { "bulb": "b1", "intensity": 80 },
//             { "bulb": "b2", "intensity": 60 }
//           ],
//           "OFF": [
//             { "bulb": "b3", "intensity": 0 },
//             { "bulb": "b4", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "22:00",
//         "End_Time": "21:00",
//         "Priority": "High"
//       },
//       {
//         "Rule_Name": "BedMorningRule",
//         "Area": {
//           "type": "Bed/Table",
//           "name": "Bed1",
//           "equation": "Rectangle with corners (1000,2000), (1200,2000), (1200,2200), (1000,2200)",
//           "x": [1000, 1200, 1200, 1000],
//           "y": [2000, 2000, 2200, 2200]
//         },
//         "Selected_Bulbs": {
//           "ON": [{ "bulb": "b3", "intensity": 70 }],
//           "OFF": [
//             { "bulb": "b1", "intensity": 0 },
//             { "bulb": "b2", "intensity": 0 },
//             { "bulb": "b4", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "06:00",
//         "End_Time": "05:59",
//         "Priority": "Medium"
//       },
//       {
//         "Rule_Name": "DoorMonitorMorning",
//         "Area": {
//           "type": "Door",
//           "name": "Door1",
//           "equation": "y = 1.5x + 300.0",
//           "x": [1200, 1800],
//           "y": [1800, 2400]
//         },
//         "Selected_Bulbs": {
//           "ON": [{ "bulb": "b4", "intensity": 50 }],
//           "OFF": [
//             { "bulb": "b1", "intensity": 0 },
//             { "bulb": "b2", "intensity": 0 },
//             { "bulb": "b3", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "08:00",
//         "End_Time": "7:59",
//         "Priority": "Low"
//       },
//       {
//         "Rule_Name": "DoorEveningAlert",
//         "Area": {
//           "type": "Door",
//           "name": "Door1",
//           "equation": "y = 1.5x + 300.0",
//           "x": [1200, 1800],
//           "y": [1800, 2400]
//         },
//         "Selected_Bulbs": {
//           "ON": [
//             { "bulb": "b1", "intensity": 90 },
//             { "bulb": "b4", "intensity": 90 }
//           ],
//           "OFF": [
//             { "bulb": "b2", "intensity": 0 },
//             { "bulb": "b3", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "17:00",
//         "End_Time": "16:59",
//         "Priority": "High"
//       },
//       {
//         "Rule_Name": "LightZoneDaytime",
//         "Area": {
//           "type": "point",
//           "name": "LightZone1",
//           "equation": "(x - 1500)^2 + (y - 2000)^2 = 9000000",
//           "x": [1500],
//           "y": [2000]
//         },
//         "Selected_Bulbs": {
//           "ON": [
//             { "bulb": "b2", "intensity": 70 },
//             { "bulb": "b3", "intensity": 70 }
//           ],
//           "OFF": [
//             { "bulb": "b1", "intensity": 0 },
//             { "bulb": "b4", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "09:00",
//         "End_Time": "08:59",
//         "Priority": "Low"
//       },
//       {
//         "Rule_Name": "LightZoneEvening",
//         "Area": {
//           "type": "point",
//           "name": "LightZone1",
//           "equation": "(x - 1500)^2 + (y - 2000)^2 = 9000000",
//           "x": [1500],
//           "y": [2000]
//         },
//         "Selected_Bulbs": {
//           "ON": [{ "bulb": "b1", "intensity": 100 }],
//           "OFF": [
//             { "bulb": "b2", "intensity": 0 },
//             { "bulb": "b3", "intensity": 0 },
//             { "bulb": "b4", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "14:00",
//         "End_Time": "13:59",
//         "Priority": "Medium"
//       },
//             {
//         "Rule_Name": "DeskZoneEvening",
//         "Area": {
//         "type": "point",
//         "name": "DeskZone",
//         "equation": "(x + 1000)^2 + (y + 3000)^2 = 1600000",
//         "x": [-1000],
//         "y": [-3000]
//         },
//         "Selected_Bulbs": {
//           "ON": [{ "bulb": "b1", "intensity": 100 },
//                 { "bulb": "b2", "intensity": 70 }
//           ],
//           "OFF": [
//             { "bulb": "b3", "intensity": 0 },
//             { "bulb": "b4", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "14:00",
//         "End_Time": "13:59",
//         "Priority": "Medium"
//       },
//       {
//         "Rule_Name": "None",
//         "Area": {
//         "type": "None",
//         "name": "None",
//         "equation": "",
//         "x": [],
//         "y": []
//         },
//         "Selected_Bulbs": {
//           "ON": [{ "bulb": "b1", "intensity": 100 },
//                 { "bulb": "b4", "intensity": 70 }
//           ],
//           "OFF": [
//             { "bulb": "b2", "intensity": 0 },
//             { "bulb": "b3", "intensity": 0 }
//           ]
//         },
//         "Start_Time": "14:00",
//         "End_Time": "13:59",
//         "Priority": "Medium"
//       }
//     ]
//   }
// }
// )json";

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SAVE JSON TO LITTLEFS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Call this once in setup
void initLittleFS() {
  if (!LittleFS.begin(true)) {
    Serial.println("❌ Failed to mount LittleFS");
  } else {
    Serial.println("✅ LittleFS mounted successfully");
  }
}

// Save or replace JSON
bool saveJsonToFile(const String& jsonContent) {
  File file = LittleFS.open(JSON_FILE_PATH, "w");
  if (!file) {
    Serial.println("❌ Failed to open file for writing");
    return false;
  }
  file.print(jsonContent);
  file.close();
  Serial.println("✅ JSON saved to file");
  return true;
}

// Read JSON
String readJsonFromFile() {
  File file = LittleFS.open(JSON_FILE_PATH, "r");
  if (!file) {
    Serial.println("❌ Failed to open file for reading");
    return "";
  }
  String content = file.readString();
  file.close();
  Serial.println("✅ JSON read from file");
  return content;
}

void printLittleFSUsage() {
  size_t total = LittleFS.totalBytes();
  size_t used = LittleFS.usedBytes();
  Serial.printf("💾 LittleFS usage: %u KB used / %u KB total\n", used / 1024, total / 1024);
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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

  JsonObject payload = autoDoc["payload"].as<JsonObject>();
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  MQTT INITIALIZATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// bool timeSynced = false;
String automationJson = "";
String receivedRule = "";
bool ruleReceived = false;

 WiFiClientSecure secureClient;
PubSubClient mqttClient(secureClient);

// ====== AWS IoT MQTT Settings ======
const char* mqttServer = "d012012821ffpbdagc8s8-ats.iot.eu-north-1.amazonaws.com";
const int mqttPort = 8883;
const char* subscribeTop = "Tharindu/94:54:C5:B7:E3:2C/receive_rule_from_backend";
const char* publishTop = "Tharindu/94:54:C5:B7:E3:2C/request_rule_from_backend";

// Callback for MQTT
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  receivedRule = "";
  for (unsigned int i = 0; i < length; i++) {
    receivedRule += (char)payload[i];
  }
  ruleReceived = true;
}

void MqttRecieveJson() {
  // Wait for WiFi to be connected first

// ========= AWS IoT Certificates =============
const char* root_ca_pem = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----
)EOF";

const char* certificate_pem_crt = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDWTCCAkGgAwIBAgIUQtOTg1TUIwTIzLji0t/PQxVoDlIwDQYJKoZIhvcNAQEL
BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI1MDIyMjE4Mzk1
MFoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM1a0KvRjKry8Sq3vUyQ
hC+/7D2Ow873Bf+D9MUAfosi/bJ0YCOa5yYsANKe0Y6d3yY6VNsqWsHEJiFYcGln
zLseazwl25XQsrG22QrBzlzWUUQlcRt/kvf/GLptlg0cGSA6pw2709/+Xo8C8ts5
pvKCcnt4gL8XG9uFi5pt8WqFW1/JL5YvFBnv3FzODnyRhgOozhGSKRhJ6Jgjp7DZ
ZSJGTzz6T0i9BV3eXxTrcT2NoVTik1Sa5IKgtGo1/EFbwFbApXs5ad6QL3NcHfg2
VBvbbIvlxHcDfoxXrJP2ljcr1Lepibk+n98iQMwFr2pvdw3Ded54JRoroIWqlqH9
XIkCAwEAAaNgMF4wHwYDVR0jBBgwFoAUJJS98RgzmlsuokLxb1CqLkn5zx0wHQYD
VR0OBBYEFL4AF6yYRvpig0639GU+vYc1TmuFMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQBNbJaXA3+NANCFsEziBYm9rQfg
BsCcMfjGdnaIAveldHTZjmtQGneL8v4GbN/8V3h4VhZ1HVC37YMEtnwEYRfTIPxM
pTNNW3o54/QLZOP0ZQ4bCLu0uAAp5/m3oIcHU5PUdocYyd8aqyThSDYEEOj1C92x
68hqCLIPAsTkrphPO8E9zlpauOV01LdUEHzija6hz91Vtviv1zr2JQxmYG0sk4yi
Nisp0Tx+KD0OaUgamnzwzsiCTyQm5hf8IqHSuVF8Qd/23nSYOhf5jWXnh/D/BZcm
EsKlfhiwkCvbPi4d2F9b3qxQb6UH4mn1pmxb5ILGqMR2htWQpM3BmX2LDRwm
-----END CERTIFICATE-----
)EOF";

const char* private_pem_key = R"EOF(
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAzVrQq9GMqvLxKre9TJCEL7/sPY7DzvcF/4P0xQB+iyL9snRg
I5rnJiwA0p7Rjp3fJjpU2ypawcQmIVhwaWfMux5rPCXbldCysbbZCsHOXNZRRCVx
G3+S9/8Yum2WDRwZIDqnDbvT3/5ejwLy2zmm8oJye3iAvxcb24WLmm3xaoVbX8kv
li8UGe/cXM4OfJGGA6jOEZIpGEnomCOnsNllIkZPPPpPSL0FXd5fFOtxPY2hVOKT
VJrkgqC0ajX8QVvAVsClezlp3pAvc1wd+DZUG9tsi+XEdwN+jFesk/aWNyvUt6mJ
uT6f3yJAzAWvam93DcN53nglGiughaqWof1ciQIDAQABAoIBAArbd1buQFq1d4zD
pC2NIoAHzKzAhJfHtbh5uJJF4Wrn0bQCtSaMxRXek7iPDxNUQ30Y7m2cAqpl/YIb
0+2uwENQa2kFs2NrYldFDJql/owoBKnutNk4WIPmJ9+LdbiBuM5ca4KtYJliMIut
Izv2A16lCPqAN4Zi6WUk3Wmv0GjKRfcyubdtAk62fH5wYTgKfL8fpFAUal5bE7U8
aKG9bH+khqQOP2nq+Gq3TzjpCwP2XO/MuNjPHJsSydl4z4ijcFcD27beZk0ECrVn
fja7lBbGXqyyArp+QQSdlr7DVyEkNG5TpVaISuCYKz4vXL0lSswzxDRZqqddkFBc
+mTqybUCgYEA6msYEwEgdqEW04yrjuqNmFgP7cZhNPAFSXfzwZkUE7mvuEiUVjdL
dPoe/d1cucbJUV6md6w0z2mbpDhFqpCIFemooOx4cX2QHCKnGKB8KKqKLxyvppeV
yT07jXMEq3tFv4JwnTcHZ5LG2hiVPD46wKIOSzKucG2I6INeBrHIYjcCgYEA4EK7
1K8oWHy0cp36es+UmrrcqtLukyrlFn7SJxkFzJB7hyzHPYtR6v3ijU7ibhlaOckL
X0tPl3w2t6pkF11qm4rafo5zKQlHBbAlt/jN+7Bg3qOwzYayrQs9297Qh8VUtx4E
kQesXbDVK5HHRDhk4zr6YR+k1qhVnCk2kD3X1z8CgYEAhLH+vLNElyJ082eLrajk
YjpnOee0Gu1LcN0v5IUsskXITH75SRyf4CW96WKnHJqEV0VG4jNe6ZIUgo9AEF8k
SZMs23tAaq3zJ5oOEIi3/6UZ97U7UQg5x+KblWRoXlG3l8LU0InX7S9O1SJZR/LJ
+0VA5hxYVlgKyeOjFBMLJV0CgYAwlYSHwSKmeO3G3v7C2HHDS7Q+tc/Fxkc3JmZ0
3fDprmt0j3jilmo61KHeJzbaz1dCqZFzJaeqk9hu1dU1UqGj7OMFA+ti+oWOb+jc
AGTvn/h8g03sWMAgyQyvs4fNwixmN3SZzuXCrmqgM8bNusHwkHhpzicx8eoKGMuf
WCaIlQKBgQDOvumrZhSoLRiCLGKiV4ON2rysokK5bl+VxcjabSIQgBGnZgVbSQcM
lGLUsQFqY8wOkoOuS8afULodyD6jhmHiLQRcEDHUogQsMfYr0PBTkXJTQ0W/4YQp
vx8FVRXlD473SrMwnf22wK49MbyMkJ4JB4dIbam8cgd6183LThjZ7g==
-----END RSA PRIVATE KEY-----
)EOF";

  Serial.printf("💡 Free heap before MQTT Connect: %u bytes\n", ESP.getFreeHeap());
  
  Serial.print("⏳ Waiting for WiFi connection...");
  unsigned long wifiStart = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - wifiStart < 30000) { // 30 sec timeout
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\n❌ WiFi not connected, restarting...");
    ESP.restart();
  }
  Serial.println("\n✅ WiFi connected");
  Serial.printf("Free heap before TLS: %u\n", ESP.getFreeHeap());
  
  // Setup TLS certificates BEFORE MQTT server and connect
  secureClient.setCACert(root_ca_pem);
  secureClient.setCertificate(certificate_pem_crt);
  secureClient.setPrivateKey(private_pem_key);

  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(mqttCallback);

  Serial.println("🔐 Connecting to AWS IoT...");

  // Retry loop for MQTT connect (timeout 30s)
  unsigned long mqttStart = millis();
  while (!mqttClient.connected() && millis() - mqttStart < 30000) {
    Serial.print("Connecting to MQTT...");
    if (mqttClient.connect("Sensor_client_2001")) {
      Serial.println(" connected");
      mqttClient.subscribe(subscribeTop);
      Serial.println("📡 Subscribed to topic");
      break;
    } else {
      Serial.print(" failed, rc=");
      Serial.println(mqttClient.state());
      delay(2000);
    }
  }

  if (!mqttClient.connected()) {
    Serial.println("❌ MQTT connection failed after retries, restarting...");
    ESP.restart();
  }

  // Send basic status message
  StaticJsonDocument<256> doc;
  
  doc["command"] = "send_latest_sensor_rules";
  JsonObject payload = doc.createNestedObject("payload");
  payload["status"] = "Sensor_Start";
  
  char buffer[256];
  serializeJson(doc, buffer);
  mqttClient.publish(publishTop, buffer);
  Serial.println("📤 Sent status JSON");


  // Retry up to 3 times to get the rule
  const int maxAttempts = 3;
  int attempt = 1;

  while (attempt <= maxAttempts) {
    Serial.printf("📨 Sending rule request attempt %d/%d...\n", attempt, maxAttempts);
    mqttClient.publish(publishTop, buffer);

    receivedRule = "";
    ruleReceived = false;
    unsigned long ruleStart = millis();

    while (!ruleReceived && millis() - ruleStart < 50000) {
      mqttClient.loop();
      delay(10);
    }

    if (ruleReceived) {
      Serial.println("📥 Rule received from AWS IoT");
      automationJson = receivedRule;
      Serial.println("📦 Received JSON:");
      Serial.println(receivedRule);
      break; // ✅ exit the retry loop
    } else {
      Serial.println("⚠ No rule received, retrying...");
      attempt++;
    }
  }

  if (!ruleReceived) {
    Serial.println("❌ Failed to receive rule after 3 attempts. Restarting...");
    mqttClient.disconnect();
    delay(200);
    ESP.restart();
  }

  // Clean up
  mqttClient.disconnect();
  Serial.println("🔌 MQTT disconnected");
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WIFI DISCONNECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
void disconnectWiFi() {
  WiFi.disconnect(true);  // Disconnect and erase credentials
  WiFi.mode(WIFI_OFF);    // Turn off Wi-Fi hardware
  Serial.println("🔌 Wi-Fi turned off (Disconnected)");
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TIME SYNC >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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

  // for (JsonObject r : rules) {
  //   // only rules for our matched shapes
  //   String nm = r["Area"]["name"].as<String>();
  //   if (!std::count(matched.begin(), matched.end(), nm)) continue;

  //   // time window
  //   String S = r["Start_Time"].as<String>(),
  //          E = r["End_Time"].as<String>();
  //   int sH=S.substring(0,2).toInt(), sM=S.substring(3,2).toInt();
  //   int eH=E.substring(0,2).toInt(), eM=E.substring(3,2).toInt();
  //   int sTot=sH*60+sM, eTot=eH*60+eM;
  //   bool inRange = (eTot<sTot) ? (nowMins>=sTot||nowMins<=eTot)
  //                              : (nowMins>=sTot&&nowMins<=eTot);
                         
  //   if (!inRange) continue;

  //   any = true;

  //   // merge ON intensities
  //   for (JsonObject b : r["Selected_Bulbs"]["ON"].as<JsonArray>()) {
  //     String bulb = b["bulb"].as<String>();
  //     int val     = b["intensity"].as<int>();
  //     if      (bulb == "b1" && val > b1) b1 = val;
  //     else if (bulb == "b2" && val > b2) b2 = val;
  //     else if (bulb == "b3" && val > b3) b3 = val;
  //     else if (bulb == "b4" && val > b4) b4 = val;
  //   }
  // }
  for (JsonObject r : rules) {
  Serial.println(F("🔍 Checking a rule..."));

  // 1) Area name matching
  String nm = r["Area"]["name"].as<String>();
  Serial.printf("🔸 Rule Area name: %s\n", nm.c_str());

  if (!std::count(matched.begin(), matched.end(), nm)) {
    Serial.println(F("⛔ Area not in matched list — skipping rule"));
    continue;
  }
  Serial.println(F("✅ Area matched"));

  // 2) Time window check
  String S = r["Start_Time"].as<String>();
  String E = r["End_Time"].as<String>();
  Serial.printf("🕒 Time Window: Start=%s End=%s\n", S.c_str(), E.c_str());

  int sH = S.substring(0, 2).toInt();
  int sM = S.substring(3, 2).toInt();
  int eH = E.substring(0, 2).toInt();
  int eM = E.substring(3, 2).toInt();
  int sTot = sH * 60 + sM;
  int eTot = eH * 60 + eM;

  Serial.printf("➡ Parsed Start: %02d:%02d = %d mins\n", sH, sM, sTot);
  Serial.printf("➡ Parsed End  : %02d:%02d = %d mins\n", eH, eM, eTot);
  Serial.printf("🕓 Current time (in mins): %d\n", nowMins);

  bool inRange = (eTot < sTot) ? (nowMins >= sTot || nowMins <= eTot)
                               : (nowMins >= sTot && nowMins <= eTot);

  if (!inRange) {
    Serial.println(F("⛔ Current time not in rule time window — skipping rule"));
    continue;
  }
  Serial.println(F("✅ Current time is within rule time window"));

  any = true;

  // 3) Merging ON intensities
  Serial.println(F("💡 Merging ON bulb intensities..."));
  for (JsonObject b : r["Selected_Bulbs"]["ON"].as<JsonArray>()) {
    String bulb = b["bulb"].as<String>();
    int val = b["intensity"].as<int>();

    Serial.printf("🔹 Bulb: %s, Intensity: %d\n", bulb.c_str(), val);

    if (bulb == "b1" && val > b1) {
      Serial.printf("➡ Updating b1 from %d → %d\n", b1, val);
      b1 = val;
    }
    else if (bulb == "b2" && val > b2) {
      Serial.printf("➡ Updating b2 from %d → %d\n", b2, val);
      b2 = val;
    }
    else if (bulb == "b3" && val > b3) {
      Serial.printf("➡ Updating b3 from %d → %d\n", b3, val);
      b3 = val;
    }
    else if (bulb == "b4" && val > b4) {
      Serial.printf("➡ Updating b4 from %d → %d\n", b4, val);
      b4 = val;
    }
  }

  Serial.println(F("✅ Rule processed\n"));
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
  StaticJsonDocument<250> doc;
  doc["c"] = "a";
  JsonObject p = doc.createNestedObject("p");
  JsonArray jarr = p.createNestedArray("m");
  JsonObject e1 = jarr.createNestedObject();
  e1["b"] = 1; 
  e1["l"] = b1;
  JsonObject e2 = jarr.createNestedObject();
  e2["b"] = 2; 
  e2["l"] = b2;
  JsonObject e3 = jarr.createNestedObject();
  e3["b"] = 3; 
  e3["l"] = b3;
  JsonObject e4 = jarr.createNestedObject();
  e4["b"] = 4; 
  e4["l"] = b4;
  // serialize to buffer

  char buf[250];
  size_t n = serializeJson(doc, buf, sizeof(buf));
  JSONMsg m;
  m.seq = seqNum++;
  m.len = n;
  memcpy(m.data, buf, n);
  queuePush(m);
  Serial.println(buf);
}

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

// ——— ESP-NOW send callback ———
void onEspNowSent(const uint8_t* mac_addr, esp_now_send_status_t status) {
    //🚨🚨🚨Serial.printf("→ onEspNowSent(status=%d)\n", status);
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
static void onChanNotify( BLERemoteCharacteristic* rc, uint8_t* data, size_t length, bool isNotify) {
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


int16_t previous_target1_x = 0;
int16_t previous_target1_y = 0;
void trySendNextMsg() {
  if (queueEmpty() || awaitingAck) return;
  JSONMsg *front = queueFront();
  if (!front) return;

  lastSeqSent = front->seq;
  awaitingAck = true;
  // 🚨🚨🚨Serial.printf("→ Sending seq=%u (%u bytes)\n",
  //               (unsigned)front->seq,
  //               (unsigned)front->len);

  esp_err_t res = esp_now_send(peerMac, (uint8_t*)front->data, front->len);
  if (res != ESP_OK) {
    Serial.printf("⚠ esp_now_send error: %d\n", (int)res);
    awaitingAck = false;
  }
}

//📌📌📌📌📌📌📌BLUETOOTH RECIEVE📌📌📌📌📌📌📌
// ——— globals ———
#define MAX_AUTOMATION_CHUNKS 64
static String  chunkBuffer[MAX_AUTOMATION_CHUNKS];
static bool    receivedChunks[MAX_AUTOMATION_CHUNKS];
static uint8_t totalChunksExpected   = 0;
static uint8_t chunksReceivedCount   = 0;

// ——— BLE callback ———
static void onDataNotify(
  BLERemoteCharacteristic* /*rc*/,
  uint8_t* data,
  size_t   length,
  bool     /*isNotify*/
) {
  // 1) parse the incoming JSON chunk
  StaticJsonDocument<512> doc;
  auto err = deserializeJson(doc, data, length);
  if (err) {
    Serial.printf("[ERROR] JSON parse failed: %s\n", err.c_str());
    return;
  }

  // 2) check required fields
  if (!doc.containsKey("chunkIndex") ||
      !doc.containsKey("numChunks")   ||
      !doc.containsKey("data")        ||
      !doc.containsKey("seq"))
  {
    Serial.println("[WARN] chunk missing required keys");
    return;
  }
  uint8_t  idx = doc["chunkIndex"].as<uint8_t>();
  uint8_t  tot = doc["numChunks"  ].as<uint8_t>();
  uint32_t seq = doc["seq"        ].as<uint32_t>();
  const char* slice = doc["data"];

  // 3) on first piece, reset buffers
  if (totalChunksExpected == 0) {
    if (tot > MAX_AUTOMATION_CHUNKS) {
      Serial.printf("[ERROR] total_chunks %u exceeds max %u\n",
                    tot, MAX_AUTOMATION_CHUNKS);
      return;
    }
    totalChunksExpected = tot;
    chunksReceivedCount = 0;
    for (uint8_t i = 0; i < tot; i++) {
      chunkBuffer[i].clear();
      receivedChunks[i] = false;
    }
    Serial.printf("[INFO] Expecting %u chunks\n", tot);
  }

  // 4) store this slice if new
  if (idx < totalChunksExpected && !receivedChunks[idx]) {
    chunkBuffer[idx]    = String(slice);
    receivedChunks[idx] = true;
    chunksReceivedCount++;
    Serial.printf("[INFO] Received chunk %u/%u\n",
                  idx+1, totalChunksExpected);
  } else {
    Serial.printf("[INFO] Ignored chunk %u (dup/invalid)\n", idx);
  }

  // 5) send back the BLE “ack” the sender expects
  {
    StaticJsonDocument<128> ackDoc;
    ackDoc["type"]       = "ack";
    ackDoc["seq"]        = seq;
    ackDoc["chunkIndex"] = idx;
    String ack; serializeJson(ackDoc, ack);
  
    if (dataChar) {
      dataChar->writeValue((uint8_t*)ack.c_str(),
                           ack.length(),
                           /*withResponse=*/false);
      Serial.printf("[INFO] BLE ACK sent for seq=%u idx=%u\n", seq, idx);
    } else {
      Serial.println("[WARN] no dataChar to write ACK!");
    }
  }


  // 6) if we have all pieces, reassemble & process
  if (chunksReceivedCount == totalChunksExpected) {
    Serial.println("[INFO] All chunks in—reconstructing JSON…");
    String fullJson;
    fullJson.reserve(totalChunksExpected * 200);
    for (uint8_t i = 0; i < totalChunksExpected; i++) {
      fullJson += chunkBuffer[i];
    }
    Serial.println(fullJson);

    // reset for next message
    totalChunksExpected = 0;
    chunksReceivedCount = 0;

    // hand off to your parser
    autoDoc.clear();
    if (deserializeJson(autoDoc, fullJson)) {
      Serial.println("[ERROR] full JSON parse failed!");
    } else {
      Serial.println("[INFO] Full JSON parsed—calling loadShapesFromJson()");
      loadShapesFromJson(fullJson);
    }
  }
}

//📌📌📌📌📌📌📌BLUETOOTH RECIEVE📌📌📌📌📌📌📌

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

    //3) Print to Serial so we know we actually got some data
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

  //Serial.printf("→ JSON‐len: %d   Contents: %s\n", n, buf);

  // ── Queue it for ESP-NOW ──
  JSONMsg m;
  m.seq = seqNum++;
  m.len = (uint16_t)n;
  memcpy(m.data, buf, n);
  queuePush(m);
  // //🚨🚨Serial.printf("→ queued %u bytes (head=%d, tail=%d)\n",
  //               (unsigned)m.len, queueHead, queueTail);

  // ── Clear RX buffer for next frame ──
  RX_count = 0;
  memset(RX_BUF, 0, sizeof(RX_BUF));
}

const char* wifiStatusName(wl_status_t s) {
  switch (s) {
    case WL_NO_SHIELD:       return "NO_SHIELD";
    case WL_IDLE_STATUS:     return "IDLE";
    case WL_NO_SSID_AVAIL:   return "NO_SSID_AVAIL";
    case WL_SCAN_COMPLETED:  return "SCAN_COMPLETED";
    case WL_CONNECTED:       return "CONNECTED";
    case WL_CONNECT_FAILED:  return "CONNECT_FAILED";
    case WL_CONNECTION_LOST: return "CONNECTION_LOST";
    case WL_DISCONNECTED:    return "DISCONNECTED";
    default:                 return "UNKNOWN";
  }
}

bool connectWiFi(const String& ssid,
                 const String& pass,
                 unsigned long timeout_ms = 20000) {
  Serial.printf("🔗 WiFi.begin(\"%s\", \"%s\")\n", ssid.c_str(), pass.c_str());
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), pass.c_str());

  unsigned long start = millis();
  wl_status_t last = WL_IDLE_STATUS;
  while (millis() - start < timeout_ms) {
    wl_status_t st = WiFi.status();
    if (st != last) {
      Serial.printf("    Status → %s (%d)\n", wifiStatusName(st), st);
      last = st;
    }
    if (st == WL_CONNECTED) {
      Serial.printf("✅ Wi-Fi up! IP = %s\n",
                    WiFi.localIP().toString().c_str());
      return true;
    }
    delay(200);
  }

  // if we get here, we never hit CONNECTED
  wl_status_t finalSt = WiFi.status();
  Serial.printf("❌ Timeout after %lums; final status = %s (%d)\n",
                timeout_ms,
                wifiStatusName(finalSt),
                finalSt);
  return false;
}

void printMacAddress() {
  uint8_t mac[6];
  // WIFI_IF_STA is the correct interface constant for station mode:
  esp_wifi_get_mac(WIFI_IF_STA, mac);
  Serial.printf("MAC Address Sensor: %02X:%02X:%02X:%02X:%02X:%02X\n",
                mac[0], mac[1], mac[2],
                mac[3], mac[4], mac[5]);
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Credential to NVM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
void saveBleCredentials(const String& mac, const String& ssid, const String& pass, uint8_t channel) {
  Preferences p;
  p.begin("blecreds", false);
  p.putString("mac", mac);
  p.putString("ssid", ssid);
  p.putString("pass", pass);
  p.putUChar("chan", channel);
  p.end();
  Serial.println("✅ BLE credentials saved to NVM.");
}

void loadBleCredentials(String& mac, String& ssid, String& pass, uint8_t& channel) {
  Preferences p;
  p.begin("blecreds", true);
  mac     = p.getString("mac", "");
  ssid    = p.getString("ssid", "");
  pass    = p.getString("pass", "");
  channel = p.getUChar("chan", 1);  // Default to channel 1
  p.end();
  Serial.println("📥 BLE credentials loaded from NVM.");
}

void deleteBleCredentialKey(const String& key) {
  Preferences p;
  p.begin("blecreds", false);
  bool removed = p.remove(key.c_str());
  p.end();
  Serial.println(removed ? "🗑️ Key deleted: " + key : "⚠️ Failed to delete key: " + key);
}

void deleteAllBleCredentials() {
  Preferences p;
  p.begin("blecreds", false);
  p.clear();
  p.end();
  Serial.println("💥 All BLE credentials deleted from NVM.");
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> States to NVM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
uint8_t bleFlag, restartFlag;

void saveFlags(uint8_t bleFlag, uint8_t restartFlag) {
  Preferences p;
  p.begin("flags", false);
  p.putUChar("BLE_FLAG", bleFlag);
  p.putUChar("RESTART", restartFlag);
  p.end();
  Serial.printf("✅ Flags saved → BLE_FLAG: %d, RESTART: %d\n", bleFlag, restartFlag);
}

void loadFlags(uint8_t &bleFlag, uint8_t &restartFlag) {
  Preferences p;
  p.begin("flags", true);
  bleFlag = p.getUChar("BLE_FLAG", 0);    // default 0
  restartFlag = p.getUChar("RESTART", 0); // default 0
  p.end();
  Serial.printf("📥 Flags loaded → BLE_FLAG: %d, RESTART: %d\n", bleFlag, restartFlag);
}

void deleteFlagKey(const String& key) {
  Preferences p;
  p.begin("flags", false);
  bool removed = p.remove(key.c_str());
  p.end();
  Serial.println(removed ? "🗑️ Flag deleted: " + key : "⚠️ Failed to delete flag: " + key);
}

void deleteAllFlags() {
  Preferences p;
  p.begin("flags", false);
  p.clear();
  p.end();
  Serial.println("💥 All flags deleted from NVM.");
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


static const int MAX_BLE_ATTEMPTS = 5;
uint8_t wifiChannel = 0;
uint8_t currentChannel = 0;
String ssidA;
String passA;
String macA; 
std::string smac; // smac and macA are same thing, but macA s=is used as a global variable for accessing the mac address to save in the nvm

void getWifiCredentialsFromBLE() {
  Serial.printf("💡 Free heap at BLE entry: %u bytes\n", ESP.getFreeHeap());
  bool bleOk = false;

  for (int attempt = 1; attempt <= MAX_BLE_ATTEMPTS; ++attempt) {
    Serial.printf("🔍 BLE init attempt %d/%d\n", attempt, MAX_BLE_ATTEMPTS);

    BLEDevice::init("");
    BLEScan* scanner = BLEDevice::getScan();
    scanner->setAdvertisedDeviceCallbacks(new ScanCB());
    scanner->setInterval(100);
    scanner->setWindow(99);
    scanner->setActiveScan(true);
    scanner->start(0, nullptr);

    unsigned long start = millis();
    while (!doConnect && millis() - start < 5000) delay(50);
    scanner->stop();

    if (!doConnect) {
      Serial.println("⚠ No controller advertisement seen");
      delay(500);
      continue;
    }

    Serial.println("✅ Controller found, connecting…");
    pClient = BLEDevice::createClient();
    if (pClient->connect(controllerAddr)) {
      Serial.println("🔗 BLE connected");
      bleOk = true;
      break;
    }

    Serial.println("⚠ BLE connect failed");
    delay(500);
  }

  if (!bleOk) {
    Serial.printf("❌ BLE init failed %d times; rebooting…\n", MAX_BLE_ATTEMPTS);
    delay(100);
    ESP.restart();
    return;
  }

  BLERemoteService* svc = nullptr;
  while (!(svc = pClient->getService(SERVICE_UUID))) {
    Serial.println("⚠ Service not found, retrying…");
    delay(500);
  }

  macChar  = svc->getCharacteristic(UUID_MAC_CHAR);
  ssidChar = svc->getCharacteristic(UUID_SSID_CHAR);
  passChar = svc->getCharacteristic(UUID_PASS_CHAR);
  chanChar = svc->getCharacteristic(UUID_CHANNEL_CHAR);

  if (!(macChar && ssidChar && passChar && chanChar)) {
    Serial.println("⚠ Missing characteristic, retrying…");
    pClient->disconnect();
    delay(500);
    return;
  }

  String smacA  = String(macChar->readValue().c_str());
  String ssidA  = String(ssidChar->readValue().c_str());
  String passA  = String(passChar->readValue().c_str());
  String chValA = String(chanChar->readValue().c_str());

  smacA.trim(); ssidA.trim(); passA.trim();
  std::string smac = std::string(smacA.c_str());
  std::string ssid = std::string(ssidA.c_str());
  std::string pass = std::string(passA.c_str());
  std::string chVal = std::string(chValA.c_str());
  uint8_t initCh = (uint8_t)chVal[0];

  sscanf(smac.c_str(), "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx",
         &peerMac[0], &peerMac[1], &peerMac[2],
         &peerMac[3], &peerMac[4], &peerMac[5]);

  currentChannel = chValA.toInt();
  Serial.printf("✅ Got creds: SSID=%s PASS=%s Current_CH=%d\n",
                  ssidA.c_str(), passA.c_str(), currentChannel);

  Serial.printf("Controller WIFI MAC: %s\n", smac.c_str());
  Serial.printf("SSID: %s\n", ssid.c_str());
  Serial.printf("PASSWORD: %s\n", pass.c_str());
  Serial.printf("Initial channel: %d\n", initCh);

  ::ssidA = ssidA;
  ::passA = passA;
  macA    = smacA;
  wifiChannel = initCh;

  if (!connectWiFi(ssidA, passA, 30000)) {
    Serial.println("⚠ Wi-Fi setup failed—cannot proceed");
    delay(100);
    ESP.restart();
    return;
  }


}

//––– Tear down BLE totally –––––––––––––––––––––––––––––––––––––––––––––––––––––
void bleTeardown() {
  BLEDevice::deinit(true);
  esp_bt_controller_disable();
  esp_bt_controller_deinit();
  esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT);
  Serial.println("🔌 BLE fully deinitialized");
}

bool setupEspNow(uint8_t channel) {
  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);
  Serial.println("⏳ Initializing ESP-NOW...");

  while (true) {
    if (esp_now_init() == ESP_OK) {
      esp_now_register_send_cb(onEspNowSent);
      esp_now_peer_info_t peer = {};
      memcpy(peer.peer_addr, peerMac, 6);
      peer.channel = channel;
      peer.encrypt = false;

      esp_err_t peerRes = esp_now_add_peer(&peer);
      if (peerRes == ESP_OK) {
        Serial.println("✅ ESP-NOW ready");
        return true;
      } else {
        Serial.printf("⚠ esp_now_add_peer returned %d, retrying...\n", peerRes);
        esp_now_deinit();
      }
    } else {
      Serial.println("⚠ esp_now_init() failed, retrying...");
    }
    delay(500);
  }
}

void initState1() {
  getWifiCredentialsFromBLE();
  saveBleCredentials(macA, ssidA, passA, wifiChannel);

  // Load from NVM for verification
  String loadedMac, loadedSsid, loadedPass;
  uint8_t loadedChan;

  loadBleCredentials(loadedMac, loadedSsid, loadedPass, loadedChan);

  // Print loaded values to confirm
  Serial.println("📂 Verifying loaded BLE credentials from NVM:");
  Serial.printf("🔸 MAC: %s\n", loadedMac.c_str());
  Serial.printf("🔸 SSID: %s\n", loadedSsid.c_str());
  Serial.printf("🔸 PASS: %s\n", loadedPass.c_str());
  Serial.printf("🔸 CHANNEL: %d\n", loadedChan);

  sscanf(smac.c_str(),
         "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx",
         &peerMac[0], &peerMac[1], &peerMac[2],
         &peerMac[3], &peerMac[4], &peerMac[5]);

  if (!connectWiFi(ssidA, passA, 30000)) {
    Serial.println("⚠ Wi-Fi setup failed—cannot proceed");
    return;  // or retry / handle error
  }

  Serial.printf("💡 Free heap after WiFi connect: %u bytes\n", ESP.getFreeHeap());

  syncTimeOnce();
  Serial.printf("💡 Free heap after time sync: %u bytes\n", ESP.getFreeHeap());

  disconnectWiFi();
  if (!setupEspNow(wifiChannel)) {
    Serial.println("❌ ESP-NOW setup failed. Restarting...");
    delay(100);
    ESP.restart();
  }
}

void initState2() {
  Serial.printf("💡 Free heap at BLE entry (without initiating BLE): %u bytes\n", ESP.getFreeHeap());
  bleTeardown();
  Serial.printf("💡 Free heap after BLE TearDown: %u bytes\n", ESP.getFreeHeap());

  // Load from NVM for verification
  String loadedMac, loadedSsid, loadedPass;
  uint8_t loadedChan;

  loadBleCredentials(loadedMac, loadedSsid, loadedPass, loadedChan);

  // Print loaded values to confirm
  Serial.println("📂 Verifying loaded BLE credentials from NVM:");
  Serial.printf("🔸 MAC: %s\n", loadedMac.c_str());
  Serial.printf("🔸 SSID: %s\n", loadedSsid.c_str());
  Serial.printf("🔸 PASS: %s\n", loadedPass.c_str());
  Serial.printf("🔸 CHANNEL: %d\n", loadedChan);

  if (!connectWiFi(loadedSsid, loadedPass, 30000)) {
    Serial.println("⚠ Wi-Fi setup failed—cannot proceed");
    return;  // or retry / handle error
  }

  Serial.printf("💡 Free heap after WiFi connect: %u bytes\n", ESP.getFreeHeap());

  MqttRecieveJson();
  Serial.printf("💡 Free heap after MQTT initialized: %u bytes\n", ESP.getFreeHeap());

  if (!receivedRule.isEmpty()) {
    bool saved = saveJsonToFile(receivedRule);
    if (saved) {
      Serial.println("📁 Saved rule to LittleFS, now reading back for verification...");
      String jsonCheck = readJsonFromFile();
      Serial.println("📥 JSON content read from file:");
      Serial.println(jsonCheck);
    }
  }

  // Optionally check FS usage
  printLittleFSUsage();

  syncTimeOnce();
  Serial.printf("💡 Free heap after time sync: %u bytes\n", ESP.getFreeHeap());

  disconnectWiFi();
}

void handleStateMachine() {
  loadFlags(bleFlag, restartFlag);

  Serial.printf("🔁 Evaluating state → BLE_FLAG: %d, RESTART_FLAG: %d\n", bleFlag, restartFlag);

  if (bleFlag == 1 && restartFlag == 1) {
    Serial.println("🟥 State 1: Initial BLE Setup");
    initState1();
    saveFlags(0, 1);  // move to State 2
    delay(100);
    ESP.restart();
  }
  else if (bleFlag == 0 && restartFlag == 1) {
    Serial.println("🟧 State 2: MQTT & JSON Setup");
    initState2();
    saveFlags(1, 0);  // move to State 3
    delay(100);
    ESP.restart();
  }
  else if (bleFlag == 1 && restartFlag == 0) {
    Serial.println("🟩 State 3: Normal Operation");
    initState1();
    // No restart — just continue into loop()
  }
  else {
    Serial.println("⚠ Invalid state flags. Resetting...");
    saveFlags(1, 1);  // fallback to initial state
    delay(100);
    ESP.restart();
  }
}

void setup() {
    Serial.begin(115200);
    Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
    printMacAddress();

// >>>>>>>>>>>>>>> use of json Save LittleFs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    initLittleFS();

    // saveJsonToFile(automationJson);

    // printLittleFSUsage();
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>> use of Credentials save NVM >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     // Save credentials
    // saveBleCredentials("AA:BB:CC:DD:EE:FF", "MyWiFi", "MyPass", 6);
  
    // Load credentials
    String mac, ssid, pass;
    uint8_t chan;
    loadBleCredentials(mac, ssid, pass, chan);
    Serial.println("Loaded MAC: " + mac);
    Serial.println("Loaded SSID: " + ssid);
    Serial.println("Loaded PASS: " + pass);
    Serial.printf("Loaded Channel: %d\n", chan);
  
    // Delete just the password
    // deleteBleCredentialKey("pass");
  
    // Delete all
    // deleteAllBleCredentials();
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    String readBack = readJsonFromFile();
    Serial.println(readBack);

    // ─── A) Heap before calling initLinks ──────────────────────────────────
    Serial.printf("💡 Free heap before initLinks(): %u bytes\n", ESP.getFreeHeap());

    
    handleStateMachine();


    // ─── B) Heap right after initLinks returns ─────────────────────────────
    Serial.printf("💡 Free heap after initLinks(): %u bytes\n", ESP.getFreeHeap());

    Serial1.setRxBufferSize(64);  // Set buffer size
    Serial.println("RD-03D Radar Module Initialized");
    Serial.println(WiFi.localIP());
    Serial1.write(Single_Target_Detection_CMD, sizeof(Single_Target_Detection_CMD));
    delay(200);
    Serial.println("Single-target detection mode activated.");

    automationJson = readJsonFromFile();
    Serial.println("📥 Loaded automation JSON into global variable:");
    Serial.println(automationJson);

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

  if (!pClient || !pClient->isConnected() || !esp_now_is_peer_exist(peerMac)) {
    Serial.println(F("⚠ Communication link lost. Re-initializing from BLE..."));
    saveFlags(1, 1);
    delay(100);
    ESP.restart();
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

  trySendNextMsg();
  // —— D) Automation Rules Every 0.5 s ——  
  if (timeSynced && millis() - lastAutomationCheck >= automationInterval) {
    lastAutomationCheck = millis();
    applyAutomationRules();
  }
}