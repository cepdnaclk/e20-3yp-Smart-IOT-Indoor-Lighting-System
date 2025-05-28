package com.example.Lightify.Service;

import com.example.Lightify.Entity.Area;
import com.example.Lightify.Repository.AreaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AreaService {
    private static final Logger logger = LoggerFactory.getLogger(AreaService.class);
    private final AreaRepository areaRepository;

    public AreaService(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    /**
     * Add new or replace existing Area document for a user-room.
     */
    public Area addOrUpdateArea(Area area) {
        try {
            Optional<Area> existing = areaRepository.findByUsernameAndRoomName(
                    area.getUsername(), area.getRoomName());
            if (existing.isPresent()) {
                Area updated = existing.get();
                updated.setAreas(area.getAreas());
                return areaRepository.save(updated);
            } else {
                return areaRepository.save(area);
            }
        } catch (Exception e) {
            logger.error("Failed to add/update area for {} in {}", area.getUsername(), area.getRoomName(), e);
            throw new RuntimeException("Failed to add/update area: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch area by user and room.
     */
    public Optional<Area> getArea(String username, String roomName) {
        try {
            return areaRepository.findByUsernameAndRoomName(username, roomName);
        } catch (Exception e) {
            logger.error("Failed to fetch area for {} in {}", username, roomName, e);
            throw new RuntimeException("Failed to get area: " + e.getMessage(), e);
        }
    }

    /**
     * Delete area mapping for a user-room.
     */
    public void deleteArea(String username, String roomName) {
        try {
            areaRepository.deleteByUsernameAndRoomName(username, roomName);
        } catch (Exception e) {
            logger.error("Failed to delete area for {} in {}", username, roomName, e);
            throw new RuntimeException("Failed to delete area: " + e.getMessage(), e);
        }
    }

    // AreaService.java
    @Transactional
    public void updateAreaRoomName(String username, String oldRoomName, String newRoomName) {
        logger.info("[updateAreaRoomName] user='{}' '{}'→'{}'", username, oldRoomName, newRoomName);
        try {
            areaRepository.findByUsernameAndRoomName(username, oldRoomName)
                    .ifPresent(a -> {
                        a.setRoomName(newRoomName);
                        areaRepository.save(a);
                        logger.debug("[updateAreaRoomName] Area id='{}' updated", a.getId());
                    });
        } catch (Exception e) {
            logger.error("[updateAreaRoomName] FAILED user='{}' '{}'→'{}': {}",
                    username, oldRoomName, newRoomName, e.getMessage(), e);
            throw new RuntimeException("Failed to update area roomName: " + e.getMessage(), e);
        }
    }

}