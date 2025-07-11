package com.example.Lightify.Service;


import com.example.Lightify.DTO.RoomInfoDTO;
import com.example.Lightify.DTO.RoomWishlistDTO;
import com.example.Lightify.Entity.DeviceAssignment;
import com.example.Lightify.Entity.RoomSetting;
import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.RoomSettingRepository;
import com.example.Lightify.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@Service
public class RoomSettingService {
    private static final Logger logger = LoggerFactory.getLogger(RoomSettingService.class);

    private final RoomSettingRepository roomSettingRepository;
    private final TopicService topicService;
    private final DeviceService deviceService;  // ← inject DeviceService
    private final AutomationModeService automationModeService;
    private final AreaService areaService;
    private final ScheduleService scheduleService;
    private final UserRepository userRepository;


    public RoomSettingService(RoomSettingRepository roomSettingRepository,
                              TopicService topicService,
                              DeviceService deviceService, AutomationModeService automationModeService, AreaService areaService, ScheduleService scheduleService, UserRepository userRepository) {
        this.roomSettingRepository = roomSettingRepository;
        this.topicService          = topicService;
        this.deviceService         = deviceService;
        this.automationModeService = automationModeService;
        this.areaService = areaService;
        this.scheduleService = scheduleService;
        this.userRepository = userRepository;
    }

    /**
     * Fetch all rooms (id + name) for a given user.
     * @throws IllegalArgumentException if username is null/blank
     * @throws RuntimeException if user does not exist
     */
    public List<RoomInfoDTO> getRoomsForUser(String username) {
        if (username == null || username.isBlank()) {
            logger.warn("[getRoomsForUser] Missing username");
            throw new IllegalArgumentException("username must be provided");
        }
        if (!userRepository.existsByUsername(username)) {
            logger.warn("[getRoomsForUser] No such user='{}'", username);
            throw new RuntimeException("User not found");
        }

        return roomSettingRepository.findByUsername(username)
                .stream()
                .map(rs -> new RoomInfoDTO(rs.getId(), rs.getRoomName()))
                .collect(Collectors.toList());
    }

    /**
     * Adds one or more devices to an existing room:
     *  1) Verifies the RoomSetting exists (else throws 404).
     *  2) For each new device:
     *     • Calls TopicService.addTopic(...) to create & subscribe.
     *     • Calls DeviceService.deleteDeviceByUsernameAndMacAddress(...) to remove from pool.
     *  3) Appends the devices to the RoomSetting and saves.
     * All within one @Transactional so any failure rolls back both topic & room updates.
     */
    @Transactional
    public RoomSetting addDevicesToRoom(String username,
                                        String roomName,
                                        List<DeviceAssignment> addedDevices) {
        // 1) ensure it does *not* already exist
        if (roomSettingRepository.findByUsernameAndRoomName(username, roomName).isPresent()) {
            String msg = "Room already exists with name '" + roomName + "' for user '" + username + "'";
            logger.warn("[addDevicesToRoom] {}", msg);
            throw new RuntimeException(msg);
        }

        // 2) create the new RoomSetting
        RoomSetting room = new RoomSetting();
        room.setUsername(username);
        room.setRoomName(roomName);
        room.setAddedDevices(new ArrayList<>());
        room = roomSettingRepository.save(room);
        logger.info("[addDevicesToRoom] Created new RoomSetting id='{}'", room.getId());

        // 3) for each device: TopicService.addTopic(...) + DeviceService.deleteDevice...
        for (DeviceAssignment da : addedDevices) {
            logger.info("[addDevicesToRoom] Adding device '{}' (MAC={}) → room='{}'",
                    da.getDeviceName(), da.getMacAddress(), roomName);

            Topic topic = new Topic();
            topic.setUsername(username);
            topic.setRoomName(roomName);
            topic.setMacAddress(da.getMacAddress());
            Topic created = topicService.addTopic(topic);
            logger.info("[addDevicesToRoom] Created topic id='{}'", created.getId());

            deviceService.deleteDeviceByUsernameAndMacAddress(username, da.getMacAddress());
            logger.info("[addDevicesToRoom] Removed device MAC='{}' from pool", da.getMacAddress());

            room.getAddedDevices().add(da);
        }

        // 4) persist final list
        RoomSetting updated = roomSettingRepository.save(room);
        logger.info("[addDevicesToRoom] RoomSetting now has {} device(s)",
                updated.getAddedDevices().size());
        return updated;
    }



