package com.example.Lightify.Controller;

import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Service.AwsIotPubSubService;
import com.example.Lightify.Service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;
    private final AwsIotPubSubService awsIotPubSubService;

    @Autowired
    public TopicController(TopicService topicService, AwsIotPubSubService awsIotPubSubService) {
        this.topicService = topicService;
        this.awsIotPubSubService = awsIotPubSubService;
    }

    // Create a new topic.
    @PostMapping
    public ResponseEntity<?> createTopic(@RequestBody Topic topic) {
        try {
            Topic createdTopic = topicService.addTopic(topic);
            return ResponseEntity.ok(createdTopic);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to add topic: " + e.getMessage());
        }
    }

    // Update an existing topic.
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable String id, @RequestBody Topic topic) {
        try {
            Topic updatedTopic = topicService.updateTopic(id, topic);
            return ResponseEntity.ok(updatedTopic);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to update topic: " + e.getMessage());
        }
    }

    // Delete a topic.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable String id) {
        try {
            topicService.deleteTopic(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to delete topic: " + e.getMessage());
        }
    }

    // Retrieve all topics.
    @GetMapping
    public ResponseEntity<?> getAllTopics() {
        try {
            List<Topic> topics = topicService.getAllTopics();
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to retrieve topics: " + e.getMessage());
        }
    }

    /**
     * Endpoint to get the latest received message for a topic.
     * Expects a JSON payload with a "roomName" key.
     * In a real scenario, the user's NIC would be looked up using the JWT token.
     * For now, we hardcode the username "PradeepNilupul" which maps to a fixed NIC.
     */
    @PostMapping("/latestMessage")
    public ResponseEntity<?> getLatestMessage(@RequestBody Map<String, String> payload) {
        try {
            String roomName = payload.get("roomName");
//TODO : HERE THERE SHOULD BE WAY TO FETCH THE NIC USING THE USERNAME THAT IS CONTAINED IN THE TOKEN
            // Hardcoded mapping: for username "PradeepNilupul", assume NIC is "topic".
            String username  = "topic";
            Topic topic = topicService.getTopicByRoomNameAndUsername (roomName, username );
            String topicString = topic.getTopicString();
            String latestMessage = awsIotPubSubService.getLatestMessage(topicString);
            return ResponseEntity.ok(latestMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to get latest message: " + e.getMessage());
        }
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publishMessage(@RequestBody Map<String, String> payload) {
        try {
            String roomName = payload.get("roomName");
            String message = payload.get("message");

            if (roomName == null || message == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("roomName and message are required");
            }

            topicService.publishMessage(roomName, message);
            return ResponseEntity.ok("Message published successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to publish message: " + e.getMessage());
        }
    }
}

