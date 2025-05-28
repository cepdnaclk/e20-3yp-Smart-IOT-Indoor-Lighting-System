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

    /**
     * Create a new room for a user.
     */
    public Room createRoom(String username, String roomName) {
        logger.info("[createRoom] user='{}', room='{}'", username, roomName);
        roomRepository.findByUsernameAndRoomName(username, roomName)
                .ifPresent(r -> {
                    String err = String.format("Room already exists for user='%s' room='%s'",
                            username, roomName);
                    logger.error("[createRoom] " + err);
                    throw new RuntimeException(err);
                });

        Room r = new Room();
        r.setUsername(username);
        r.setRoomName(roomName);
        r.setSchedule(new ArrayList<>());
        Room saved = roomRepository.save(r);
        logger.info("[createRoom] created id='{}'", saved.getId());
        return saved;
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    /**
     * Fetch a room by (username, roomName).
     */
    public Optional<Room> getRoom(String username, String roomName) {
        logger.debug("[getRoom] user='{}', room='{}'", username, roomName);
        return roomRepository.findByUsernameAndRoomName(username, roomName);
    }

    /**
     * Add a schedule to a user's room.
     */
    public Room addScheduleToRoom(String username, String roomName, Schedule schedule) {
        Room r = roomRepository.findByUsernameAndRoomName(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        String.format("No room found for user='%s' room='%s'", username, roomName)));
        logger.info("[addSchedule] user='{}', room='{}', schedule='{}'",
                username, roomName, schedule);
        r.getSchedule().add(schedule);
        return roomRepository.save(r);
    }

    /**
     * Update an existing schedule entry.
     */
    public Room updateSchedule(String username, String roomName,
                               Schedule updatedSchedule, int index) {
        Room r = roomRepository.findByUsernameAndRoomName(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        String.format("No room found for user='%s' room='%s'", username, roomName)));
        List<Schedule> list = r.getSchedule();
        if (index < 0 || index >= list.size()) {
            throw new RuntimeException("Invalid schedule index: " + index);
        }
        logger.info("[updateSchedule] user='{}', room='{}', index={}", username, roomName, index);
        list.set(index, updatedSchedule);
        return roomRepository.save(r);
    }



    /**
     * Delete one schedule entry.
     */
    public Room deleteSchedule(String username, String roomName, int index) {
        Room r = roomRepository.findByUsernameAndRoomName(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        String.format("No room found for user='%s' room='%s'", username, roomName)));
        List<Schedule> list = r.getSchedule();
        if (index < 0 || index >= list.size()) {
            throw new RuntimeException("Invalid schedule index: " + index);
        }
        logger.info("[deleteSchedule] user='{}', room='{}', index={}", username, roomName, index);
        list.remove(index);
        return roomRepository.save(r);
    }


    /**
     * Rename a room.
     */
    public Room updateRoomName(String username, String oldRoomName, String newRoomName) {
        Room r = roomRepository.findByUsernameAndRoomName(username, oldRoomName)
                .orElseThrow(() -> new RuntimeException(
                        String.format("No room found for user='%s' room='%s'", username, oldRoomName)));
        logger.info("[updateRoomName] user='{}', '{}'→'{}'", username, oldRoomName, newRoomName);
        r.setRoomName(newRoomName);
        return roomRepository.save(r);
    }

    /**
     * Delete a room outright.
     */
    public void deleteRoom(String username, String roomName) {
        Room r = roomRepository.findByUsernameAndRoomName(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        String.format("No room found for user='%s' room='%s'", username, roomName)));
        logger.info("[deleteRoom] Deleting room='{}' for user='{}'", roomName, username);
        roomRepository.delete(r);
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
                logger.info("No schedules for room '{}'", room.getRoomName());
                continue;
            }
            // Use an iterator to safely remove non-recurring, past schedules.
            Iterator<Schedule> iterator = schedules.iterator();
            while (iterator.hasNext()) {
                Schedule schedule = iterator.next();
                LocalDateTime scheduledTime = schedule.getScheduledDateTime();
                if (scheduledTime == null) {
                    logger.warn("Skipping schedule in room '{}' due to null scheduledDateTime", room.getRoomName());
                    continue;
                }
                // Only queue schedules that are scheduled to execute within the next minute.
                if (!scheduledTime.isBefore(now) && scheduledTime.isBefore(nextMinute)) {
                    ScheduleTask task = new ScheduleTask(room.getRoomName(), room.getUsername(), schedule);
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

}