    /**
     * Rename a room across:
     * • room_settings
     * • rooms
     * • topics
     * • areas
     * • automation_modes
     * • Rename a room across all related collections,
     * • but skip any service that has no matching record.
     */
    @Transactional
    public RoomSetting renameRoom(String username, String oldRoomName, String newRoomName) {
        logger.info("[renameRoom] user='{}' '{}'→'{}'", username, oldRoomName, newRoomName);

        // 1) room_settings (must exist)
        RoomSetting rs = roomSettingRepository
                .findByUsernameAndRoomName(username, oldRoomName)
                .orElseThrow(() -> new RuntimeException(
                        "RoomSetting not found for " + username + "/" + oldRoomName));
        rs.setRoomName(newRoomName);
        RoomSetting updatedRs = roomSettingRepository.save(rs);

        // Helper to run an update and skip NotFound:
        BiConsumer<Runnable,String> attempt = (action, label) -> {
            try {
                action.run();
                logger.debug("[renameRoom] {} updated", label);
            } catch (RuntimeException e) {
                if (e.getMessage().contains("not found")) {
                    logger.warn("[renameRoom] {} not found, skipping", label);
                } else {
                    throw e; // real error → rollback
                }
            }
        };

        // 2) schedule
        attempt.accept(
                () -> scheduleService.updateRoomName(username, oldRoomName, newRoomName),
                "RoomService"
        );

        // 3) topics
        attempt.accept(
                () -> topicService.updateTopicRoomName(username, oldRoomName, newRoomName),
                "TopicService"
        );

        // 4) areas
        attempt.accept(
                () -> areaService.updateAreaRoomName(username, oldRoomName, newRoomName),
                "AreaService"
        );

        // 5) automation_modes
        attempt.accept(
                () -> automationModeService.updateAutomationModeRoomName(username, oldRoomName, newRoomName),
                "AutomationModeService"
        );

        logger.info("[renameRoom] completed for user='{}'", username);
        return updatedRs;
    }


    /**
     * Delete a room and its related data, but skip any service that has no record.
     */
    @Transactional
    public void deleteRoom(String username, String roomName) {
        logger.info("[deleteRoom] user='{}' room='{}'", username, roomName);

        // 1) topics
        try {
            topicService.deleteByUsernameAndRoomName(username, roomName);
            logger.debug("[deleteRoom] topics deleted");
        } catch (RuntimeException e) {
            logger.warn("[deleteRoom] no topics for user='{}' room='{}', skipping", username, roomName);
        }

        // 2) areas
        try {
            areaService.deleteArea(username, roomName);
            logger.debug("[deleteRoom] areas deleted");
        } catch (RuntimeException e) {
            logger.warn("[deleteRoom] no areas for user='{}' room='{}', skipping", username, roomName);
        }

        // 3) automation_modes
        try {
            automationModeService.deleteAutomationMode(username, roomName);
            logger.debug("[deleteRoom] automation modes deleted");
        } catch (RuntimeException e) {
            logger.warn("[deleteRoom] no automation modes for user='{}' room='{}', skipping", username, roomName);
        }

        // 4) rooms collection
        try {
            scheduleService.deleteRoom(username, roomName);
            logger.debug("[deleteRoom] room entry deleted");
        } catch (RuntimeException e) {
            logger.warn("[deleteRoom] no room entry for user='{}' room='{}', skipping", username, roomName);
        }

        // 5) room_settings
        roomSettingRepository.deleteByUsernameAndRoomName(username, roomName);
        logger.debug("[deleteRoom] room_settings entry deleted");

        logger.info("[deleteRoom] finished for user='{}' room='{}'", username, roomName);
    }

    /**
     * Mark a room as added to the wishlist.
     */
    @Transactional
    public RoomSetting addToWishlist(String username, String roomName) {
        logger.info("[addToWishlist] user='{}' room='{}'", username, roomName);

        // Find the room setting
        RoomSetting roomSetting = roomSettingRepository
                .findByUsernameAndRoomName(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        "RoomSetting not found for " + username + "/" + roomName));

        // Mark the room as added to the wishlist
        roomSetting.setWishlist(true);

        // Save the updated room setting
        RoomSetting updatedRoomSetting = roomSettingRepository.save(roomSetting);

        logger.info("[addToWishlist] Room '{}' added to wishlist for user '{}'", roomName, username);
        return updatedRoomSetting;
    }


    /**
     * Remove a room from the wishlist.
     */
    @Transactional
    public RoomSetting removeFromWishlist(String username, String roomName) {
        logger.info("[removeFromWishlist] user='{}' room='{}'", username, roomName);

        // Find the room setting
        RoomSetting roomSetting = roomSettingRepository
                .findByUsernameAndRoomName(username, roomName)
                .orElseThrow(() -> new RuntimeException(
                        "RoomSetting not found for " + username + "/" + roomName));

        // Mark the room as not on the wishlist
        roomSetting.setWishlist(false);

        // Save the updated room setting
        RoomSetting updatedRoomSetting = roomSettingRepository.save(roomSetting);

        logger.info("[removeFromWishlist] Room '{}' removed from wishlist for user '{}'", roomName, username);
        return updatedRoomSetting;
    }

    public List<RoomWishlistDTO> getWishlistRoomsForUser(String username) {
        if (username == null || username.isBlank()) {
            logger.warn("[getRoomsForUser] Missing username");
            throw new IllegalArgumentException("username must be provided");
        }
        if (!userRepository.existsByUsername(username)) {
            logger.warn("[getRoomsForUser] No such user='{}'", username);
            throw new RuntimeException("User not found");
        }

        // Fetch rooms for the user and include the isWishlist field
        return roomSettingRepository.findByUsername(username)
                .stream()
                .map(rs -> new RoomWishlistDTO(rs.getId(), rs.getRoomName(), rs.isWishlist()))  // Include the isWishlist value
                .collect(Collectors.toList());
    }




}