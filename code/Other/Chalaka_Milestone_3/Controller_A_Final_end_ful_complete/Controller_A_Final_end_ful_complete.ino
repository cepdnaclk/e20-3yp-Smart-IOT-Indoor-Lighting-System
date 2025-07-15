// main.ino
#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <Ticker.h>
#include "SerialComm.h"
#include "SerialComm2.h"
#include "WiFiConfig.h"
#include "MQTTHandler.h"
#include "LightManager.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

// ——— AWS IoT & MQTT settings ———
const char* mqttServer   = "d012012821ffpbdagc8s8-ats.iot.eu-north-1.amazonaws.com";
const int   mqttPort     = 8883;
const char* subscribeTop = "Tharindu/94:54:C5:B7:E3:2C";
const char* publishTop   = "Tharindu/94:54:C5:B7:E3:2C/esp_to_backend";

StaticJsonDocument<8000> doc;

//chala varibales 
//varibales for schedules 
int b1 = 0;
int b2 = 0;
int b3 = 0;
int b4 = 0;
int flag =-1;
int automationMode=1;
unsigned long automationResumeTime = 0;
bool automationScheduled = false;
//varibales for automation
int bb1 = 0, bb2 = 0, bb3 = 0, bb4 = 0;



// Paste your PEM strings here:
const char* root_ca_pem     = R"EOF(
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

// ——— Pin definitions ———
#define ZC_PIN            34
#define DIM1_PIN          26
#define DIM2_PIN          27
#define DIM3_PIN          19
#define DIM4_PIN          18
#define RESET_BUTTON_PIN  25    // long-press to reset creds

static Ticker resetTicker;

static void printStackLeft(const char* label) {
  UBaseType_t highWater = uxTaskGetStackHighWaterMark(NULL);
  Serial.printf("[STACK] %s: min free stack = %u words\n", label, highWater);
}

// Called after a clean 5 s hold
void IRAM_ATTR doReset() {
  Serial.println("🔴 Long-press detected: resetting credentials…");
  WiFiConfig::reset();
  ESP.restart();
}

// ISR on button-change with software debounce
void IRAM_ATTR onResetButtonChange() {
  static unsigned long lastMicros = 0;
  unsigned long now = micros();
  if (now - lastMicros < 50000) return;  // ignore <50 ms bounces
  lastMicros = now;

  if (digitalRead(RESET_BUTTON_PIN) == LOW) {
    // pressed: schedule a 5 s reset
    resetTicker.once(5.0, doReset);
  } else {
    // released early: cancel reset
    resetTicker.detach();
  }
}

// ——— SerialComm callback: data from Controller B ———
//chala boy tricky tip
// void handleSerialJson(const String& json) {
//    Serial.println("<< Serial ⟶ " + json);
//   // TODO: priorityFunction to choose serial vs. MQTT
//   SerialComm::sendJson(json);

//   DynamicJsonDocument doc(1024);
//   auto err = deserializeJson(doc, json);
//   if (err) {
//     Serial.print(F("deserializeJson() failed: "));
//     Serial.println(err.f_str());
//     return;
//   }

//   String command = doc["command"] | "";
//   JsonObject payloadObj = doc["payload"];

//   if (payloadObj.isNull()) return;

//   JsonArray messageArr = payloadObj["message"];
//   JsonArray automationArr = payloadObj["automation"];

//   bool isScheduleOrDirect = (command == "schedule_set" || command == "direct_light_set");

//   // 👉 Step 1: Assign brightness values
//   for (JsonObject bulb : messageArr) {
//     int id  = bulb["bulb_id"]    | -1;
//     int bri = bulb["brightness"] |  0;

//     // Assign to appropriate variable set
//     switch (id) {
//       case 1:
//         isScheduleOrDirect ? b1 = bri : bb1 = bri;
//         break;
//       case 2:
//         isScheduleOrDirect ? b2 = bri : bb2 = bri;
//         break;
//       case 3:
//         isScheduleOrDirect ? b3 = bri : bb3 = bri;
//         break;
//       case 4:
//         isScheduleOrDirect ? b4 = bri : bb4 = bri;
//         break;
//     }

//     // Apply brightness to local light (for direct/schedule only)
//     // if (isScheduleOrDirect && id >= 1 && id <= 4) {
//     //   LightManager::setTarget(id - 1, bri);
//     // }

//     // Apply brightness to local light (for direct/schedule only)
//   if (id >= 1 && id <= 4) {
//   int valueToApply = 0;

