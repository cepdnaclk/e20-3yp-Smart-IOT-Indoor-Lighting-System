package com.example.Lightify.Service;

import com.example.Lightify.Entity.RoomState;
import com.example.Lightify.Entity.RoomState.BulbInfo;
import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Entity.WebsocketIp;
import com.example.Lightify.Repository.RoomStateRepository;
import com.example.Lightify.Repository.TopicRepository;
import com.example.Lightify.Repository.WebsocketIpRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

/**
 * This service “knows how” to take an incoming JSON string + topic name (e.g. "alice/AA:BB:CC:DD/esp_to_backend")
 * and:
 *   1) parse out username & macAddress
 *   2) look up Topic → roomName
 *   3) route the JSON into either RoomState or WebsocketIp
 *   4) upsert (replace-or-insert) the document in Mongo
 *
 * It also provides fetch methods to retrieve the last known RoomState or WebsocketIp by (username, roomName).
 */
@Service
public class BackendMessageService {
    private static final Logger logger = LoggerFactory.getLogger(BackendMessageService.class);

    private final TopicRepository topicRepository;
    private final RoomStateRepository roomStateRepository;
    private final WebsocketIpRepository websocketIpRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AwsIotPubSubService awsIotPubSubService;

    public BackendMessageService(
            TopicRepository topicRepository,
            RoomStateRepository roomStateRepository,
            WebsocketIpRepository websocketIpRepository, AwsIotPubSubService awsIotPubSubService
    ) {
        this.topicRepository        = topicRepository;
        this.roomStateRepository    = roomStateRepository;
        this.websocketIpRepository  = websocketIpRepository;
        this.awsIotPubSubService = awsIotPubSubService;
    }

    /**
     * Call this whenever you get a new MQTT payload.  It will parse the JSON, determine "command",
     * find username+roomName from the topic, and upsert into the correct collection.
     *
     * @param fullTopic  The EXACT subscribed topic, e.g. "alice/AA:BB:CC:DD/esp_to_backend"
     * @param payloadStr The raw JSON string that came from MQTT
     */
    public void handleIncomingJson(String fullTopic, String payloadStr) {
        try {
            // 1) Parse the JSON into a tree so we can read "command"
            JsonNode root = objectMapper.readTree(payloadStr);
            String command = root.path("command").asText(null);
            if (command == null) {
                logger.warn("Ignoring payload with no 'command' field: {}", payloadStr);
                return;
            }

            // 2) Split topic → [ username, macAddress, "esp_to_backend" ]
            //    We assume the topic always has exactly this form.
            String[] parts = fullTopic.split("/");
            if (parts.length < 2) {
                logger.error("Invalid topic format: {}", fullTopic);
                return;
            }
            String username   = parts[0];
            String macAddress = parts[1];

            // 3) Look up Topic entity to find roomName
            //    (We assume you have a method findByUsernameAndMacAddress in TopicRepository.)
            Optional<Topic> topicOpt = topicRepository.findByUsernameAndMacAddress(username, macAddress);
            if (topicOpt.isEmpty()) {
                logger.error("No Topic found for username='{}' & macAddress='{}'", username, macAddress);
                return; // or throw, depending on desired behavior
            }
            String roomName = topicOpt.get().getRoomName();

            // 4) Depending on command, route into RoomState or WebsocketIp
            switch (command) {
                case "room_state":
                    handleRoomState(username, roomName, root);
                    break;

                case "websocket_ip":
                    handleWebsocketIp(username, roomName, root);
                    break;

                default:
                    logger.warn("Unknown command '{}' in payload: {}", command, payloadStr);
            }

        } catch (JsonProcessingException e) {
            logger.error("Failed to parse incoming JSON: {}", payloadStr, e);
        }
    }

    // ---- private helpers to upsert each document type ----

