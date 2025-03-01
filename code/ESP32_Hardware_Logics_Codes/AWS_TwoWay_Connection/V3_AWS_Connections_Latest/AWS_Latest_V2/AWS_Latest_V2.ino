#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <esp_sleep.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include <Preferences.h>
#include "driver/rtc_io.h"

// MQTT configuration (unchanged)
const char* mqttServer = "d012012821ffpbdagc8s8-ats.iot.eu-north-1.amazonaws.com";
const int mqttPort = 8883;
const char* mqttTopic = "topic/2";
const char* mqttPubTopic = "topic/1";

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

#define CONFIG_PIN 0  // Configuration mode trigger pin
#define BUTTON_PIN 25  // Reset button pin


// WiFi and MQTT clients
WiFiClientSecure espClient;
PubSubClient client(espClient);
const int checkInterval = 60000; // 60 seconds interval

Preferences preferences;
String storedSSID = "";
String storedPassword = "";
bool resetTriggered = false;  // Ensures resetCredentials() is called only once


static unsigned long lastPublishTime = 0;
const unsigned long PUBLISH_INTERVAL = 10000; // 10 seconds in milliseconds


// Forward declarations
void startConfigPortal();
void saveCredentials(String ssid, String password);

void resetCredentials() {
    preferences.begin("wifi", false);
    preferences.clear();  // Removes stored SSID and password
    preferences.end();
    Serial.println("WiFi credentials cleared from NVM.");
}

void loadCredentials() {
    preferences.begin("wifi", false);
    storedSSID = preferences.getString("ssid", "");
    storedPassword = preferences.getString("password", "");
    preferences.end();
    Serial.print("Loaded SSID: ");
    Serial.println(storedSSID);
}

void saveCredentials(String ssid, String password) {
    preferences.begin("wifi", false);
    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.end();
    Serial.println("WiFi credentials saved.");
}


void startConfigPortal() {
    Serial.println("Starting Config Portal...");
    WiFi.mode(WIFI_AP);
    WiFi.softAP("ESP32_Config");

    if (!MDNS.begin("esp32")) {
        Serial.println("Error setting up MDNS responder!");
    } else {
        Serial.println("mDNS responder started as 'esp32.local'");
    }

    AsyncWebServer server(80);

    // Scan for WiFi networks
    Serial.println("Scanning for available WiFi networks...");
    int numNetworks = WiFi.scanNetworks();

    String networkOptions = "<option value=''>-- Select WiFi --</option>";
    for (int i = 0; i < numNetworks; i++) {
        networkOptions += "<option value='" + WiFi.SSID(i) + "'>" + WiFi.SSID(i) + " (" + String(WiFi.RSSI(i)) + " dBm)</option>";
    }
    networkOptions += "<option value='custom'>Other (Enter Manually)</option>";

    // Serve the main page with styling and dropdown
    server.on("/", HTTP_GET, [networkOptions](AsyncWebServerRequest *request) {
        String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
        html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
        html += "<title>WiFi Config</title>";
        html += "<style>";
        html += "body { font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; }";
        html += ".container { max-width: 400px; background: white; padding: 20px; margin: 50px auto; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }";
        html += "h1 { color: #333; }";
        html += "select, input { width: 90%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }";
        html += "input[type='submit'] { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }";
        html += "input[type='submit']:hover { background: #218838; }";
        html += "</style></head><body>";
        html += "<div class='container'>";
        html += "<h1>WiFi Configuration</h1>";
        html += "<form action='/save' method='POST'>";
        html += "<label>Select WiFi SSID:</label>";
        html += "<select id='ssidSelect' name='ssid' onchange='toggleManualInput()'>" + networkOptions + "</select><br>";
        html += "<input type='text' id='manualSSID' name='manualSSID' placeholder='Enter SSID manually' style='display:none;'><br>";
        html += "Password: <input type='password' name='password' required><br>";
        html += "<input type='submit' value='Save'>";
        html += "</form>";
        html += "<script>function toggleManualInput() {";
        html += "var ssidSelect = document.getElementById('ssidSelect');";
        html += "var manualSSID = document.getElementById('manualSSID');";
        html += "manualSSID.style.display = (ssidSelect.value === 'custom') ? 'block' : 'none';";
        html += "}</script>";
        html += "</div></body></html>";
        request->send(200, "text/html", html);
    });

    // Handle form submission
    server.on("/save", HTTP_POST, [](AsyncWebServerRequest *request) {
        String selectedSSID = "";
        String password = "";
        if (request->hasParam("ssid", true)) {
            selectedSSID = request->getParam("ssid", true)->value();
        }
        if (request->hasParam("password", true)) {
            password = request->getParam("password", true)->value();
        }
        if (selectedSSID == "custom" && request->hasParam("manualSSID", true)) {
            selectedSSID = request->getParam("manualSSID", true)->value();
        }

        if (selectedSSID != "") {
            saveCredentials(selectedSSID, password);
            String response = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>";
            response += "<style>body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }</style>";
            response += "<title>Saved</title></head><body>";
            response += "<h2>Credentials saved. Rebooting...</h2>";
            response += "</body></html>";
            request->send(200, "text/html", response);
            delay(1000);
            ESP.restart();
        } else {
            request->send(400, "text/html", "Invalid Request");
        }
    });

    server.begin();
    Serial.println("Config Portal Started. Connect to 'ESP32_Config' and navigate to http://esp32.local");

    while (true) {
        delay(100);
    }
}


