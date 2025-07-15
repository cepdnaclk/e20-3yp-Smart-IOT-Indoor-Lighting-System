#include "ConfigManager.h"
#include <Preferences.h>
#include <ArduinoJson.h>

static String ssid, passw, user, sensorMac;
static uint8_t sensorBytes[6];

namespace ConfigManager {

  void initFromJson(const String& json) {
 DynamicJsonDocument doc(1024);
    auto err = deserializeJson(doc, json);
    if (err) {
      Serial.printf("[Config] JSON parse failed: %s\n", err.c_str());
      return;
    }

    // select either payload object or the root object
    JsonObject obj;
    if (doc.containsKey("payload") && doc["payload"].is<JsonObject>()) {
      obj = doc["payload"].as<JsonObject>();
      // Serial.println("[Config] using payload object");
    } else {
      obj = doc.as<JsonObject>();
      // Serial.println("[Config] using root object");
    }

    // only overwrite if key exists
    if (obj.containsKey("ssid")) {
      ssid = obj["ssid"].as<const char*>();
    }
    if (obj.containsKey("password")) {
      passw = obj["password"].as<const char*>();
    }
    if (obj.containsKey("user")) {
      user = obj["user"].as<const char*>();
    }
    if (obj.containsKey("mac")) {
      sensorMac = obj["mac"].as<const char*>();
    }

    // persist to NVM
    Preferences pref;
    pref.begin("cfg", false);
    pref.putString("ssid", ssid);
    pref.putString("pass", passw);
    pref.putString("user", user);
    pref.putString("mac",  sensorMac);
    pref.end();

    // debug
    Serial.printf("[Config] Saved SSID=%s, USER=%s, MAC=%s\n",
                  ssid.c_str(), user.c_str(), sensorMac.c_str());
  }
  // void initFromJson(const String& json) {
  //   DynamicJsonDocument doc(512);
  //   deserializeJson(doc, json);
  //   JsonVariant p = doc["payload"];
  //   ssid      = p["ssid"].as<const char*>();
  //   passw     = p["password"].as<const char*>();
  //   user      = p["user"].as<const char*>();
  //   sensorMac = p["mac"].as<const char*>();

  //   Preferences pref;
  //   pref.begin("cfg", false);
  //   pref.putString("ssid", ssid);
  //   pref.putString("pass", passw);
  //   pref.putString("user", user);
  //   pref.putString("mac",  sensorMac);
  //   pref.end();
  // }

  void begin() {
    Preferences pref;
    pref.begin("cfg", true);
    ssid      = pref.getString("ssid", "");
    passw     = pref.getString("pass", "");
    user      = pref.getString("user", "");
    sensorMac = pref.getString("mac",  "");
    pref.end();

    // parse MAC
    sscanf(sensorMac.c_str(),
           "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx",
           &sensorBytes[0], &sensorBytes[1], &sensorBytes[2],
           &sensorBytes[3], &sensorBytes[4], &sensorBytes[5]);
  }

  String getSSID()      { return ssid; }
  String getPassword()  { return passw; }
  String getUserName()  { return user; }
  String getSensorMac() { return sensorMac; }
  void   getSensorMacBytes(uint8_t out[6]) {
    memcpy(out, sensorBytes, 6);
  }
}
