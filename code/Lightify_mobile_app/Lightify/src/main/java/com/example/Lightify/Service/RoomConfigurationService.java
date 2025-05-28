package com.example.Lightify.Service;

import com.example.Lightify.DTO.RoomConfigurationRequest;
import com.example.Lightify.Entity.Area;
import com.example.Lightify.Entity.AutomationMode;
import com.example.Lightify.Entity.Bulb;
import com.example.Lightify.Entity.AreaDetail;
import com.example.Lightify.Entity.ModeDetail;
import com.example.Lightify.Entity.RuleDetail;   // <- import the RuleDetail class
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class RoomConfigurationService {
    private static final Logger logger = LoggerFactory.getLogger(RoomConfigurationService.class);

    private final BulbService bulbService;
    private final AreaService areaService;
    private final AutomationModeService modeService;

    public RoomConfigurationService(BulbService bulbService,
                                    AreaService areaService,
                                    AutomationModeService modeService) {
        this.bulbService = bulbService;
        this.areaService = areaService;
        this.modeService = modeService;
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
                        logger.warn("[configureRoom] Bulb skipped (exists): user='{}', name='{}'",
                                b.getUsername(), b.getName());
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
                    modes
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
}


//package com.example.Lightify.Service;
//
//import com.example.Lightify.DTO.RoomConfigurationRequest;
//import com.example.Lightify.Entity.Area;
//import com.example.Lightify.Entity.AutomationMode;
//import com.example.Lightify.Entity.Bulb;
//import com.example.Lightify.Entity.AreaDetail;
//import com.example.Lightify.Entity.ModeDetail;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//
//
//@Service
//public class RoomConfigurationService {
//    private static final Logger logger = LoggerFactory.getLogger(RoomConfigurationService.class);
//
//    private final BulbService bulbService;
//    private final AreaService areaService;
//    private final AutomationModeService modeService;
//
//    public RoomConfigurationService(BulbService bulbService,
//                                    AreaService areaService,
//                                    AutomationModeService modeService) {
//        this.bulbService = bulbService;
//        this.areaService = areaService;
//        this.modeService = modeService;
//    }
//
//    /**
//     * Receives a complete room configuration JSON, then adds or updates
//     * bulbs, areas, and automation modes. All operations occur in a
//     * single transaction; on failure, changes are rolled back.
//     */
//    @Transactional
//    public void configureRoom(RoomConfigurationRequest request) {
//        logger.info("Starting configuration for user='{}', room='{}'",
//                request.getUsername(), request.getRoomName());
//        try {
//            // 1) Bulbs (ignore duplicates, continue on existing bulbs)
//            for (Bulb b : request.getBulbs()) {
//                try {
//                    bulbService.addBulb(b);
//                } catch (RuntimeException e) {
//                    String msg = e.getMessage();
//                    if (msg != null && msg.contains("already exists")) {
//                        logger.warn("Bulb skipped (exists): user='{}', name='{}'",
//                                b.getUsername(), b.getName());
//                        // continue without failing
//                    } else {
//                        // critical failure -> propagate to trigger rollback
//                        throw e;
//                    }
//                }
//            }
//
//            // 2) Areas
//            Area area = new Area(
//                    request.getUsername(),
//                    request.getRoomName(),
//                    request.getAreas()
//            );
//            areaService.addOrUpdateArea(area);
//
//            // 3) Automation Modes
//            AutomationMode mode = new AutomationMode(
//                    null,
//                    request.getUsername(),
//                    request.getRoomName(),
//                    request.getAutomation_Modes()
//            );
//            modeService.addOrUpdateAutomationMode(mode);
//
//            logger.info("Successfully configured room='{}' for user='{}'",
//                    request.getRoomName(), request.getUsername());
//        } catch (Exception e) {
//            logger.error("Configuration failed for user='{}', room='{}': {}",
//                    request.getUsername(), request.getRoomName(), e.getMessage(), e);
//            throw new RuntimeException("Configuration failed: " + e.getMessage(), e);
//        }
//    }
//
//    /**
//     * Fetches the full saved configuration for the given user and room.
//     */
//    public RoomConfigurationRequest getRoomConfiguration(String username, String roomName) {
//        logger.info("Fetching configuration for user='{}', room='{}'", username, roomName);
//
//        // 1) Bulbs
//        List<Bulb> bulbs = bulbService.getBulbsByUsername(username);
//
//        // 2) Areas
//        Optional<Area> areaOpt = areaService.getArea(username, roomName);
//        List<AreaDetail> areasList = areaOpt.map(Area::getAreas)
//                .orElse(Collections.emptyList());
//
//        // 3) Automation Modes
//        Optional<AutomationMode> modeOpt = modeService.getAutomationMode(username, roomName);
//        List<ModeDetail> modesList = modeOpt.map(AutomationMode::getAutomation_Modes)
//                .orElse(Collections.emptyList());
//
//        // Build DTO
//        RoomConfigurationRequest result = new RoomConfigurationRequest();
//        result.setUsername(username);
//        result.setRoomName(roomName);
//        result.setBulbs(bulbs);
//        result.setAreas(areasList);
//        result.setAutomation_Modes(modesList);
//        return result;
//    }
//
//}
