package com.example.Lightify.Service;

import com.example.Lightify.DTO.RoomConfigurationRequest;
import com.example.Lightify.Entity.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class RoomConfigurationService {
    private static final Logger logger = LoggerFactory.getLogger(RoomConfigurationService.class);

    private final BulbService bulbService;
    private final AreaService areaService;
    private final AutomationModeService modeService;
    private final TopicService topicService;
    private final AwsIotPubSubService awsIotPubSubService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RoomConfigurationService(BulbService bulbService,
                                    AreaService areaService,
                                    AutomationModeService modeService, TopicService topicService, AwsIotPubSubService awsIotPubSubService) {
        this.bulbService = bulbService;
        this.areaService = areaService;
        this.modeService = modeService;
        this.topicService = topicService;
        this.awsIotPubSubService = awsIotPubSubService;
    }

    /**
     * Receives a complete room configuration JSON, then adds or updates
     * bulbs, areas, and automation modes. All operations occur in a
     * single transaction; on failure, changes are rolled back.
     */
    @Transactional
    public void configureRoom(RoomConfigurationRequest request) {
        logger.info("[configureRoom] Starting configuration for user='{}', room='{}'",
                request.getUsername(), request.getRoomName());
        try {
            // 1) Bulbs (ignore duplicates)
            for (Bulb b : request.getBulbs()) {
                try {
                    bulbService.addBulb(b);
                } catch (RuntimeException e) {
                    if (e.getMessage() != null && e.getMessage().contains("already exists")) {
                        logger.warn("[configureRoom] Bulb skipped (exists): user='{}', bulbId='{}', , name='{}'",
                                b.getUsername(), b.getBulbId(), b.getName());
                    } else {
                        throw e;
                    }
                }
            }

            // 2) Areas
            Area area = new Area(request.getUsername(),
                    request.getRoomName(),
                    request.getAreas());
            logger.debug("[configureRoom] Adding/updating area for user='{}', room='{}'",
                    request.getUsername(), request.getRoomName());
            areaService.addOrUpdateArea(area);

            // 3) Automation Modes
            List<ModeDetail> modes = request.getAutomationModes();
            logger.debug("[configureRoom] Processing {} automation modes for user='{}', room='{}'",
                    modes.size(), request.getUsername(), request.getRoomName());
            for (ModeDetail md : modes) {
                logger.debug("[configureRoom] Mode '{}': {} rules",
                        md.getModeName(), md.getRules().size());
                for (RuleDetail rd : md.getRules()) {
                    logger.debug("[configureRoom] -- Rule '{}', area='{}', ON={}, OFF={}",
                            rd.getRuleName(),
                            rd.getArea().getName(),
                            rd.getSelectedBulbs().getOn().size(),
                            rd.getSelectedBulbs().getOff().size());
                }
            }

            AutomationMode mode = new AutomationMode(
                    null,
                    request.getUsername(),
                    request.getRoomName(),
                    modes,
                    null
            );
            modeService.addOrUpdateAutomationMode(mode);

            logger.info("[configureRoom] Successfully configured room='{}' for user='{}'",
                    request.getRoomName(), request.getUsername());
        } catch (Exception e) {
            logger.error("[configureRoom] Configuration failed for user='{}', room='{}': {}",
                    request.getUsername(), request.getRoomName(), e.getMessage(), e);
            throw new RuntimeException("Configuration failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches the full saved configuration for the given user and room.
     */
    public RoomConfigurationRequest getRoomConfiguration(String username, String roomName) {
        logger.info("[getRoomConfiguration] Start fetching configuration for user='{}', room='{}'",
                username, roomName);

        // Bulbs
        logger.debug("[getRoomConfiguration] Fetching bulbs for user='{}'", username);
        List<Bulb> bulbs = bulbService.getBulbsByUsername(username);
        logger.debug("[getRoomConfiguration] Retrieved bulbs count={} for user='{}'",
                bulbs.size(), username);

        // Areas
        logger.debug("[getRoomConfiguration] Fetching areas for user='{}', room='{}'",
                username, roomName);
        Optional<Area> areaOpt = areaService.getArea(username, roomName);
        List<AreaDetail> areasList = areaOpt
                .map(Area::getAreas)
                .orElse(Collections.emptyList());
        logger.debug("[getRoomConfiguration] Retrieved areas count={} for user='{}', room='{}'",
                areasList.size(), username, roomName);

        // Automation Modes
        logger.debug("[getRoomConfiguration] Fetching automation modes for user='{}', room='{}'",
                username, roomName);
        Optional<AutomationMode> modeOpt = modeService.getAutomationMode(username, roomName);
        List<ModeDetail> modesList = modeOpt
                .map(AutomationMode::getAutomation_Modes)
                .orElse(Collections.emptyList());
        logger.debug("[getRoomConfiguration] Retrieved automation modes count={} for user='{}', room='{}'",
                modesList.size(), username, roomName);

        RoomConfigurationRequest result = new RoomConfigurationRequest();
        result.setUsername(username);
        result.setRoomName(roomName);
        result.setBulbs(bulbs);
        result.setAreas(areasList);
        result.setAutomationModes(modesList);

        logger.info("[getRoomConfiguration] Completed fetching configuration for user='{}', room='{}'",
                username, roomName);
        return result;
    }

    public void publishAutomationUpdate(String username, String roomName ,String targetModeName) throws ExecutionException, InterruptedException {
        // 1) Look up the MQTT topic string
        Topic topic = topicService.getTopicByRoomNameAndUsername(roomName, username);
        String topicString = topic.getTopicString();

        // 2) Fetch the full automation-mode object
        AutomationMode am = modeService.getAutomationMode(username, roomName)
                .orElseThrow(() -> new RuntimeException("No automation mode found"));

        // 3) Build the exact JSON payload
        Map<String,Object> root = new LinkedHashMap<>();
        root.put("command", "update_automation_mode");

        List<Map<String, Object>> modesList = new ArrayList<>();
        for (ModeDetail m : am.getAutomation_Modes()) {
            if (!m.getModeName().equals(targetModeName)) {
                continue; // skip any mode whose name doesn’t match
            }

            Map<String, Object> modeMap = new LinkedHashMap<>();
            modeMap.put("Mode_Name", m.getModeName());
            modeMap.put(
                    "Areas",
                    areaService
                            .getArea(username, roomName)
                            .orElse(new Area())
                            .getAreas()
            );
            modeMap.put("Rules", m.getRules());
            modesList.add(modeMap);
            break;
        }

        if (modesList.isEmpty()) {
            throw new RuntimeException(
                    String.format("Mode '%s' not found for user='%s', room='%s'",
                            targetModeName, username, roomName)
            );
        }
        // Wrap into payload
        root.put("payload", modesList.size()==1 ? modesList.getFirst() : Collections.singletonMap("Modes", modesList));

        String json;
        try {
            json = objectMapper.writeValueAsString(root);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize MQTT payload", e);
        }
        logger.info("[publishAutomationUpdate] payload JSON = {}", json);

        //0) persist “this is the mode we are about to send”
        modeService.setCurrentlyActivatedMode(username, roomName, targetModeName);

        // 4) Publish
        awsIotPubSubService.publish(topicString, json);
        logger.info("[publishAutomationUpdate] Published to {}: {}", topicString, json);
    }

    public void publishLatestAutomationUpdate(
            String username,
            String roomName,
            String targetModeName
    ) throws ExecutionException, InterruptedException {
        logger.info("[publishLatestAutomationUpdate] entered for {}/{} mode='{}'",
                username, roomName, targetModeName);

        // 1) Look up the base topic
        Topic topic = topicService.getTopicByRoomNameAndUsername(roomName, username);
        String baseTopic = topic.getTopicString();
        logger.info("[publishLatestAutomationUpdate] baseTopic = {}", baseTopic);

        // 2) Append the “receive_rule_from_backend” suffix
        String targetTopic = baseTopic + "/receive_rule_from_backend";
        logger.info("[publishLatestAutomationUpdate] targetTopic = {}", targetTopic);

        // 3) Load the AutomationMode doc
        AutomationMode am = modeService.getAutomationMode(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        "No automation mode found for " + username + "/" + roomName
                ));
        logger.info("[publishLatestAutomationUpdate] fetched AutomationMode with {} modes",
                am.getAutomation_Modes().size());

        // 4) Build the JSON payload
        Map<String, Object> root = new LinkedHashMap<>();
        root.put("command", "update_automation_mode");

        List<Map<String, Object>> modesList = new ArrayList<>();
        for (ModeDetail m : am.getAutomation_Modes()) {
            if (!m.getModeName().equals(targetModeName)) continue;
            Map<String, Object> modeMap = new LinkedHashMap<>();
            modeMap.put("Mode_Name", m.getModeName());
            modeMap.put("Areas", areaService
                    .getArea(username, roomName)
                    .orElse(new Area())
                    .getAreas());
            modeMap.put("Rules", m.getRules());
            modesList.add(modeMap);
            break;
        }

        if (modesList.isEmpty()) {
            logger.warn("[publishLatestAutomationUpdate] no matching mode '{}' for {}/{}",
                    targetModeName, username, roomName);
            throw new RuntimeException(
                    String.format("Mode '%s' not found for user='%s', room='%s'",
                            targetModeName, username, roomName)
            );
        }
        logger.info("[publishLatestAutomationUpdate] built modesList size = {}",
                modesList.size());

        root.put(
                "payload",
                modesList.size() == 1
                        ? modesList.get(0)
                        : Collections.singletonMap("Modes", modesList)
        );

        String json;
        try {
            json = objectMapper.writeValueAsString(root);
        } catch (JsonProcessingException e) {
            logger.error("[publishLatestAutomationUpdate] JSON serialization failed", e);
            throw new RuntimeException("Failed to serialize MQTT payload", e);
        }
        logger.info("[publishLatestAutomationUpdate] payload JSON = {}", json);

        // 5) Publish
        awsIotPubSubService.publish(targetTopic, json);
        logger.info("[publishLatestAutomationUpdate] successfully published to {}",
                targetTopic);
    }
}