//   if (isScheduleOrDirect) {
//     if (id == 1) valueToApply = b1;
//     else if (id == 2) valueToApply = b2;
//     else if (id == 3) valueToApply = b3;
//     else if (id == 4) valueToApply = b4;
//   } else {
//     if (id == 1) valueToApply = bb1;
//     else if (id == 2) valueToApply = bb2;
//     else if (id == 3) valueToApply = bb3;
//     else if (id == 4) valueToApply = bb4;
//   }

//   LightManager::setTarget(id - 1, valueToApply);
// }

//   }

//   // 👉 Step 2: Handle automation mode logic
//   if (command == "schedule_set") {
//     automationMode = 0;
//     Serial.println("chalaka kolla");

//     if (!automationArr.isNull() && automationArr.size() > 0) {
//       String scheduleType = automationArr[0]["schedule_type"] | "";
//       int periodMinutes = automationArr[0]["schedule_working_period"] | 0;

//       if (scheduleType == "non_permanent" && periodMinutes > 0) {
//         automationScheduled = true;
//         automationResumeTime = millis() + (unsigned long)(periodMinutes * 60000UL);
//         Serial.printf("Automation will resume after %d minutes\n", periodMinutes);
//       }
//     }
//   }

//   // 👉 Step 3: If command is "automation", set mode to ON
//   if (command == "automation_evaluated_set") {
//     automationMode = 1;
//   }
  // if (command == "websocket_ip") {
  // // Directly forward the entire JSON to MQTT
  // MQTTHandler::publish(publishTop, json.c_str());
  // Serial.println("✅ Forwarded websocket_ip command to MQTT: " + json);
// }


// }

// void handleSerialJson(const String& json) {
//   Serial.println("<< Serial ⟶ " + json);

//   DynamicJsonDocument doc(1024);
//   auto err = deserializeJson(doc, json);
//   if (err) {
//     Serial.print(F("deserializeJson() failed: "));
//     Serial.println(err.f_str());
//     return;
//   }

//   // Detect Format B and convert to Format A
//   if (doc.containsKey("command")) {
//     const char* cmd = doc["command"];
//     if (strcmp(cmd, "websocket_ip") == 0) {
//       // Convert to compatible format
//       doc["c"] = "w";
//       doc["p"] = doc["payload"];
//       doc.remove("command");
//       doc.remove("payload");
//     }
//   }

//   String command = doc["c"] | "";
//   JsonObject payloadObj = doc["p"];
//   if (payloadObj.isNull()) return;

//   JsonArray messageArr = payloadObj["m"];
//   if (messageArr.isNull() && command != "w") return;

//   bool isScheduleOrDirect = (command == "s" || command == "d"); // schedule_set, direct_light_set
//   bool isAutomation       = (command == "a");                   // automation_evaluated_set
//   bool isWebSocketIp      = (command == "w");                   // websocket_ip

//   for (JsonObject bulb : messageArr) {
//     int id  = bulb["b"] | -1;  // bulb_id
//     int bri = bulb["l"] |  0;  // brightness

//     switch (id) {
//       case 1: isScheduleOrDirect ? b1 = bri : bb1 = bri; break;
//       case 2: isScheduleOrDirect ? b2 = bri : bb2 = bri; break;
//       case 3: isScheduleOrDirect ? b3 = bri : bb3 = bri; break;
//       case 4: isScheduleOrDirect ? b4 = bri : bb4 = bri; break;
//     }

//     if (id >= 1 && id <= 4) {
//       int valueToApply = isScheduleOrDirect
//                          ? (id == 1 ? b1 : id == 2 ? b2 : id == 3 ? b3 : b4)
//                          : (id == 1 ? bb1 : id == 2 ? bb2 : id == 3 ? bb3 : bb4);
//       if(automationMode==1){LightManager::setTarget(id - 1, valueToApply);}
//       else{
//         Serial.println("sorry Automation Mode is OFF owing to permanent schedule")
//       }
//     }
//   }

//   if (isAutomation) {
//     automationMode = 1;
//   }

//   // Forward websocket_ip command to MQTT
//   Serial.println(command);
//   if (isWebSocketIp) {
//     MQTTHandler::publish(publishTop, json.c_str());
//     Serial.println("✅ Forwarded websocket_ip command to MQTT: " + json);
//   }
// }


