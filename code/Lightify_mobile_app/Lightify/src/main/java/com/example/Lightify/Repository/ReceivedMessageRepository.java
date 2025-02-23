package com.example.Lightify.Repository;

import com.example.Lightify.Entity.ReceivedMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ReceivedMessageRepository extends MongoRepository<ReceivedMessage, String> {
    Optional<ReceivedMessage> findTopByTopicOrderByTimestampDesc(String topic);
    List<ReceivedMessage> findByTopicOrderByTimestampAsc(String topic);
}
