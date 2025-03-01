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

import com.example.Lightify.DTO.ScheduleTask;
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
import java.util.*;
import java.util.concurrent.*;


@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final TopicService topicService;
    private final AwsIotPubSubService awsIotPubSubService;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper

    private static final Logger logger = LogManager.getLogger(RoomService.class);

    // Priority queue to store tasks ordered by scheduled execution time.
    private final PriorityQueue<ScheduleTask> scheduleQueue = new PriorityQueue<>();

    // Executor that checks and executes due schedule tasks every second.
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();

    // Executor pool for executing schedule actions.
    private final ExecutorService scheduleExecutionPool = Executors.newCachedThreadPool();

    @Autowired
    public RoomService(RoomRepository roomRepository, TopicService topicService, AwsIotPubSubService awsIotPubSubService) {
        this.roomRepository = roomRepository;
        this.topicService = topicService;
        this.awsIotPubSubService = awsIotPubSubService;
        startExecutionThread();
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

    @Scheduled(cron = "0 * * * * ?")
    public void fetchAndQueueSchedules() {
        logger.info("Fetching schedules from database...");
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            logger.warn("No rooms found in the database.");
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextMinute = now.plusMinutes(1);

        for (Room room : rooms) {
            List<Schedule> schedules = room.getSchedule();
            if (schedules == null || schedules.isEmpty()) {
                logger.info("No schedules for room '{}'", room.getRoom());
                continue;
            }
            // Use an iterator to safely remove non-recurring, past schedules.
            Iterator<Schedule> iterator = schedules.iterator();
            while (iterator.hasNext()) {
                Schedule schedule = iterator.next();
                LocalDateTime scheduledTime = schedule.getScheduledDateTime();
                if (scheduledTime == null) {
                    logger.warn("Skipping schedule in room '{}' due to null scheduledDateTime", room.getRoom());
                    continue;
                }
                // Only queue schedules that are scheduled to execute within the next minute.
                if (!scheduledTime.isBefore(now) && scheduledTime.isBefore(nextMinute)) {
                    ScheduleTask task = new ScheduleTask(room.getRoom(), room.getUsername(), schedule);
                    if (!scheduleQueue.contains(task)) {
                        scheduleQueue.add(task);
                        logger.info("Added schedule to queue: {}", task);
                    }
                } else if (!schedule.isRecurrence() && scheduledTime.isBefore(now)) {
                    // Remove non-recurring schedules that have passed.
                    iterator.remove();
                }
            }
            room.setSchedule(schedules);
            roomRepository.save(room);
        }
    }


    /**
     * Starts a thread that continuously checks the priority queue and executes schedules when due.
     */
    private void startExecutionThread() {
        executorService.scheduleAtFixedRate(() -> {
            LocalDateTime now = LocalDateTime.now();
            while (!scheduleQueue.isEmpty() && !scheduleQueue.peek().getScheduledTime().isAfter(now)) {
                ScheduleTask task = scheduleQueue.poll();
                logger.info("Executing schedule task: {}", task);
                scheduleExecutionPool.submit(() ->
                        {
                            assert task != null;
                            executeScheduleAction(task.getRoomName(), task.getUsername(), task.getSchedule());
                        }
                );
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    /**
     * Executes the schedule action by building a JSON payload and publishing it.
     */
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
//                    bulb.put("time", schedule.getTime().toNanoOfDay());
                    bulbsArray.add(bulb);
                } catch (NumberFormatException e) {
                    logger.error("Invalid bulb ID '{}' in room '{}': {}", bulbId, roomName, e.getMessage());
                    continue;
                }
            }
            payload.set("message", bulbsArray);

            Topic topic = topicService.getTopicByRoomNameAndUsername(roomName, username);
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
//
//        try {
//            List<Room> rooms = roomRepository.findAll();
//            if (rooms.isEmpty()) {
//                logger.warn("No rooms found in the database.");
//                return;
//            }
//
//            for (Room room : rooms) {
//                try {
//                    List<Schedule> schedules = room.getSchedule();
//                    if (schedules == null || schedules.isEmpty()) {
//                        logger.info("No schedules found for room '{}'", room.getRoom());
//                        continue;
//                    }
//
//                    for (Schedule schedule : schedules) {
//                        try {
//                            LocalDateTime scheduleTime = schedule.getScheduledDateTime();
//                            if (scheduleTime == null) {
//                                logger.warn("Skipping schedule in room '{}' due to null scheduledDateTime", room.getRoom());
//                                continue;
//                            }
//
//                            // Check if the schedule is due within the next minute
//                            if (!scheduleTime.isBefore(now) && scheduleTime.isBefore(nextMinute)) {
//                                logger.info("Executing schedule for room '{}': {}", room.getRoom(), schedule);
//                                executeScheduleAction(room.getRoom(), room.getUsername(), schedule);
//                            }
//                        } catch (Exception e) {
//                            logger.error("Error processing schedule for room '{}': {}", room.getRoom(), e.getMessage(), e);
//                        }
//                    }
//
//                    // Remove non-recurring schedules that have passed
//                    schedules.removeIf(schedule ->
//                            !schedule.isRecurrence() && schedule.getScheduledDateTime().isBefore(LocalDateTime.now()));
//
//                    room.setSchedule(schedules);
//                    roomRepository.save(room);
//                } catch (Exception e) {
//                    logger.error("Error processing room '{}': {}", room.getRoom(), e.getMessage(), e);
//                }
//            }
//        } catch (Exception e) {
//            logger.error("Error retrieving rooms: {}", e.getMessage(), e);
//        }
//
//        logger.info("Schedule execution completed.");
//    }
//
//    private void executeScheduleAction(String roomName, String username, Schedule schedule) {
//        try {
//            if (roomName == null || roomName.trim().isEmpty()) {
//                logger.warn("Skipping schedule execution: Room name is null or empty.");
//                return;
//            }
//            if (username == null || username.trim().isEmpty()) {
//                logger.warn("Skipping schedule execution: Username is null or empty.");
//                return;
//            }
//            if (schedule == null) {
//                logger.warn("Skipping schedule execution: Schedule is null.");
//                return;
//            }
//            if (schedule.getBulbId() == null || schedule.getBulbId().isEmpty()) {
//                logger.warn("Skipping schedule execution: No bulbs found in schedule for room '{}'", roomName);
//                return;
//            }
//
//            // Build the JSON payload
//            ObjectNode payload = objectMapper.createObjectNode();
//            payload.put("roomName", roomName);
//
//            // Create a JSON array mapping each bulb to a brightness value
//            ArrayNode bulbsArray = objectMapper.createArrayNode();
//            for (String bulbId : schedule.getBulbId()) {
//                try {
//                    ObjectNode bulb = objectMapper.createObjectNode();
//                    bulb.put("bulb_id", Integer.parseInt(bulbId));
//                    bulb.put("brightness", schedule.getIntensityPercentage());
//                    bulbsArray.add(bulb);
//                } catch (NumberFormatException e) {
//                    logger.error("Invalid bulb ID '{}' in room '{}': {}", bulbId, roomName, e.getMessage());
//                    continue;
//                }
//            }
//            payload.set("message", bulbsArray);
//
//            Topic topic = topicService.getTopicByRoomNameAndUsername(roomName,username);
//            String topicString = topic.getTopicString();
//            logger.info("Executing schedule for room {} on topic {}: {}", roomName, topic, payload.toString());
//
//            // Publish the payload using AwsIotPubSubService
//            awsIotPubSubService.publish(topicString, payload.toString());
//
//            logger.info("Successfully published schedule action to topic {}: {}", topic, payload.toString());
//        } catch (Exception e) {
//            logger.error("Failed to publish schedule action for room '{}': {}", roomName, e.getMessage(), e);
//        }
//    }

}
