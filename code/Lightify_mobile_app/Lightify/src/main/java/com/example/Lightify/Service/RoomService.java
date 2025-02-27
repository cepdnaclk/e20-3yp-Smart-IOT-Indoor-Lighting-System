//package com.example.Lightify.Service;
//
//import com.example.Lightify.Entity.Room;
//import com.example.Lightify.Entity.Schedule;
//import com.example.Lightify.Repository.RoomRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class RoomService {
//
//    @Autowired
//    private RoomRepository roomRepository;
//
//    public Room createRoom(Room room) {
//        return roomRepository.save(room);
//    }
//
//    public Optional<Room> getRoomById(String id) {
//        return roomRepository.findById(id);
//    }
//
//    public Room getRoomByNumber(String roomName) {
//        return roomRepository.findByRoom(roomName);
//    }
//
//    public Room addScheduleToRoom(String roomName, Room updatedRoom) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            existingRoom.setSchedule(updatedRoom.getSchedule());
//            return roomRepository.save(existingRoom);
//        }
//        return null;
//    }
//
//    public Room updateSchedule(String roomName, Schedule updatedSchedule, int index) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            List<Schedule> schedules = existingRoom.getSchedule();
//            if (index >= 0 && index < schedules.size()) {
//                schedules.set(index, updatedSchedule);
//                existingRoom.setSchedule(schedules);
//                return roomRepository.save(existingRoom);
//            }
//        }
//        return null;
//    }
//
//    public Room deleteSchedule(String roomName, int index) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            List<Schedule> schedules = existingRoom.getSchedule();
//            if (index >= 0 && index < schedules.size()) {
//                schedules.remove(index);
//                existingRoom.setSchedule(schedules);
//                return roomRepository.save(existingRoom);
//            }
//        }
//        return null;
//    }
//
//    public Room updateRoomName(String roomName, String newRoomName) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            existingRoom.setRoom(newRoomName);
//            return roomRepository.save(existingRoom);
//        }
//        return null;
//    }
//
//    public boolean deleteRoom(String roomName) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            roomRepository.delete(existingRoom);
//            return true;
//        }
//        return false;
//    }
//}
//
package com.example.Lightify.Service;

import com.example.Lightify.Entity.Room;
import com.example.Lightify.Entity.Schedule;
import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.RoomRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import org.json.JSONArray;
import org.json.JSONObject;



@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final TopicService topicService;
    private final AwsIotPubSubService awsIotPubSubService;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper

    private static final Logger logger = LogManager.getLogger(RoomService.class);

    @Autowired
    public RoomService(RoomRepository roomRepository, TopicService topicService, AwsIotPubSubService awsIotPubSubService) {
        this.roomRepository = roomRepository;
        this.topicService = topicService;
        this.awsIotPubSubService = awsIotPubSubService;
    }

    public Room createRoom(Room room) {
//TODO : Should get the username using the token
        String username = "topic";
        room.setUsername(username);
        return roomRepository.save(room);
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    public Room getRoomByNumber(String roomName) {
        return roomRepository.findByRoom(roomName);
    }

    public Room addScheduleToRoom(String roomName, Schedule schedule) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            List<Schedule> schedules = existingRoom.getSchedule();
            schedules.add(schedule);  // Add the new schedule to the list
            existingRoom.setSchedule(schedules);
            return roomRepository.save(existingRoom);
        }
        return null;
    }

    public Room updateSchedule(String roomName, Schedule updatedSchedule, int index) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            List<Schedule> schedules = existingRoom.getSchedule();
            if (index >= 0 && index < schedules.size()) {
                schedules.set(index, updatedSchedule);
                existingRoom.setSchedule(schedules);
                return roomRepository.save(existingRoom);
            }
        }
        return null;
    }

    public Room deleteSchedule(String roomName, int index) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            List<Schedule> schedules = existingRoom.getSchedule();
            if (index >= 0 && index < schedules.size()) {
                schedules.remove(index);
                existingRoom.setSchedule(schedules);
                return roomRepository.save(existingRoom);
            }
        }
        return null;
    }

    public Room updateRoomName(String roomName, String newRoomName) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            existingRoom.setRoom(newRoomName);
            return roomRepository.save(existingRoom);
        }
        return null;
    }

    public boolean deleteRoom(String roomName) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            roomRepository.delete(existingRoom);
            return true;
        }
        return false;
    }

    @Scheduled(cron = "0 * * * * ?")  // Runs every minute, adjust as needed
    public void executeSchedules() {
        logger.info("Starting schedule execution...");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextMinute = now.plusMinutes(1);

        try {
            List<Room> rooms = roomRepository.findAll();
            if (rooms.isEmpty()) {
                logger.warn("No rooms found in the database.");
                return;
            }

            for (Room room : rooms) {
                try {
                    List<Schedule> schedules = room.getSchedule();
                    if (schedules == null || schedules.isEmpty()) {
                        logger.info("No schedules found for room '{}'", room.getRoom());
                        continue;
                    }

                    for (Schedule schedule : schedules) {
                        try {
                            LocalDateTime scheduleTime = schedule.getScheduledDateTime();
                            if (scheduleTime == null) {
                                logger.warn("Skipping schedule in room '{}' due to null scheduledDateTime", room.getRoom());
                                continue;
                            }

                            // Check if the schedule is due within the next minute
                            if (!scheduleTime.isBefore(now) && scheduleTime.isBefore(nextMinute)) {
                                logger.info("Executing schedule for room '{}': {}", room.getRoom(), schedule);
                                executeScheduleAction(room.getRoom(), room.getUsername(), schedule);
                            }
                        } catch (Exception e) {
                            logger.error("Error processing schedule for room '{}': {}", room.getRoom(), e.getMessage(), e);
                        }
                    }

                    // Remove non-recurring schedules that have passed
                    schedules.removeIf(schedule ->
                            !schedule.isRecurrence() && schedule.getScheduledDateTime().isBefore(LocalDateTime.now()));

                    room.setSchedule(schedules);
                    roomRepository.save(room);
                } catch (Exception e) {
                    logger.error("Error processing room '{}': {}", room.getRoom(), e.getMessage(), e);
                }
            }
        } catch (Exception e) {
            logger.error("Error retrieving rooms: {}", e.getMessage(), e);
        }

        logger.info("Schedule execution completed.");
    }

    private void executeScheduleAction(String roomName, String username, Schedule schedule) {
        try {
            if (roomName == null || roomName.trim().isEmpty()) {
                logger.warn("Skipping schedule execution: Room name is null or empty.");
                return;
            }
            if (username == null || username.trim().isEmpty()) {
                logger.warn("Skipping schedule execution: Username is null or empty.");
                return;
            }
            if (schedule == null) {
                logger.warn("Skipping schedule execution: Schedule is null.");
                return;
            }
            if (schedule.getBulbId() == null || schedule.getBulbId().isEmpty()) {
                logger.warn("Skipping schedule execution: No bulbs found in schedule for room '{}'", roomName);
                return;
            }

            // Build the JSON payload
            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("roomName", roomName);

            // Create a JSON array mapping each bulb to a brightness value
            ArrayNode bulbsArray = objectMapper.createArrayNode();
            for (String bulbId : schedule.getBulbId()) {
                try {
                    ObjectNode bulb = objectMapper.createObjectNode();
                    bulb.put("bulb_id", Integer.parseInt(bulbId));
                    bulb.put("brightness", schedule.getIntensityPercentage());
                    bulbsArray.add(bulb);
                } catch (NumberFormatException e) {
                    logger.error("Invalid bulb ID '{}' in room '{}': {}", bulbId, roomName, e.getMessage());
                    continue;
                }
            }
            payload.set("message", bulbsArray);

            Topic topic = topicService.getTopicByRoomNameAndUsername(roomName,username);
            String topicString = topic.getTopicString();
            logger.info("Executing schedule for room {} on topic {}: {}", roomName, topic, payload.toString());

            // Publish the payload using AwsIotPubSubService
            awsIotPubSubService.publish(topicString, payload.toString());

            logger.info("Successfully published schedule action to topic {}: {}", topic, payload.toString());
        } catch (Exception e) {
            logger.error("Failed to publish schedule action for room '{}': {}", roomName, e.getMessage(), e);
        }
    }

