package com.example.Lightify.Service;

import com.example.Lightify.DTO.ScheduleSetRequest;
import com.example.Lightify.DTO.ScheduleTask;
import com.example.Lightify.Entity.ScheduleSetting;
import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.ScheduleSettingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.annotation.PostConstruct;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.PriorityQueue;
import java.util.concurrent.*;

/**
 * 1) Saves incoming schedule_set JSON → a ScheduleSetting in Mongo.
 * 2) Immediately queues any schedule whose execution date+time (local Colombo) is < top-of-next-hour UTC.
 * 3) Every hour on the hour, scans DB for schedules whose local datetime (Colombo) falls in [nowUTC, nowUTC+1h) and enqueues them.
 * 4) Removes any expired schedules (local datetime < nowUTC).
 * 5) A background thread polls every second and, when a ScheduleTask’s time arrives, publishes the same JSON back to the device’s topic.
 */
@Service
public class ScheduleService {
    private static final Logger logger = LogManager.getLogger(ScheduleService.class);
    private static final ZoneId LOCAL_ZONE = ZoneId.of("Asia/Colombo");

    private final ScheduleSettingRepository scheduleRepo;
    private final TopicService topicService;
    private final AwsIotPubSubService awsIotPubSubService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** In-memory PQ of tasks, sorted by execution timestamp */
    private final PriorityQueue<ScheduleTask> scheduleQueue = new PriorityQueue<>();

    /** Wakes up every second to execute due tasks. */
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();

    /** Pool used to publish JSONs to MQTT so it doesn’t block the scheduler thread. */
    private final ExecutorService publishPool = Executors.newCachedThreadPool();

    @Autowired
    public ScheduleService(
            ScheduleSettingRepository scheduleRepo,
            TopicService topicService,
            AwsIotPubSubService awsIotPubSubService
    ) {
        this.scheduleRepo = scheduleRepo;
        this.topicService = topicService;
        this.awsIotPubSubService = awsIotPubSubService;
        startExecutionThread();
    }

    @PostConstruct
    public void init() {
        // On startup, immediately fetch+queue any schedules whose local times (Colombo) fall in [nowUTC, nowUTC+1h).
        scanAndQueueUpcomingSchedules();
    }

    /**
     * Called by the Controller whenever a new schedule_set JSON arrives over HTTP.
     * Persists, then—if its (date, time) in Asia/Colombo ∈ [nowUTC, nowUTC+1h) → queue immediately.
     */
    public void saveScheduleSetting(String username, ScheduleSetRequest request) {
        ScheduleSetRequest.Payload p = request.getPayload();

        // (1) Must have at least one automation entry
        if (p.getAutomation() == null || p.getAutomation().isEmpty()) {
            throw new RuntimeException("No 'automation' block provided in payload");
        }
        ScheduleSetRequest.AutomationInfo auto = p.getAutomation().get(0);

        // (2) Build the ScheduleSetting entity
        ScheduleSetting setting = new ScheduleSetting();
        setting.setUsername(username);
        setting.setRoomName(p.getRoom_name());
        setting.setDate(p.getDate());
        setting.setTime(p.getTime());
        setting.setMessage(
                p.getMessage().stream().map(dtoBulb -> {
                    ScheduleSetting.BulbInfo b = new ScheduleSetting.BulbInfo();
                    b.setBulb_id(dtoBulb.getBulb_id());
                    b.setBrightness(dtoBulb.getBrightness());
                    return b;
                }).toList()
        );
        setting.setScheduleType(auto.getSchedule_type());
        setting.setScheduleWorkingPeriod(auto.getSchedule_working_period());

        // (3) Interpret the stored (date, time) as Asia/Colombo, then convert to UTC Instant
        ZonedDateTime executionLocal = ZonedDateTime.of(p.getDate(), p.getTime(), LOCAL_ZONE);
        Instant     executionInstant = executionLocal.toInstant();
        Instant     nowInstant       = Instant.now();
        Instant     topOfNextHourUtc = nowInstant.plus(1, ChronoUnit.HOURS);

        // 1) If executionInstant < nowInstant → expired, skip saving entirely
        if (executionInstant.isBefore(nowInstant)) {
            logger.warn(
                    "[saveScheduleSetting] Received a schedule for a time already passed: {} (Colombo) → {} (UTC)\nSkipping: {}",
                    executionLocal, executionInstant, setting
            );
            return;
        }

        // 2) Save to Mongo
        scheduleRepo.save(setting);
        logger.info(
                "[saveScheduleSetting] Stored schedule {} for {}/{} → executionLocal={} (Colombo) → executionInstant={} (UTC), type={}, period={}",
                setting.getId(),
                username,
                setting.getRoomName(),
                executionLocal,
                executionInstant,
                setting.getScheduleType(),
                setting.getScheduleWorkingPeriod()
        );

        // 3) If executionInstant ∈ [nowInstant, topOfNextHourUtc], queue immediately
        if (!executionInstant.isAfter(topOfNextHourUtc)) {
            logger.info(
                    "[saveScheduleSetting] Will queue immediately: executionInstant={} (UTC) vs nowUTC={} and nextHourUTC={}",
                    executionInstant,
                    nowInstant,
                    topOfNextHourUtc
            );
            ScheduleTask task = new ScheduleTask(setting.getRoomName(), username, setting);
            synchronized (scheduleQueue) {
                if (!scheduleQueue.contains(task)) {
                    scheduleQueue.add(task);
                    logger.info("[saveScheduleSetting] Queued immediately: {}", task);
                } else {
                    logger.debug("[saveScheduleSetting] Task already in queue, skipping: {}", task);
                }
            }
        }
    }