//newly updatted
void handleSerialJson(const String& json) {
  Serial.println("<< Serial ⟶ " + json);

  DynamicJsonDocument doc(1024);
  auto err = deserializeJson(doc, json);
  if (err) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(err.f_str());
    return;
  }

  // Detect Format B and convert to Format A
  if (doc.containsKey("command")) {
    const char* cmd = doc["command"];
    if (strcmp(cmd, "websocket_ip") == 0) {
      // Convert to compatible format
      doc["c"] = "w";
      doc["p"] = doc["payload"];
      doc.remove("command");
      doc.remove("payload");
    }
  }

  // ✅ Detect wrapped format (new Format B) and unwrap it
  if (doc.containsKey("payload")) {
    JsonObject payload = doc["payload"];
    if (payload.containsKey("c") && payload.containsKey("p")) {
      doc["c"] = payload["c"];
      doc["p"] = payload["p"];
      doc.remove("payload");
    }
  }

  String command = doc["c"] | "";
  JsonObject payloadObj = doc["p"];
  if (payloadObj.isNull()) return;

  JsonArray messageArr = payloadObj["m"];
  if (messageArr.isNull() && command != "w") return;

  bool isScheduleOrDirect = (command == "s" || command == "d"); // schedule_set, direct_light_set
  bool isAutomation       = (command == "a");                   // automation_evaluated_set
  bool isWebSocketIp      = (command == "w");                   // websocket_ip

  for (JsonObject bulb : messageArr) {
    int id  = bulb["b"] | -1;  // bulb_id
    int bri = bulb["l"] |  0;  // brightness

    switch (id) {
      case 1: isScheduleOrDirect ? b1 = bri : bb1 = bri; break;
      case 2: isScheduleOrDirect ? b2 = bri : bb2 = bri; break;
      case 3: isScheduleOrDirect ? b3 = bri : bb3 = bri; break;
      case 4: isScheduleOrDirect ? b4 = bri : bb4 = bri; break;
    }

    if (id >= 1 && id <= 4) {
      int valueToApply = isScheduleOrDirect
                         ? (id == 1 ? b1 : id == 2 ? b2 : id == 3 ? b3 : b4)
                         : (id == 1 ? bb1 : id == 2 ? bb2 : id == 3 ? bb3 : bb4);
      if (automationMode == 1) {
        LightManager::setTarget(id - 1, valueToApply);
      } else {
        Serial.println("sorry Automation Mode is OFF owing to permanent schedule");
      }
    }
  }

  // if (isAutomation) {
  //   automationMode = 1;
  // }

  // Forward websocket_ip command to MQTT
  Serial.println(command);
  if (isWebSocketIp) {
    MQTTHandler::publish(publishTop, json.c_str());
    Serial.println("✅ Forwarded websocket_ip command to MQTT: " + json);
  }
}




// ——— MQTT callback: incoming messages ———
// void handleMqtt(const String& topic, const String& payload) {
//   Serial.println("<< MQTT ⟶ [" + topic + "] " + payload);

//   // 1) Forward raw payload over UART to Controller B
//   SerialComm::sendJson(payload);

//   // 2) Also drive lights locally if payload contains brightness info
//   DynamicJsonDocument doc(512);
//   auto err = deserializeJson(doc, payload);
//   if (!err && doc.containsKey("message")) {
//     JsonArray arr = doc["message"].as<JsonArray>();
//     for (JsonObject bulb : arr) {
//       int id  = bulb["bulb_id"]    | -1;
//       int bri = bulb["brightness"] |  0;
//       if(id==1){
//         b1=LightManager::mapPct(bri);
//       }
//       if(id==2){
//         b2=LightManager::mapPct(bri);
//       }
//       if(id==3){
//         b3=LightManager::mapPct(bri);
//       }
//       if(id==4){
//         b4=LightManager::mapPct(bri);
//       }
//       int bri = bulb["brightness"] |  0;
//       if (id >= 1 && id <= 4) {
//         LightManager::setTarget(id - 1, bri);
//       }
//     }
//   }
// }


