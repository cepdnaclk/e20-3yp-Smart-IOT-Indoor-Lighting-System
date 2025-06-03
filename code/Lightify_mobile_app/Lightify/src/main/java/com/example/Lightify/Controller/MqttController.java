//package com.example.Lightify.Controller;
//
//import com.example.Lightify.Service.AwsIotPubSubService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//import java.util.Objects;
//import java.util.concurrent.ExecutionException;
//
//@RestController
//@RequestMapping("/mqtt")
//public class MqttController {
//
//    private final AwsIotPubSubService pubSubService;
//
//    @Autowired
//    public MqttController(AwsIotPubSubService pubSubService) {
//        this.pubSubService = pubSubService;
//    }
//
//    @PostMapping("/publish")
//    public ResponseEntity<String> publishMessage(@RequestBody Map<String, Object> body)
//            throws ExecutionException, InterruptedException {
//        // Expected JSON payload: {"topic": "myTopic", "message": "some data"}
//        String topic = (String) body.get("topic");
//        String message = (String) body.get("message");
//        pubSubService.publish(topic, message);
//        return ResponseEntity.ok("Message published");
//    }
//
//    @PostMapping("/subscribe")
//    public ResponseEntity<String> subscribeTopic(@RequestParam String topic) throws Exception {
//        pubSubService.subscribe(topic);
//        return ResponseEntity.ok("Subscribed to topic: " + topic);
//    }
//
////  TODO: String topic should fetched from the database based on the room name received from the frontend API
//    // Endpoint to get the latest message stored in MongoDB for the given topic.
//    @GetMapping("/messages")
//    public ResponseEntity<String> getLastMessage(@RequestParam String topic) {
//        String lastMessage = pubSubService.getLatestMessage(topic);
//        return ResponseEntity.ok(Objects.requireNonNullElseGet(lastMessage, () -> "No message received yet for topic: " + topic));
//    }
//}
//

package com.example.Lightify.Controller;

import com.example.Lightify.Service.AwsIotPubSubService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/mqtt")
public class MqttController {

    private static final Logger logger = LogManager.getLogger(MqttController.class);

    private final AwsIotPubSubService pubSubService;

    @Autowired
    public MqttController(AwsIotPubSubService pubSubService) {
        this.pubSubService = pubSubService;
    }

    @PostMapping("/publish/any")
    public ResponseEntity<?> publishMessage(@RequestBody Map<String, Object> body) {
        try {
            String topic = (String) body.get("topic");
            String message = (String) body.get("message");
            pubSubService.publish(topic, message);
            return ResponseEntity.ok("Message published");
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to publish message: " + e.getMessage());
        }
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publishToRoom(
            @RequestParam String username,
            @RequestParam String roomName,
            @RequestBody String rawJsonPayload
    ) {
        try {
            pubSubService.publishToRoom(username, roomName, rawJsonPayload);
            return ResponseEntity.ok("Published to user='" + username + "', room='" + roomName + "'");
        }
        catch (IllegalArgumentException notFoundEx) {
            // topic not found for that user/room
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(notFoundEx.getMessage());
        }
        catch (InterruptedException | ExecutionException connEx) {
            // MQTT connection disruption → 503 Service Unavailable
            logger.error("MQTT publish failed (connection): {}", connEx.getMessage(), connEx);
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("MQTT service is temporarily unavailable. Please try again.");
        }
        catch (Exception ex) {
            logger.error("Unexpected error in publishToRoom: {}", ex.getMessage(), ex);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Bad request: " + ex.getMessage());
        }
    }


    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribeTopic(@RequestParam String topic) {
        try {
            pubSubService.subscribe(topic);
            return ResponseEntity.ok("Subscribed to topic: " + topic);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to subscribe to topic: " + e.getMessage());
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getLastMessage(@RequestParam String topic) {
        try {
            String lastMessage = pubSubService.getLatestMessage(topic);
            if (lastMessage == null || lastMessage.isEmpty()) {
                return ResponseEntity.ok("No message received yet for topic: " + topic);
            }
            return ResponseEntity.ok(lastMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to get last message: " + e.getMessage());
        }
    }
}
