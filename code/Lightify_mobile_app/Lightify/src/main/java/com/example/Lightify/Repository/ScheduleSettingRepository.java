package com.example.Lightify.Repository;

import com.example.Lightify.Entity.ScheduleSetting;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Standard Spring Data Mongo repository.  We only need to fetch all
 * schedules for a given (username, roomName) when listing them, if desired.
 */
public interface ScheduleSettingRepository extends MongoRepository<ScheduleSetting, String> {
    List<ScheduleSetting> findByUsernameAndRoomName(String username, String roomName);
}