void setupWiFi() {
    Serial.print("Connecting to WiFi...");
    WiFi.begin(storedSSID.c_str(), storedPassword.c_str());
    
    unsigned long startAttemptTime = millis();

    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 30000) { // 30 seconds timeout
        delay(500);
        Serial.print(".");
        checkResetButton();  // Monitor reset button
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n✅ Connected to WiFi!");
    } else {
        Serial.println("\n❌ WiFi connection failed!");
    }
}


// MQTT callback (unchanged)
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.println("\n🔔 MQTT Message Received!");
  Serial.print("📌 Topic: ");
  Serial.println(topic);
  Serial.print("📩 Payload: ");
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  Serial.println("----------------------------------");
}

// Setup MQTT connection (unchanged)
void setupMQTT() {
  espClient.setCACert(root_ca_pem);
  espClient.setCertificate(certificate_pem_crt);
  espClient.setPrivateKey(private_pem_key);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(mqttCallback);
  
  while (!client.connected()) {
    Serial.print("AWS IOT CONNECTION PENDING...");
    if (client.connect("ESP32_Client")) {
      Serial.println("Connected!");
      client.subscribe(mqttTopic);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying...");
      delay(5000);
    }
  }
}

// Function to monitor WiFi connection (unchanged)
void checkWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost! Entering deep sleep for 60 seconds...");
    WiFi.disconnect();
    esp_sleep_enable_timer_wakeup(checkInterval * 1000);
    esp_deep_sleep_start();
  }
}

void checkResetButton() {
    static bool buttonHeld = false;
    static unsigned long buttonPressTime = 0;
    const unsigned long resetHoldTime = 5000;  // 5 seconds hold time for reset

    int buttonState = digitalRead(BUTTON_PIN);

    if (buttonState == LOW) {  // Button is being pressed
        if (buttonPressTime == 0) {
            buttonPressTime = millis();  // Start timing
        }

        if (millis() - buttonPressTime >= resetHoldTime && !buttonHeld) {  // Button held for 5 seconds
            Serial.println("🔴 Button held for 5 seconds! Resetting credentials...");
            resetCredentials();  // Clear WiFi credentials
            Serial.println("🔄 Restarting ESP32...");
            delay(1000);
            ESP.restart();  // Restart ESP32 to apply reset
        }
    } else {
        buttonPressTime = 0;  // Reset timer if button is released early
    }
}

// Function to generate the next sequence number
unsigned long getNextSequenceNumber() {
    static unsigned long seqNum = 0;
    return ++seqNum;
}

// Function to generate the JSON payload for the room state.
// The JSON includes a room name, a list of bulb IDs, and the current sequence number.
String generateRoomStateJson() {
    unsigned long seq = getNextSequenceNumber();
    String json = "{";
    json += "\"room\":\"Living room\",";
    json += "\"bulbs\":[1,2,4],";
    json += "\"seqNumber\":" + String(seq);
    json += "}";
    return json;
}

// Function that generates the data and publishes it to the MQTT topic.
// This function calls generateRoomStateJson() and then publishes the resulting JSON.
void generateDataAndPublish() {
    String payload = generateRoomStateJson();
    client.publish(mqttPubTopic, payload.c_str());
    Serial.println("Published periodic room state: " + payload);
}

bool isButtonHeld() {
    unsigned long startTime = millis();
    
    while (millis() - startTime < 2000) {  // Wait 2 seconds
        if (digitalRead(BUTTON_PIN) == HIGH) {
            Serial.println("❌ Button released early. Going back to deep sleep...");
            return false;  // Button was released, go back to sleep
        }
        delay(100);
    }
    
    Serial.println("✅ Button held for 2 seconds! Continuing...");
    return true;  // Stay awake
}

