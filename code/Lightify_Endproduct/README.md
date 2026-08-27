# Controller Firmware

The final firmware for the two controller ESP32s. The sensor unit folder is here too, but
this file only covers the controllers.

| Folder | Board | Job |
|---|---|---|
| `ControllerA_End_Product/` | ESP32 | Wi-Fi, MQTT to AWS IoT Core, drives the 4-channel AC dimmer |
| `ControllerB_End_Product/` | ESP32 | BLE, ESP-NOW, WebSocket server for the app |
| `SensorUnit_M4_EndProduct/` | ESP32 | RD-03D radar, sends positions and lighting triggers |

## Why two boards

An ESP32 has one 2.4 GHz radio. Wi-Fi keeps it on the router's channel, ESP-NOW needs both
peers on a fixed channel, and BLE shares the same front end. On top of that TLS needs about
30-40 KB of heap, which is heap the BLE stack also wants.

Instead of fighting that on one board we split by radio role. Controller A only does Wi-Fi.
Controller B only does ESP-NOW and BLE. They talk to each other over a wire, so there is no
channel to lose.

## Wiring

Controller A:

| Pin | Use |
|---|---|
| GPIO34 | Zero-cross input from the dimmer board (sync) |
| GPIO26, 27, 19, 18 | Dimmer gate outputs, bulbs 1-4 |
| GPIO25 | Reset button, hold 5 s to clear saved Wi-Fi credentials |
| GPIO16, 17 | UART2 RX/TX to Controller B |

Controller B uses GPIO16/17 for the same UART. Cross them over: A's TX to B's RX.

## The link between A and B

UART2 at 115200. Every message is wrapped in a frame so a dropped byte cannot leave the
receiver stuck halfway through a message:

```
[0x7E][len high][len low][payload...][XOR checksum]
```

The parser is a small state machine. If the checksum fails it goes back to looking for the
next `0x7E`, so it re-syncs on its own. `FRAME_MAX_PAYLOAD` in `frame_protocol.h` must be
the same on both boards, otherwise the side with the smaller buffer silently drops the
other side's bigger frames.

There are two ways to send on that wire:

- **`SerialComm`** - framing only, no acknowledgement. Used for ACKs, the WebSocket IP
  message, and sensor triggers coming from B. Resending a stale occupancy event is worse
  than dropping it.
- **`SerialComm2`** - splits anything long into 256-byte chunks, each one acknowledged
  before the queue moves on. Used for the rules payload, where a half-delivered message
  would be worse than none.

Chunk envelope:

```json
{"type":"data","seq":7,"chunkIndex":2,"numChunks":5,"data":"..."}
{"type":"ack","seq":7,"chunkIndex":2}
```

## MQTT

Controller A connects to AWS IoT Core on port 8883 with mutual TLS. The root CA, the device
certificate and the private key are all in `Controller_A_Final_end_ful_complete.ino`.

```
subscribe   <user>/<mac>                  cloud -> device
publish     <user>/<mac>/esp_to_backend   device -> cloud
```

Commands Controller A understands:

| Command | What it does |
|---|---|
| `direct_light_set` | User moved a slider. Applied straight away. |
| `schedule_set` | Schedule takes over. Sets `automationMode = 0`. A `non_permanent` schedule also arms a timer to hand control back after N minutes. |
| `automation` | Gives control back to the sensor, `automationMode = 1`. |
| `room_state` | Backend asking what the bulbs are doing. A replies on the publish topic. |
| `update_automation_mode` | New rules. Forwarded to B, which passes it to the sensor over BLE. |

Messages coming from the sensor use short keys because ESP-NOW frames are capped at 250
bytes: `{"c":"a","p":{"m":[{"b":1,"l":60}]}}` is bulb 1 to 60 percent.

## User vs sensor

Both the user and the radar want to set the same four bulbs, so Controller A keeps two sets
of values and one flag:

- `b1..b4` - what the user or a schedule last asked for
- `bb1..bb4` - what the sensor last decided
- `automationMode` - 1 means the sensor is in charge, 0 means the user has taken over

Anything from the cloud is applied immediately. Anything from the sensor is stored but only
reaches the bulbs when `automationMode` is 1. The sensor values keep updating while they are
being ignored, so when automation comes back the room is already right and there is no wait
for the next radar event.

## Controller B

- **BLE** - `ControllerB` GATT service. Hands the sensor the Wi-Fi SSID, password, B's MAC
  and the **Wi-Fi channel**. The channel matters: ESP-NOW peers must be on the same channel
  and the router picks it at runtime, so it cannot be hardcoded. B joins Wi-Fi, reads
  `WiFi.channel()`, sends it over BLE and locks its own radio to it.
- **ESP-NOW** - frames from the sensor. `c == "a"` is a lighting trigger and goes straight
  to Controller A. Anything else is position data and goes to the WebSocket.
- **WebSocket** - port 81, runs in its own FreeRTOS task pinned to core 1 so it keeps
  serving while the main loop is busy. A client sends `{"username":"..."}` to identify
  itself. Messages arriving with no client connected are queued, up to 30.

Only commands in `serialForwardableCommandsToSensor[]` are passed on to the sensor.
Everything else is logged and dropped.

## Building

Arduino IDE with the ESP32 board package. Open the `.ino` in each folder.

Controller A needs: ArduinoJson, PubSubClient, dimmable_light, ESPAsyncWebServer, Ticker.
Controller B needs: ArduinoJson, WebSockets (Links2004). BLE, ESP-NOW and Preferences come
with the ESP32 core.

Flash Controller A first and set the Wi-Fi credentials through its captive portal. It sends
them to B over the serial link on boot, and B passes them to the sensor over BLE.

## Known rough edges

Worth knowing before changing anything:

- `MQTTHandler::loop()` reconnects inside a blocking `while` loop. If the broker is
  unreachable nothing else in `loop()` runs. Should be a timer with backoff.
- `SerialComm2` resends an unacknowledged chunk on every pass of `loop()` with no delay
  between attempts and no limit. It needs a proper timeout.
- Certificates are compiled in, so every board flashed from this source has the same
  identity.
- ESP-NOW runs unencrypted and the WebSocket username check is not authentication. Both are
  fine on a bench, not fine in a house.
