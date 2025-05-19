// main.ino

#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <Ticker.h>

#include "SerialComm.h"
#include "WiFiConfig.h"
#include "MQTTHandler.h"
#include "LightManager.h"

// ——— AWS IoT & MQTT settings ———
const char* mqttServer   = "d012012821ffpbdagc8s8-ats.iot.eu-north-1.amazonaws.com";
const int   mqttPort     = 8883;
const char* subscribeTop = "topic/2";
const char* publishTop   = "topic/1";

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
void handleSerialJson(const String& json) {
  Serial.println("<< Serial ⟶ " + json);
  // TODO: priorityFunction to choose serial vs. MQTT
}

// ——— MQTT callback: incoming messages ———
void handleMqtt(const String& topic, const String& payload) {
  Serial.println("<< MQTT ⟶ [" + topic + "] " + payload);

  // 1) Forward raw payload over UART to Controller B
  SerialComm::sendJson(payload);

  // 2) Also drive lights locally if payload contains brightness info
  DynamicJsonDocument doc(512);
  auto err = deserializeJson(doc, payload);
  if (!err && doc.containsKey("message")) {
    JsonArray arr = doc["message"].as<JsonArray>();
    for (JsonObject bulb : arr) {
      int id  = bulb["bulb_id"]    | -1;
      int bri = bulb["brightness"] |  0;
      if (id >= 1 && id <= 4) {
        LightManager::setTarget(id - 1, bri);
      }
    }
  }
}

// ——— Non-blocking reconnect state ———
static unsigned long lastWifiAttempt = 0;
const unsigned long WIFI_RETRY_INTERVAL = 10UL * 100; // 1 s

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
  SerialComm::begin(115200);
  SerialComm::onJsonReceived(handleSerialJson);

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
  // —— One-time metadata send ——
  DynamicJsonDocument md(256);
  md["mac"]      = WiFi.macAddress();
  md["user"]     = WiFiConfig::getUserName();
  md["ssid"]     = WiFiConfig::getSSID();
  md["password"] = WiFiConfig::getPassword();
  String meta; serializeJson(md, meta);
  SerialComm::sendJson(meta);
}

void loop() {
  // —— Non-blocking Wi-Fi reconnect attempts ——
  if (WiFi.status() != WL_CONNECTED &&
      millis() - lastWifiAttempt > WIFI_RETRY_INTERVAL) {
    lastWifiAttempt = millis();
    Serial.println("⏳ Attempting Wi-Fi.reconnect()...");
    WiFi.reconnect();
  }

  // —— Core tasks ——
  SerialComm::loop();
  if (WiFi.status() == WL_CONNECTED){
    MQTTHandler::loop();
  }
  // MQTTHandler::loop();
  LightManager::update();

  // future: priorityFunction() here
}