//chalas function mqtthandler 1st attempt
void handleMqtt(const String& topic, const String& payload) {
  Serial.println("<< MQTT ⟶ [" + topic + "] " + payload);
   //SerialComm::sendJson(payload);

  DynamicJsonDocument doc(1024);
  auto err = deserializeJson(doc, payload);
  if (err) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(err.f_str());
    return;
  }

  String command = doc["command"] | "";
  JsonObject payloadObj = doc["payload"];

  if (payloadObj.isNull()) return;

  JsonArray messageArr = payloadObj["message"];
  JsonArray automationArr = payloadObj["automation"];

  bool isScheduleOrDirect = (command == "schedule_set" || command == "direct_light_set");

  // 👉 Step 1: Assign brightness values
  for (JsonObject bulb : messageArr) {
    int id  = bulb["bulb_id"]    | -1;
    int bri = bulb["brightness"] |  0;

    // Assign to appropriate variable set
    switch (id) {
      case 1:
        isScheduleOrDirect ? b1 = bri : bb1 = bri;
        break;
      case 2:
        isScheduleOrDirect ? b2 = bri : bb2 = bri;
        break;
      case 3:
        isScheduleOrDirect ? b3 = bri : bb3 = bri;
        break;
      case 4:
        isScheduleOrDirect ? b4 = bri : bb4 = bri;
        break;
    }

    // Apply brightness to local light (for direct/schedule only)
    // if (isScheduleOrDirect && id >= 1 && id <= 4) {
    //   LightManager::setTarget(id - 1, bri);
    // }

    // Apply brightness to local light (for direct/schedule only)
  if (id >= 1 && id <= 4) {
  int valueToApply = 0;

  if (isScheduleOrDirect) {
    if (id == 1) valueToApply = b1;
    else if (id == 2) valueToApply = b2;
    else if (id == 3) valueToApply = b3;
    else if (id == 4) valueToApply = b4;
  } else {
    if (id == 1) valueToApply = bb1;
    else if (id == 2) valueToApply = bb2;
    else if (id == 3) valueToApply = bb3;
    else if (id == 4) valueToApply = bb4;
  }

  LightManager::setTarget(id - 1, valueToApply);
}

  }

  // 👉 Step 2: Handle automation mode logic
  if (command == "schedule_set") {
    automationMode = 0;

    if (!automationArr.isNull() && automationArr.size() > 0) {
      String scheduleType = automationArr[0]["schedule_type"] | "";
      int periodMinutes = automationArr[0]["schedule_working_period"] | 0;

      if (scheduleType == "non_permanent" && periodMinutes > 0) {
        automationScheduled = true;
        automationResumeTime = millis() + (unsigned long)(periodMinutes * 60000UL);
        Serial.printf("Automation will resume after %d minutes\n", periodMinutes);
      }
    }
  }

  // 👉 Step 3: If command is "automation", set mode to ON
  if (command == "automation") {
    automationMode = 1;
  }
  