    private void handleRoomState(String username, String roomName, JsonNode root) {
        // Extract the array under payload.message
        JsonNode payloadNode = root.path("payload");
        if (!payloadNode.has("message")) {
            logger.warn("room_state payload missing 'message' field: {}", root.toString());
            return;
        }

        ArrayNode messageArray = (ArrayNode) payloadNode.get("message");

        // Convert JSON array → List<RoomState.BulbInfo>
        List<BulbInfo> bulbList = objectMapper.convertValue(
                messageArray,
                objectMapper.getTypeFactory().constructCollectionType(
                        List.class,
                        BulbInfo.class
                )
        );

        // Build a RoomState object
        RoomState rs = new RoomState();
        rs.setUsername(username);
        rs.setRoomName(roomName);
        rs.setMessage(bulbList);

        // Upsert: if a document exists for (username, roomName), replace it; otherwise insert
        Optional<RoomState> existingOpt = roomStateRepository.findByUsernameAndRoomName(username, roomName);
        if (existingOpt.isPresent()) {
            RoomState existing = existingOpt.get();
            rs.setId(existing.getId()); // preserve existing _id so save() overwrites
        }
        roomStateRepository.save(rs);
        logger.info("Upserted RoomState for {}/{} → {} bulbs",
                username, roomName, bulbList.size());
    }

    private void handleWebsocketIp(String username, String roomName, JsonNode root) {
        // Extract payload.ipaddress
        JsonNode payloadNode = root.path("payload");
        String ipaddr = payloadNode.path("ipaddress").asText(null);
        if (ipaddr == null) {
            logger.warn("websocket_ip payload missing 'ipaddress' field: {}", root.toString());
            return;
        }

        // Build WebsocketIp object
        WebsocketIp wi = new WebsocketIp();
        wi.setUsername(username);
        wi.setRoomName(roomName);
        wi.setIpaddress(ipaddr);

        // Upsert
        Optional<WebsocketIp> existingOpt = websocketIpRepository.findByUsernameAndRoomName(username, roomName);
        if (existingOpt.isPresent()) {
            wi.setId(existingOpt.get().getId());
        }
        websocketIpRepository.save(wi);
        logger.info("Upserted WebsocketIp for {}/{} → {}", username, roomName, ipaddr);
    }

    // ---- public methods to fetch the latest DTOs ----

    public void requestRoomState(String username, String roomName) {
        // 1) Look up the saved Topic entity for (username, roomName).
        Topic t = topicRepository
                .findByRoomNameAndUsername(roomName,username)
                .orElseThrow(() ->
                        new RuntimeException("No topic found for user='" + username
                                + "', roomName='" + roomName + "'")
                );

        // 2) Build the raw JSON payload:
        //    { "command":"room_state", "payload":{ "message":[] } }
        Map<String,Object> root = new LinkedHashMap<>();
        root.put("command", "room_state");
        // We send an *empty* array so that the ESP knows we are requesting its current state.
        root.put("payload", Collections.singletonMap("message", Collections.emptyList()));

        String json;
        try {
            json = objectMapper.writeValueAsString(root);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException("Failed to serialize room_state request JSON", ex);
        }

        // 3) Publish to "username/macAddress"
        String topicString = t.getTopicString();
        try {
            awsIotPubSubService.publish(topicString, json);
        } catch (InterruptedException | ExecutionException ex) {
            throw new RuntimeException("Failed to publish room_state request to MQTT", ex);
        }
    }

    /**
     * @return the stored RoomState (bulb list) for this (username, roomName), or empty if none.
     */
    public Optional<RoomState> getRoomState(String username, String roomName) {
        return roomStateRepository.findByUsernameAndRoomName(username, roomName);
    }

    /**
     * @return the stored WebsocketIp for this (username, roomName), or empty if none.
     */
    public Optional<WebsocketIp> getWebsocketIp(String username, String roomName) {
        return websocketIpRepository.findByUsernameAndRoomName(username, roomName);
    }

    public List<RoomState> getAllRoomStates() {
        return roomStateRepository.findAll();
    }

}
