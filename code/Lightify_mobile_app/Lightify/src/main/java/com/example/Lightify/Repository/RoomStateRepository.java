package com.example.Lightify.Repository;

import com.example.Lightify.Entity.RoomState;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomStateRepository extends MongoRepository<RoomState, String> {
    /**
     * Find by the unique pair username + roomName.
     * If present, we’ll overwrite it; if not, we’ll insert.
     */
    Optional<RoomState> findByUsernameAndRoomName(String username, String roomName);
}