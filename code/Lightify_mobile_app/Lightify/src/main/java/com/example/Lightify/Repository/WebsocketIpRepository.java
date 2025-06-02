package com.example.Lightify.Repository;

import com.example.Lightify.Entity.WebsocketIp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WebsocketIpRepository extends MongoRepository<WebsocketIp, String> {
    Optional<WebsocketIp> findByUsernameAndRoomName(String username, String roomName);
}
