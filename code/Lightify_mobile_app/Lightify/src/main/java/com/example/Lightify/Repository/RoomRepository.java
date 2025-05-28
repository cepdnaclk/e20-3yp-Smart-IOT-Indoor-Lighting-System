package com.example.Lightify.Repository;

import com.example.Lightify.Entity.Room;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    Room findByRoomName(String room);
    Optional<Room> findByUsernameAndRoomName(String username, String roomName);
    void deleteByUsernameAndRoomName(String username, String room);
}