    /**
     * Runs once every hour on the hour. Delegates to queueUpcomingSchedulesInUtc().
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void scanAndQueueUpcomingSchedules() {
        queueUpcomingSchedulesInUtc();
    }

    /**
     * 1) Remove expired schedules (executionLocal < nowUTC).
     * 2) Find any schedules whose executionLocal ∈ [nowUTC, nowUTC+1h) and queue them.
     */
    private void queueUpcomingSchedulesInUtc() {
        Instant nowInstant      = Instant.now();
        Instant nextHourInstant = nowInstant.plus(1, ChronoUnit.HOURS);
        logger.info("[scanAndQueueUTC] nowUTC={}, nextHourUTC={}", nowInstant, nextHourInstant);

        List<ScheduleSetting> all = scheduleRepo.findAll();
        for (ScheduleSetting s : all) {
            // Build a ZonedDateTime at LOCAL_ZONE (Colombo) from the stored date+time
            ZonedDateTime executionLocal = ZonedDateTime.of(
                    s.getDate(),
                    s.getTime(),
                    LOCAL_ZONE
            );
            Instant executionInstant = executionLocal.toInstant();

            // Debug: show what we’re comparing
            logger.debug(
                    "[scanAndQueueUTC] Examining schedule id={} for {}/{} → executionLocal={} (Colombo) → executionInstant={} (UTC); nowUTC={}, nextHourUTC={}",
                    s.getId(),
                    s.getUsername(),
                    s.getRoomName(),
                    executionLocal,
                    executionInstant,
                    nowInstant,
                    nextHourInstant
            );

            // 1) If executionInstant < nowInstant → expired, remove from DB
            if (executionInstant.isBefore(nowInstant)) {
                scheduleRepo.deleteById(s.getId());
                logger.info(
                        "[scanAndQueueUTC] Removed expired schedule id={} for {}/{} at {} (Colombo) → {} (UTC)",
                        s.getId(),
                        s.getUsername(),
                        s.getRoomName(),
                        executionLocal,
                        executionInstant
                );
                continue;
            }

            // 2) If executionInstant ∈ [nowInstant, nextHourInstant) → queue it
            if (!executionInstant.isAfter(nextHourInstant)) {
                ScheduleTask task = new ScheduleTask(
                        s.getRoomName(), s.getUsername(), s
                );
                synchronized (scheduleQueue) {
                    if (!scheduleQueue.contains(task)) {
                        scheduleQueue.add(task);
                        logger.info(
                                "[scanAndQueueUTC] Queued schedule id={} for {}/{} to run at {} (Colombo) → {} (UTC)",
                                s.getId(),
                                s.getUsername(),
                                s.getRoomName(),
                                executionLocal,
                                executionInstant
                        );
                    } else {
                        logger.debug(
                                "[scanAndQueueUTC] schedule id={} for {}/{} already in queue, skipping enqueue",
                                s.getId(), s.getUsername(), s.getRoomName()
                        );
                    }
                }
            } else {
                logger.debug(
                        "[scanAndQueueUTC] schedule id={} for {}/{} not in [nowUTC, nextHourUTC): executionInstant={} > nextHourInstant={}",
                        s.getId(),
                        s.getUsername(),
                        s.getRoomName(),
                        executionInstant,
                        nextHourInstant
                );
            }
        }
    }