//condition for send room state for mqtt 
 if (command == "room_state") {
  StaticJsonDocument<512> doc;

  doc["command"] = "room_state";
  JsonArray message = doc["payload"]["message"].to<JsonArray>();
Serial.println(message);
  if (automationMode == 1) {
    // Automation mode JSON using bb1-bb4
    JsonObject bulb1 = message.createNestedObject();
    bulb1["bulb_id"] = 1;
    bulb1["brightness"] = bb1;

    JsonObject bulb2 = message.createNestedObject();
    bulb2["bulb_id"] = 2;
    bulb2["brightness"] = bb2;

    JsonObject bulb3 = message.createNestedObject();
    bulb3["bulb_id"] = 3;
    bulb3["brightness"] = bb3;

    JsonObject bulb4 = message.createNestedObject();
    bulb4["bulb_id"] = 4;
    bulb4["brightness"] = bb4;
  } else {
    // Manual mode JSON using b1-b4
    JsonObject bulb1 = message.createNestedObject();
    bulb1["bulb_id"] = 1;
    bulb1["brightness"] = b1;

    JsonObject bulb2 = message.createNestedObject();
    bulb2["bulb_id"] = 2;
    bulb2["brightness"] = b2;

    JsonObject bulb3 = message.createNestedObject();
    bulb3["bulb_id"] = 3;
    bulb3["brightness"] = b3;

    JsonObject bulb4 = message.createNestedObject();
    bulb4["bulb_id"] = 4;
    bulb4["brightness"] = b4;
  }

  // Serialize and publish
  String output;
  serializeJson(doc, output);
  MQTTHandler::publish(publishTop, output.c_str());
  Serial.println("✅ Sent schedule_set command: " + output);
}



 if (command == "update_automation_mode") {
    // 👉 Send the entire payload as-is to the other ESP32
    // SerialComm::sendJson(payload);
   printStackLeft("before JSON");

  Serial.println(F("---- MQTT Handler Start ----"));
  Serial.print  (F("[DBG] Topic: "));
  Serial.println(topic);
  Serial.print  (F("[DBG] Payload: "));
  Serial.println(payload);

  // 1) Forward raw payload over UART to Controller B
  Serial.println(F("[DBG] Forwarding raw JSON over UART..."));
  SerialComm2::sendJson(payload);
  Serial.println(F("[DBG] Forward complete."));

  // 2) Parse JSON safely
  doc.clear();
  Serial.println(F("[DBG] Deserializing JSON..."));
  DeserializationError err = deserializeJson(doc, payload);
  printStackLeft("after JSON");

  if (err) {
    Serial.print(F("[ERR] JSON parse failed: "));
    Serial.println(err.c_str());
    Serial.println(F("---- MQTT Handler End (Error) ----"));
    return;
  }
  Serial.println(F("[DBG] JSON parsed successfully."));

  JsonObject root = doc.as<JsonObject>();

  // --- Handle "command" ---
  if (root.containsKey("command")) {
    const char* cmd = root["command"];
    Serial.print(F("[CMD] "));
    Serial.println(cmd);
  } else {
    Serial.println(F("[WARN] No 'command' key found"));
  }

  // --- Handle "payload" ---
  if (!root.containsKey("payload")) {
    Serial.println(F("[WARN] No 'payload' object"));
    Serial.println(F("---- MQTT Handler End ----"));
    return;
  }
  JsonObject pl = root["payload"].as<JsonObject>();

  // --- Iterate Areas ---
  if (pl.containsKey("Areas")) {
    Serial.println(F("[DBG] Iterating 'Areas' array..."));
    for (JsonObject area : pl["Areas"].as<JsonArray>()) {
      const char* name = area["name"] | "";
      const char* type = area["type"] | "";
      Serial.print(F(" Area '")); Serial.print(name);
      Serial.print(F("' (type='")); Serial.print(type);
      Serial.println(F("')"));
      // TODO: apply area logic (e.g., store or configure zones)
    }
  }

  // --- Iterate Rules ---
  if (pl.containsKey("Rules")) {
    Serial.println(F("[DBG] Iterating 'Rules' array..."));
    for (JsonObject rule : pl["Rules"].as<JsonArray>()) {
      const char* rName = rule["Rule_Name"] | "";
      Serial.print(F(" Rule '")); Serial.print(rName);
      Serial.println(F("'"));
      // TODO: apply rule logic (e.g., schedule lighting changes)
    }
  }

  printStackLeft("before return");
  Serial.println(F("---- MQTT Handler End ----"));
}


}
// void handleMqtt(const String& topic, const String& payloadRaw) {
//   Serial.println("<< MQTT ⟶ [" + topic + "] " + payloadRaw);

//   // 👉 Step 0: Clean and locate JSON string
//   String payload = payloadRaw;
//   payload.trim();

//   int jsonStart = payload.indexOf('{');
//   if (jsonStart > 0) {
//     payload = payload.substring(jsonStart);
//     payload.trim();
//   }

//   DynamicJsonDocument doc(2048);  // Use bigger size for safety
//   DeserializationError err = deserializeJson(doc, payload);
//   if (err) {
//     Serial.print(F("deserializeJson() failed: "));
//     Serial.println(err.f_str());
//     return;
//   }

//   String command = doc["command"] | "";
//   JsonObject payloadObj = doc["payload"];

//   if (payloadObj.isNull()) return;

//   JsonArray messageArr = payloadObj["message"];
//   JsonArray automationArr = payloadObj["automation"];

//   bool isScheduleOrDirect = (command == "schedule_set" || command == "direct_light_set");

//   // 👉 Step 1: Assign brightness values
//   for (JsonObject bulb : messageArr) {
//     int id  = bulb["bulb_id"]    | -1;
//     int bri = bulb["brightness"] |  0;

//     switch (id) {
//       case 1: isScheduleOrDirect ? b1 = bri : bb1 = bri; break;
//       case 2: isScheduleOrDirect ? b2 = bri : bb2 = bri; break;
//       case 3: isScheduleOrDirect ? b3 = bri : bb3 = bri; break;
//       case 4: isScheduleOrDirect ? b4 = bri : bb4 = bri; break;
//     }