//    @Scheduled(cron = "0 * * * * ?")  // Runs every minute, adjust as needed
//    public void executeSchedules() {
//        logger.info("Starting schedule execution...");
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime nextMinute = now.plusMinutes(1);
//        List<Room> rooms = roomRepository.findAll();
//        for (Room room : rooms) {
//            List<Schedule> schedules = room.getSchedule();
//            for (Schedule schedule : schedules) {
//                LocalDateTime scheduleTime = schedule.getScheduledDateTime();
//                // Check if the schedule is due within the next minute
//                if (!scheduleTime.isBefore(now) && scheduleTime.isBefore(nextMinute)) {
//                    logger.info("Executing schedule for room '{}': {}", room.getRoom(), schedule);
//                    // Pass the room's username along with the room name and schedule
//                    executeScheduleAction(room.getRoom(), room.getUsername(), schedule);
//                }
//            }
//            // Optionally remove executed non-recurring schedules
//            schedules.removeIf(schedule ->
//                    !schedule.isRecurrence() && schedule.getScheduledDateTime().isBefore(LocalDateTime.now())
//            );
//            room.setSchedule(schedules);
//            roomRepository.save(room);
//        }
//        logger.info("Schedule execution completed.");
//    }
//
//    // Updated executeScheduleAction method that uses AwsIotPubSubService.publish
//    private void executeScheduleAction(String roomName, String username, Schedule schedule) {
//        try {
//            // Build the JSON payload with roomName and message array containing bulb settings
//            ObjectNode payload = objectMapper.createObjectNode();
//            payload.put("roomName", roomName);
//
//            // Create a JSON array mapping each bulb to a brightness value equal to intensityPercentage
//            ArrayNode bulbsArray = objectMapper.createArrayNode();
//            for (String bulbId : schedule.getBulbId()) {
//                ObjectNode bulb = objectMapper.createObjectNode();
//                bulb.put("bulb_id", Integer.parseInt(bulbId));
//                bulb.put("brightness", schedule.getIntensityPercentage());
//                bulbsArray.add(bulb);
//            }
//            payload.set("message", bulbsArray);
//
//            // Construct topic as "username/roomName"
//            String topic = username + "/" + roomName;
//            logger.info("Executing schedule for room {} on topic {}: {}", roomName, topic, payload.toString());
//
//            // Publish the payload using AwsIotPubSubService.publish
//            awsIotPubSubService.publish(topic, payload.toString());
//
//            logger.info("Published schedule action to topic {}: {}", topic, payload.toString());
//        } catch (Exception e) {
//            logger.error("Failed to publish schedule action for room {}: {}", roomName, e.getMessage(), e);
//        }
//    }
//
//
}
