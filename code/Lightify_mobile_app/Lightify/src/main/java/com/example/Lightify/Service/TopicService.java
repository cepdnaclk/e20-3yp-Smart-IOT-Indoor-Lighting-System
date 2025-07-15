package com.example.Lightify.Service;

import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class TopicService {

    private static final Logger logger = LoggerFactory.getLogger(TopicService.class);

    private final TopicRepository topicRepository;
    private final AwsIotPubSubService awsIotPubSubService;
    private final DeviceService deviceService;

    public TopicService(TopicRepository topicRepository, AwsIotPubSubService awsIotPubSubService, DeviceService deviceService) {
        this.topicRepository = topicRepository;
        this.awsIotPubSubService = awsIotPubSubService;
        this.deviceService = deviceService;
    }

    public Topic addTopic(Topic topic) {
        try {
            // Ensure uniqueness (combination of username and roomName is unique)
            Optional<Topic> existing = topicRepository.findByRoomNameAndUsername(
                    topic.getRoomName(), topic.getUsername());
            if (existing.isPresent()) {
                String errorMsg = "Topic already exists for roomName: " + topic.getRoomName()
                        + " and username: " + topic.getUsername();
                logger.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
            Topic savedTopic = topicRepository.save(topic);

            String baseTopic = savedTopic.getTopicString();
            for (String suffix : new String[]{"/esp_to_backend", "/request_rule_from_backend"}) {
                String fullTopic = baseTopic + suffix;
                try {
                    awsIotPubSubService.subscribe(fullTopic);
                    logger.info("Subscribed to receive-topic: {}", fullTopic);
                } catch (Exception e) {
                    logger.error("Error subscribing to topic: {}", fullTopic, e);
                    // if you want to fail the whole addTopic on subscribe‐error, rethrow here
                    throw new RuntimeException("Error subscribing to topic " + fullTopic, e);
                }
            }

            // Remove device from "devices" collection once it has been added to a topic
            deviceService.deleteDeviceByUsernameAndMacAddress(
                    topic.getUsername(), topic.getMacAddress());
            return savedTopic;
        } catch (Exception e) {
            logger.error("Failed to add topic", e);
            throw new RuntimeException("Failed to add topic: " + e.getMessage(), e);
        }
    }

    public Topic updateTopic(String id, Topic updatedTopic) {
        try {
            Topic topic = topicRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
            topic.setRoomName(updatedTopic.getRoomName());
            topic.setUsername(updatedTopic.getUsername());
            topic.setMacAddress(updatedTopic.getMacAddress());
            return topicRepository.save(topic);
        } catch (Exception e) {
            logger.error("Failed to update topic with id: {}", id, e);
            throw new RuntimeException("Failed to update topic: " + e.getMessage(), e);
        }
    }

    public void deleteTopic(String id) {
        try {
            topicRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Failed to delete topic with id: {}", id, e);
            throw new RuntimeException("Failed to delete topic: " + e.getMessage(), e);
        }
    }

    public List<Topic> getAllTopics() {
        try {
            return topicRepository.findAll();
        } catch (Exception e) {
            logger.error("Failed to retrieve topics", e);
            throw new RuntimeException("Failed to get all topics: " + e.getMessage(), e);
        }
    }

    public Topic getTopicByRoomNameAndUsername(String roomName, String username ) {
        try {
            return topicRepository.findByRoomNameAndUsername (roomName, username )
                    .orElseThrow(() -> new RuntimeException("Topic not found for roomName: " + roomName + " and username : " + username ));
        } catch (Exception e) {
            logger.error("Failed to get topic for roomName: {} and username : {}", roomName, username , e);
            throw new RuntimeException("Failed to get topic: " + e.getMessage(), e);
        }
    }

    public void publishMessage(String roomName, String message) {
        // Hardcoded username for now (should be extracted from authentication token)
        String username = "topic";

        // Retrieve the topic entity using roomName and username
        Optional<Topic> topicOptional = topicRepository.findByRoomNameAndUsername(roomName, username);
        if (topicOptional.isEmpty()) {
            throw new RuntimeException("Topic not found for room: " + roomName);
        }

        Topic topic = topicOptional.get();
        String topicString = topic.getTopicString();

        // Publish message to AWS IoT
        awsIotPubSubService.publish(topicString, message);
        logger.info("Message published successfully to {}", topicString);
    }

    // TopicService.java
    @Transactional
    public void updateTopicRoomName(String username, String oldRoomName, String newRoomName) {
        logger.info("[updateTopicRoomName] user='{}' '{}'→'{}'", username, oldRoomName, newRoomName);
        try {
            Topic t = topicRepository.findByRoomNameAndUsername(oldRoomName, username)
                    .orElseThrow(() -> new RuntimeException(
                            "Topic not found for " + username + "/" + oldRoomName));
            t.setRoomName(newRoomName);
            topicRepository.save(t);
            logger.debug("[updateTopicRoomName] Topic id='{}' updated", t.getId());
        } catch (Exception e) {
            logger.error("[updateTopicRoomName] FAILED user='{}' '{}'→'{}': {}",
                    username, oldRoomName, newRoomName, e.getMessage(), e);
            throw new RuntimeException("Failed to update topic roomName: " + e.getMessage(), e);
        }
    }


    public void deleteByUsernameAndRoomName(String username, String roomName) {
        logger.info("[deleteByUsernameAndRoomName] user='{}', room='{}'", username, roomName);
        try {
            topicRepository.findByRoomNameAndUsername(roomName, username)
                    .ifPresent(t -> {
                        topicRepository.deleteById(t.getId());
                        logger.debug("[deleteByUsernameAndRoomName] Deleted topic id='{}'", t.getId());
                    });
        } catch (Exception e) {
            logger.error("[deleteByUsernameAndRoomName] FAILED user='{}', room='{}': {}",
                    username, roomName, e.getMessage(), e);
            throw new RuntimeException("Failed to delete topic by user+room: " + e.getMessage(), e);
        }
    }

}