//     if (id >= 1 && id <= 4) {
//       int valueToApply = isScheduleOrDirect
//                          ? (id == 1 ? b1 : id == 2 ? b2 : id == 3 ? b3 : b4)
//                          : (id == 1 ? bb1 : id == 2 ? bb2 : id == 3 ? bb3 : bb4);
//       LightManager::setTarget(id - 1, valueToApply);
//     }
//   }

//   // 👉 Step 2: Handle automation mode logic
//   if (command == "schedule_set") {
//     automationMode = 0;

//     if (!automationArr.isNull() && automationArr.size() > 0) {
//       String scheduleType = automationArr[0]["schedule_type"] | "";
//       int periodMinutes = automationArr[0]["schedule_working_period"] | 0;

//       if (scheduleType == "non_permanent" && periodMinutes > 0) {
//         automationScheduled = true;
//         automationResumeTime = millis() + (unsigned long)(periodMinutes * 60000UL);
//         Serial.printf("Automation will resume after %d minutes\n", periodMinutes);
//       }
//     }
//   }

//   // 👉 Step 3: If command is "automation", set mode to ON
//   if (command == "automation") {
//     automationMode = 1;
//   }

//   // 👉 Step 4: Handle update_automation_mode
//   if (command == "update_automation_mode") {
//     printStackLeft("before JSON");

//     Serial.println(F("---- MQTT Handler Start ----"));
//     Serial.print  (F("[DBG] Topic: ")); Serial.println(topic);
//     Serial.print  (F("[DBG] Payload: ")); Serial.println(payloadRaw);

//     // 1) Forward raw payload over UART to Controller B
//     Serial.println(F("[DBG] Forwarding raw JSON over UART..."));
//     SerialComm2::sendJson(payloadRaw);
//     Serial.println(F("[DBG] Forward complete."));

//     // 2) Parse JSON again safely
//     doc.clear();
//     Serial.println(F("[DBG] Deserializing JSON..."));
//     DeserializationError err2 = deserializeJson(doc, payload);
//     printStackLeft("after JSON");

//     if (err2) {
//       Serial.print(F("[ERR] JSON parse failed: "));
//       Serial.println(err2.c_str());
//       Serial.println(F("---- MQTT Handler End (Error) ----"));
//       return;
//     }
//     Serial.println(F("[DBG] JSON parsed successfully."));

//     JsonObject root = doc.as<JsonObject>();

//     // --- Handle "command" ---
//     if (root.containsKey("command")) {
//       const char* cmd = root["command"];
//       Serial.print(F("[CMD] ")); Serial.println(cmd);
//     } else {
//       Serial.println(F("[WARN] No 'command' key found"));
//     }

//     // --- Handle "payload" ---
//     if (!root.containsKey("payload")) {
//       Serial.println(F("[WARN] No 'payload' object"));
//       Serial.println(F("---- MQTT Handler End ----"));
//       return;
//     }

//     JsonObject pl = root["payload"].as<JsonObject>();

//     // --- Iterate Areas ---
//     if (pl.containsKey("Areas")) {
//       Serial.println(F("[DBG] Iterating 'Areas' array..."));
//       for (JsonObject area : pl["Areas"].as<JsonArray>()) {
//         const char* name = area["name"] | "";
//         const char* type = area["type"] | "";
//         Serial.print(F(" Area '")); Serial.print(name);
//         Serial.print(F("' (type='")); Serial.print(type);
//         Serial.println(F("')"));
//       }
//     }

//     // --- Iterate Rules ---
//     if (pl.containsKey("Rules")) {
//       Serial.println(F("[DBG] Iterating 'Rules' array..."));
//       for (JsonObject rule : pl["Rules"].as<JsonArray>()) {
//         const char* rName = rule["Rule_Name"] | "";
//         Serial.print(F(" Rule '")); Serial.print(rName);
//         Serial.println(F("'"));
//       }
//     }

//     printStackLeft("before return");
//     Serial.println(F("---- MQTT Handler End ----"));
//   }
// }




//pradeep commenting below 
//function for get the json and decode for varibales by chala
// void handleMqttMessage(String topic, String payload) {
//   Serial.printf("[Main][Debug] Received MQTT message on topic %s\n", topic.c_str());
//   Serial.printf("[Main][Debug] Payload: %s\n", payload.c_str());

//   StaticJsonDocument<256> doc;
//   DeserializationError error = deserializeJson(doc, payload);
//   if (error) {
//     Serial.printf("[Main][Error] Failed to parse JSON: %s\n", error.c_str());
//     return;
//   }