void setup() {
    Serial.begin(9600);

    // Use external pull-up resistor so use INPUT (no need for internal pull-up)
    pinMode(BUTTON_PIN, INPUT);

    esp_sleep_wakeup_cause_t wakeup_reason = esp_sleep_get_wakeup_cause();
    
    if (wakeup_reason == ESP_SLEEP_WAKEUP_EXT0) {
        Serial.println("⚡ ESP32 woke up due to button press!");
        rtc_gpio_hold_dis(GPIO_NUM_25);  // Release GPIO hold state
    } else if (wakeup_reason == ESP_SLEEP_WAKEUP_TIMER) {
        Serial.println("⏰ ESP32 woke up after timer expiration.");
    } else {
        Serial.println("🟢 ESP32 started normally.");
    }

    loadCredentials();

    if (storedSSID == "" || storedPassword == "") {
        Serial.println("⚠️ No WiFi credentials found. Starting Config Portal...");
        startConfigPortal();
    }

    checkResetButton();  // Check reset button at startup
    WiFi.mode(WIFI_STA);
    setupWiFi();  // Attempt WiFi connection

    if (WiFi.status() == WL_CONNECTED) {
        setupMQTT();  // Only call MQTT setup if WiFi is connected
    } else {
        Serial.println("Entering deep sleep for 60 seconds...");

        // Force GPIO25 HIGH before sleep
        pinMode(BUTTON_PIN, OUTPUT);      // Temporarily set as output
        digitalWrite(BUTTON_PIN, HIGH);     // Drive it HIGH
        delay(10);                          // Allow state to settle
        
        // Return the pin to input mode (external pull-up is used)
        pinMode(BUTTON_PIN, INPUT);
        
        // Configure wake-up on GPIO25 when it goes LOW (i.e. button pressed)
        esp_sleep_enable_ext0_wakeup(GPIO_NUM_25, LOW);
        
        // Enable timer wake-up after 60 seconds
        esp_sleep_enable_timer_wakeup(60000 * 1000);
        
        Serial.println("💤 Going to deep sleep... Press and hold the button to wake up.");
        delay(1000);  // Allow Serial log update before sleep
        esp_deep_sleep_start();  // Enter deep sleep mode
    }
}

// void setup() {
//     Serial.begin(9600);

//     // Set up GPIO 25 as an input with a pull-up to avoid false wake-ups
//     pinMode(BUTTON_PIN, INPUT_PULLUP);

//     esp_sleep_wakeup_cause_t wakeup_reason = esp_sleep_get_wakeup_cause();
    
//     if (wakeup_reason == ESP_SLEEP_WAKEUP_EXT0) {
//         Serial.println("⚡ ESP32 woke up due to button press!");
//         rtc_gpio_hold_dis(GPIO_NUM_25);  // Release GPIO hold state
//     } else if (wakeup_reason == ESP_SLEEP_WAKEUP_TIMER) {
//         Serial.println("⏰ ESP32 woke up after timer expiration.");
//     } else {
//         Serial.println("🟢 ESP32 started normally.");
//     }

//     loadCredentials();

//     if (storedSSID == "" || storedPassword == "") {
//         Serial.println("⚠️ No WiFi credentials found. Starting Config Portal...");
//         startConfigPortal();
//     }

//     checkResetButton();  // Check reset button at startup
//     WiFi.mode(WIFI_STA);
//     setupWiFi();  // Attempt WiFi connection

//     if (WiFi.status() == WL_CONNECTED) {
//         setupMQTT();  // ✅ Only call MQTT setup if WiFi is connected
//     } else {
//         // Serial.println("Entering deep sleep for 60 seconds...");

//         // // ✅ Ensure GPIO 25 is set up with an internal pull-up
//         // pinMode(BUTTON_PIN, INPUT_PULLUP);

//         // // ✅ Configure wake-up on GPIO 25 when it goes LOW
//         // esp_sleep_enable_ext0_wakeup(GPIO_NUM_25, LOW);

//         // // ✅ Enable timer wake-up after 60 seconds
//         // esp_sleep_enable_timer_wakeup(60000 * 1000);

//         // Serial.println("💤 Going to deep sleep... Press and hold the button to wake up.");
//         // delay(1000);  // Allow Serial log update before sleep
//         // esp_deep_sleep_start();  // Enter deep sleep mode
//         Serial.println("Entering deep sleep for 60 seconds...");

//         // Force GPIO25 HIGH before sleep
//         pinMode(BUTTON_PIN, OUTPUT);   // Set pin as output
//         digitalWrite(BUTTON_PIN, HIGH);  // Drive it HIGH
//         delay(10);                       // Short delay to ensure the state is set

//         // Now switch back to INPUT_PULLUP so that the internal pull-up is active for wakeup
//         pinMode(BUTTON_PIN, INPUT_PULLUP);

//         // Configure wake-up on GPIO25 when it goes LOW
//         esp_sleep_enable_ext0_wakeup(GPIO_NUM_25, LOW);

//         // Enable timer wake-up after 60 seconds
//         esp_sleep_enable_timer_wakeup(60000 * 1000);

//         Serial.println("💤 Going to deep sleep... Press and hold the button to wake up.");
//         delay(1000);  // Allow Serial log update before sleep
//         esp_deep_sleep_start();  // Enter deep sleep mode

//     }
// }

void loop() {
    client.loop();
    checkWiFi();
    checkResetButton();  // Continuously monitor button state

    // unsigned long now = millis();
    // if (now - lastPublishTime >= PUBLISH_INTERVAL) {
    //     lastPublishTime = now;
    //     generateDataAndPublish(); // Generate data and publish when it's available.
    // }

}
