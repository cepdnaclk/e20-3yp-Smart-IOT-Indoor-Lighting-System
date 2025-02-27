package com.example.Lightify.Repository;

import com.example.Lightify.Entity.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TopicRepository extends MongoRepository<Topic, String> {
    Optional<Topic> findByRoomNameAndUsername(String roomName, String username);
}
