#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <esp_sleep.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include <Preferences.h>


// MQTT configuration (unchanged)
const char* mqttServer = "d012012821ffpbdagc8s8-ats.iot.eu-north-1.amazonaws.com";
const int mqttPort = 8883;
const char* mqttTopic = "topic/1";

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

bool checkConfigButton() {
    pinMode(CONFIG_PIN, INPUT_PULLUP);
    unsigned long startTime = millis();
    Serial.println("Checking for config button press...");
    while (millis() - startTime < 5000) {
        if (digitalRead(CONFIG_PIN) == LOW) {
            Serial.println("Config button pressed. Starting configuration portal...");
            return true;  // Return true if button press is detected
        }
        delay(100);
    }
    return false;
}

// Function to start the configuration portal for WiFi credentials
void startConfigPortal() {
  Serial.println("Starting Config Portal...");
  // Set WiFi to AP mode
  WiFi.mode(WIFI_AP);
  WiFi.softAP("ESP32_Config");
  
  // Start mDNS (allows you to access the portal via http://esp32.local)
  if (!MDNS.begin("esp32")) {
    Serial.println("Error setting up MDNS responder!");
  } else {
    Serial.println("mDNS responder started as 'esp32.local'");
  }
  
  AsyncWebServer server(80);

  // Serve the main page with a simple form for entering credentials
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>WiFi Config</title></head><body>";
    html += "<h1>Enter WiFi Credentials</h1>";
    html += "<form action='/save' method='POST'>";
    html += "SSID: <input type='text' name='ssid'><br>";
    html += "Password: <input type='password' name='password'><br>";
    html += "<input type='submit' value='Save'>";
    html += "</form></body></html>";
    request->send(200, "text/html", html);
  });
  
  // Handle form submission and save credentials
  server.on("/save", HTTP_POST, [](AsyncWebServerRequest *request) {
    if (request->hasParam("ssid", true) && request->hasParam("password", true)) {
      String newSSID = request->getParam("ssid", true)->value();
      String newPassword = request->getParam("password", true)->value();
      
      saveCredentials(newSSID, newPassword);
      
      String response = "Credentials saved. Rebooting...";
      request->send(200, "text/html", response);
      delay(1000);
      ESP.restart();
    } else {
      request->send(400, "text/html", "Invalid Request");
    }
  });
  
  server.begin();
  Serial.println("Config Portal Started. Connect to the 'ESP32_Config' AP and navigate to http://esp32.local");
  
  // Stay in configuration mode indefinitely until credentials are entered
  while (true) {
    delay(100);
  }
}

void setupWiFi() {
    Serial.print("Connecting to WiFi...");
    WiFi.begin(storedSSID.c_str(), storedPassword.c_str());
    unsigned long startAttemptTime = millis();
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        if (millis() - startAttemptTime > 60000) {  // Retry timeout
            Serial.println("\nWiFi connection failed! Entering deep sleep for 60 seconds...");
            esp_sleep_enable_timer_wakeup(60000 * 1000);
            esp_deep_sleep_start();
        }
    }
    Serial.println("Connected to WiFi!");
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
    static bool lastButtonState = LOW; 
    static unsigned long lastDebounceTime = 0;
    const unsigned long debounceDelay = 5000;  // 500ms debounce time to avoid false triggers

    int buttonState = digitalRead(BUTTON_PIN);

    // If button state has changed
    if (buttonState != lastButtonState) {
        lastDebounceTime = millis();
    }

    // Check if button is pressed and debounce time has passed
    if ((millis() - lastDebounceTime) > debounceDelay && buttonState == HIGH) {
        if (!resetTriggered) {  // Ensure reset is only triggered once
            Serial.println("Reset button pressed! Clearing credentials...");

            resetCredentials();  // Clear saved WiFi credentials
            resetTriggered = true;
            
            Serial.println("Restarting ESP32...");
            delay(1000);  // Give time for the serial log to update
            ESP.restart();  // Restart ESP32 to apply reset
        }
    }

    lastButtonState = buttonState;
}

void setup() {
    Serial.begin(9600);
    pinMode(BUTTON_PIN, INPUT);
    
    loadCredentials();
    
    if (storedSSID == "" || storedPassword == "") {
        Serial.println("No WiFi credentials found.");
        startConfigPortal();
    }
    
    checkResetButton();  // Check reset button state at startup
    WiFi.mode(WIFI_STA);
    setupWiFi();
    setupMQTT();
}

void loop() {
    client.loop();
    checkWiFi();
    checkResetButton();  // Continuously monitor button state
}
