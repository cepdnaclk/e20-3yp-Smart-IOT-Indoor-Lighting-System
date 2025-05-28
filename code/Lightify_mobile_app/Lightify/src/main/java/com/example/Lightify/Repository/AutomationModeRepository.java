package com.example.Lightify.Repository;

import com.example.Lightify.Entity.AutomationMode;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AutomationModeRepository extends MongoRepository<AutomationMode, String> {
    Optional<AutomationMode> findByUsernameAndRoomName(String username, String roomName);
    void deleteByUsernameAndRoomName(String username, String roomName);
}
