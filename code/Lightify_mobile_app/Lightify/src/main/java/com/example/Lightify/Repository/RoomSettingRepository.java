package com.example.Lightify.Repository;

import com.example.Lightify.Entity.RoomSetting;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomSettingRepository extends MongoRepository<RoomSetting, String> {
    Optional<RoomSetting> findByUsernameAndRoomName(String username, String roomName);
    void deleteByUsernameAndRoomName(String username, String roomName);
}