    /**
     * Background thread checks the in-memory priority queue every second.
     * Whenever a task’s UTC instant ≤ nowUTC, we pop it and execute it.
     */
    private void startExecutionThread() {
        executorService.scheduleAtFixedRate(() -> {
            Instant nowInstant = Instant.now();

            while (true) {
                ScheduleTask nextTask;
                synchronized (scheduleQueue) {
                    nextTask = scheduleQueue.peek();
                    if (nextTask == null) break;

                    // Build this task’s UTC Instant from its local (Colombo) date+time
                    ZonedDateTime taskLocal = ZonedDateTime.of(
                            nextTask.getSchedule().getDate(),
                            nextTask.getSchedule().getTime(),
                            LOCAL_ZONE
                    );
                    Instant taskInstant = taskLocal.toInstant();

                    // If the task’s time is still in the future (UTC), stop looping
                    if (taskInstant.isAfter(nowInstant)) {
                        break;
                    }
                    // Otherwise it’s due (or overdue) → remove it from queue
                    nextTask = scheduleQueue.poll();
                }

                if (nextTask != null) {
                    ScheduleTask finalNextTask = nextTask;
                    publishPool.submit(() -> executeSchedule(finalNextTask));
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    /**
     * Builds the JSON and publishes to the correct MQTT topic (username/macAddress).
     */
    private void executeSchedule(ScheduleTask task) {
        ScheduleSetting s = task.getSchedule();
        try {
            ObjectNode root = objectMapper.createObjectNode();
            root.put("command", "schedule_set");

            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("room_name", s.getRoomName());

            ArrayNode messageArr = objectMapper.createArrayNode();
            for (ScheduleSetting.BulbInfo b : s.getMessage()) {
                ObjectNode bulbNode = objectMapper.createObjectNode();
                bulbNode.put("bulb_id", b.getBulb_id());
                bulbNode.put("brightness", b.getBrightness());
                messageArr.add(bulbNode);
            }
            payload.set("message", messageArr);

            ArrayNode autoArr = objectMapper.createArrayNode();
            ObjectNode autoNode = objectMapper.createObjectNode();
            autoNode.put("schedule_type", s.getScheduleType());
            if ("non_permanent".equals(s.getScheduleType())) {
                autoNode.put("schedule_working_period", s.getScheduleWorkingPeriod());
            } else {
                autoNode.putNull("schedule_working_period");
            }
            autoArr.add(autoNode);
            payload.set("automation", autoArr);
            root.set("payload", payload);

            Topic topic = topicService.getTopicByRoomNameAndUsername(
                    s.getRoomName(), s.getUsername()
            );
            String topicString = topic.getUsername() + "/" + topic.getMacAddress();

            String jsonString = objectMapper.writeValueAsString(root);
            awsIotPubSubService.publish(topicString, jsonString);
            logger.info("[executeSchedule] Published to {}: {}", topicString, jsonString);

        } catch (Exception ex) {
            logger.error("[executeSchedule] Failed for task {}: {}", task, ex.getMessage(), ex);
        }
    }

    /**
     * If you want to let callers (e.g. front end) list all saved schedules for a room:
     */
    public List<ScheduleSetting> getSchedulesForRoom(String username, String roomName) {
        return scheduleRepo.findByUsernameAndRoomName(username, roomName);
    }

    @Transactional
    public ScheduleSetting updateSchedule(
            String username,
            String roomName,
            String scheduleId,
            ScheduleSetRequest updatedRequest
    ) {
        // 1) Fetch existing document
        ScheduleSetting existing = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException(
                        "Schedule not found with id: " + scheduleId));

        // 2) Verify it belongs to (username, roomName)
        if (!existing.getUsername().equals(username) || !existing.getRoomName().equals(roomName)) {
            throw new RuntimeException(
                    String.format(
                            "Schedule id='%s' does not belong to user='%s', room='%s'",
                            scheduleId, username, roomName
                    )
            );
        }

        // 3) Validate the new payload's room_name matches
        ScheduleSetRequest.Payload p = updatedRequest.getPayload();
        if (!roomName.equals(p.getRoom_name())) {
            throw new RuntimeException("Payload room_name must match path variable roomName");
        }
        if (p.getAutomation() == null || p.getAutomation().isEmpty()) {
            throw new RuntimeException("No 'automation' block in payload");
        }
        ScheduleSetRequest.AutomationInfo auto = p.getAutomation().get(0);

        // 4) Overwrite fields
        existing.setDate(p.getDate());
        existing.setTime(p.getTime());
        existing.setMessage(
                p.getMessage().stream().map(dtoBulb -> {
                    ScheduleSetting.BulbInfo b = new ScheduleSetting.BulbInfo();
                    b.setBulb_id(dtoBulb.getBulb_id());
                    b.setBrightness(dtoBulb.getBrightness());
                    return b;
                }).toList()
        );
        existing.setScheduleType(auto.getSchedule_type());
        existing.setScheduleWorkingPeriod(auto.getSchedule_working_period());

        // 5) Save back to Mongo
        ScheduleSetting updated = scheduleRepo.save(existing);
        logger.info("[updateSchedule] schedule '{}' updated for {}/{}", scheduleId, username, roomName);

        // 6) Re-queue (if the new local time is within [nowUTC, nowUTC+1h])
        ZonedDateTime newLocal       = ZonedDateTime.of(updated.getDate(), updated.getTime(), LOCAL_ZONE);
        Instant     newInstant       = newLocal.toInstant();
        Instant     nowInstant       = Instant.now();
        Instant     nextHourInstant  = nowInstant.plus(1, ChronoUnit.HOURS);

        synchronized (scheduleQueue) {
            // Remove any previously queued instance
            scheduleQueue.removeIf(task -> task.getSchedule().getId().equals(scheduleId));

            if (newInstant.isBefore(nowInstant)) {
                // Already passed → do nothing
                logger.warn(
                        "[updateSchedule] New execution time {} (Colombo) → {} (UTC) is in the past; not re-queuing.",
                        newLocal,
                        newInstant
                );
            }
            else if (!newInstant.isAfter(nextHourInstant)) {
                // Within the next hour → queue immediately
                ScheduleTask newTask = new ScheduleTask(roomName, username, updated);
                scheduleQueue.add(newTask);
                logger.info(
                        "[updateSchedule] Re-queued schedule '{}' to run at {} (Colombo) → {} (UTC)",
                        scheduleId,
                        newLocal,
                        newInstant
                );
            }
            // Otherwise, leave in Mongo for the next hourly scan.
        }
        return updated;
    }

    @Transactional
    public void deleteSchedule(String username, String roomName, String scheduleId) {
        // 1) Fetch to verify existence
        ScheduleSetting existing = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException(
                        "Schedule not found with id: " + scheduleId));

        // 2) Verify owner/roomName match
        if (!existing.getUsername().equals(username) || !existing.getRoomName().equals(roomName)) {
            throw new RuntimeException(
                    String.format(
                            "Schedule id='%s' does not belong to user='%s', room='%s'",
                            scheduleId, username, roomName
                    )
            );
        }

        // 3) Remove from in-memory queue if present
        synchronized (scheduleQueue) {
            scheduleQueue.removeIf(task -> task.getSchedule().getId().equals(scheduleId));
        }

        // 4) Delete from Mongo
        scheduleRepo.deleteById(scheduleId);
        logger.info("[deleteSchedule] schedule '{}' deleted for {}/{}", scheduleId, username, roomName);
    }

    /**
     * Rename all ScheduleSetting documents for a given (username, oldRoomName) → newRoomName.
     * If none are found, throw a RuntimeException to let the caller skip this step.
     */
    @Transactional
    public void updateRoomName(String username, String oldRoomName, String newRoomName) {
        List<ScheduleSetting> schedules =
                scheduleRepo.findByUsernameAndRoomName(username, oldRoomName);

        if (schedules.isEmpty()) {
            throw new RuntimeException("Schedules not found for " + username + "/" + oldRoomName);
        }

        for (ScheduleSetting s : schedules) {
            s.setRoomName(newRoomName);
        }
        scheduleRepo.saveAll(schedules);
        logger.info(
                "[updateRoomName] Renamed {} schedule(s) from '{}' → '{}' for user='{}'",
                schedules.size(), oldRoomName, newRoomName, username
        );
    }

    /**
     * Delete all ScheduleSetting documents (and queued tasks) for a given (username, roomName).
     * If none are found, throw a RuntimeException to let the caller skip this step.
     */
    @Transactional
    public void deleteRoom(String username, String roomName) {
        List<ScheduleSetting> schedules =
                scheduleRepo.findByUsernameAndRoomName(username, roomName);

        if (schedules.isEmpty()) {
            throw new RuntimeException("Schedules not found for " + username + "/" + roomName);
        }

        // Remove each matching task from the in-memory queue
        synchronized (scheduleQueue) {
            for (ScheduleSetting s : schedules) {
                scheduleQueue.removeIf(task ->
                        task.getSchedule().getId().equals(s.getId())
                );
            }
        }

        // Delete from MongoDB
        for (ScheduleSetting s : schedules) {
            scheduleRepo.deleteById(s.getId());
        }
        logger.info(
                "[deleteRoom] Deleted {} schedule(s) for room '{}' and user='{}'",
                schedules.size(), roomName, username
        );
    }
}