//   const char* method = doc["method"];
//   if (strcmp(method, "schedule") == 0) {
//     int b1 = doc["bulb_1"];
//     int b2 = doc["bulb_2"];
//     int b3 = doc["bulb_3"];
//     int b4 = doc["bulb_4"];
//     const char* startTime = doc["start_time"];
//     const char* endTime = doc["end_time"];
//     int priority = doc["priority"];

//     Serial.printf("[Main][Debug] Schedule received: b1=%d, b2=%d, b3=%d, b4=%d\n", b1, b2, b3, b4);
//     Serial.printf("[Main][Debug] Schedule timing: %s -> %s, priority=%d\n", startTime, endTime, priority);

//     // Store or immediately apply schedule (this example immediately applies):
//     LightManager::setTarget(0, b1);
//     LightManager::setTarget(1, b2);
//     LightManager::setTarget(2, b3);
//     LightManager::setTarget(3, b4);
//   }
// }

// ——— Non-blocking reconnect state ———
static unsigned long lastWifiAttempt = 0;
const unsigned long WIFI_RETRY_INTERVAL = 10UL * 300; // 3 s

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  // —— Reset-button interrupt & debounce ——
  pinMode(RESET_BUTTON_PIN, INPUT_PULLUP);
  attachInterrupt(
    digitalPinToInterrupt(RESET_BUTTON_PIN),
    onResetButtonChange,
    CHANGE
  );

  // —— SerialComm: framed JSON over UART ——
  // SerialComm::begin(115200);
  // SerialComm::onJsonReceived(handleSerialJson);


  //chala trick commserial2 eke wede
  SerialComm2::begin(115200);
  SerialComm2::onJsonReceived(handleSerialJson);

  // —— LightManager: dimmable lights ——
  LightManager::begin(ZC_PIN, DIM1_PIN, DIM2_PIN, DIM3_PIN, DIM4_PIN);

  // —— Wi-Fi config & portal ——
  WiFiConfig::begin();  // loads creds or launches portal

  // —— Connect to Wi-Fi ——
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(
    WiFiConfig::getSSID().c_str(),
    WiFiConfig::getPassword().c_str()
  );
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println("\n✅ Wi-Fi connected, IP=" + WiFi.localIP().toString());

  // // —— MQTT over TLS ——
  // MQTTHandler::begin(
  //   mqttServer, mqttPort,
  //   root_ca_pem, certificate_pem_crt, private_pem_key,
  //   "ESP32_Client", subscribeTop
  // );
  // MQTTHandler::onMessage(handleMqtt);

  if (WiFi.status() == WL_CONNECTED) {
    // —— MQTT over TLS ——
    MQTTHandler::begin(
      mqttServer, mqttPort,
      root_ca_pem, certificate_pem_crt, private_pem_key,
      "ESP32_Client", subscribeTop
    );
    MQTTHandler::onMessage(handleMqtt);
  } else {
    Serial.println("⚠️ Wi-Fi never connected—skipping MQTT init");
  }


//chalas ip send as json 
  //  MQTTHandler::sendWebSocketIP(publishTop,WiFi.localIP().toString());
  // —— One-time metadata send ——
  DynamicJsonDocument md(256);
  md["mac"]      = WiFi.macAddress();
  md["user"]     = WiFiConfig::getUserName();
  md["ssid"]     = WiFiConfig::getSSID();
  md["password"] = WiFiConfig::getPassword();
  String meta; serializeJson(md, meta);
  SerialComm2::sendJson(meta);
}

void loop() {
  // —— Non-blocking Wi-Fi reconnect attempts ——
  if (WiFi.status() != WL_CONNECTED &&
      millis() - lastWifiAttempt > WIFI_RETRY_INTERVAL) {
    lastWifiAttempt = millis();
    Serial.println("⏳ Attempting Wi-Fi.reconnect()...");
    WiFi.reconnect();
  }



  if (automationScheduled && millis() > automationResumeTime) {
    automationMode = 1;
    automationScheduled = false;
    Serial.println("Automation mode re-enabled.");
  }



  // —— Core tasks ——
  //SerialComm::loop();

//chala commserial2
  SerialComm2::loop();

  if (WiFi.status() == WL_CONNECTED){
    MQTTHandler::loop();
  }
  // MQTTHandler::loop();
  LightManager::update();

  // future: priorityFunction() here
}
