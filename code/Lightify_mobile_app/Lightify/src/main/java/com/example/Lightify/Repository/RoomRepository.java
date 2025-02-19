package com.example.Lightify.Repository;

import com.example.Lightify.Entity.Room;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    Room findByRoom(String room);
}
