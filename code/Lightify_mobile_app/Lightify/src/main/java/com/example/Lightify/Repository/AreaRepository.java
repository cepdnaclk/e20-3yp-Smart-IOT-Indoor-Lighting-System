package com.example.Lightify.Repository;

import com.example.Lightify.Entity.Area;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AreaRepository extends MongoRepository<Area, String> {
    Optional<Area> findByUsernameAndRoomName(String username, String roomName);
    void deleteByUsernameAndRoomName(String username, String roomName);
}
