package com.example.Lightify.Service;

import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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
            try {
                awsIotPubSubService.subscribe(savedTopic.getTopicString());
            } catch (Exception e) {
                logger.error("Error subscribing to topic: {}", savedTopic.getTopicString(), e);
                throw new RuntimeException("Error subscribing to topic", e);
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
        try {
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
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Failed to publish message to AWS IoT", e);
            throw new RuntimeException("Failed to publish message: " + e.getMessage(), e);
        }
    }
}
