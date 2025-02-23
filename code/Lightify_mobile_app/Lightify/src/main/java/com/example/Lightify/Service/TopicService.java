package com.example.Lightify.Service;

import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopicService {

    private static final Logger logger = LoggerFactory.getLogger(TopicService.class);

    private final TopicRepository topicRepository;
    private final AwsIotPubSubService awsIotPubSubService;

    public TopicService(TopicRepository topicRepository, AwsIotPubSubService awsIotPubSubService) {
        this.topicRepository = topicRepository;
        this.awsIotPubSubService = awsIotPubSubService;
    }

    public Topic addTopic(Topic topic) {
        try {
            // Ensure uniqueness (combination of nic and roomName is unique)
            Optional<Topic> existing = topicRepository.findByRoomNameAndNic(topic.getRoomName(), topic.getNic());
            if (existing.isPresent()) {
                String errorMsg = "Topic already exists for roomName: " + topic.getRoomName() + " and nic: " + topic.getNic();
                logger.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
            Topic savedTopic = topicRepository.save(topic);
            // Subscribe to the topic automatically using its topic string.
            try {
                awsIotPubSubService.subscribe(savedTopic.getTopicString());
            } catch (Exception e) {
                String subError = "Error subscribing to topic: " + savedTopic.getTopicString();
                logger.error(subError, e);
                throw new RuntimeException(subError, e);
            }
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
            topic.setNic(updatedTopic.getNic());
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

    public Topic getTopicByRoomNameAndNic(String roomName, String nic) {
        try {
            return topicRepository.findByRoomNameAndNic(roomName, nic)
                    .orElseThrow(() -> new RuntimeException("Topic not found for roomName: " + roomName + " and nic: " + nic));
        } catch (Exception e) {
            logger.error("Failed to get topic for roomName: {} and nic: {}", roomName, nic, e);
            throw new RuntimeException("Failed to get topic: " + e.getMessage(), e);
        }
    }
}
