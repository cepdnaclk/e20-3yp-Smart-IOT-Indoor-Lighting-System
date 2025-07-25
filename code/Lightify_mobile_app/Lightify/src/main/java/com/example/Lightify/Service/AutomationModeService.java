package com.example.Lightify.Service;

import com.example.Lightify.Entity.AutomationMode;
import com.example.Lightify.Repository.AutomationModeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AutomationModeService {
    private static final Logger logger = LoggerFactory.getLogger(AutomationModeService.class);
    private final AutomationModeRepository repository;

    public AutomationModeService(AutomationModeRepository repository) {
        this.repository = repository;
    }

    public AutomationMode addOrUpdateAutomationMode(AutomationMode mode) {
        try {
            Optional<AutomationMode> existing = repository.findByUsernameAndRoomName(
                    mode.getUsername(), mode.getRoomName());
            if (existing.isPresent()) {
                AutomationMode update = existing.get();
                update.setAutomation_Modes(mode.getAutomation_Modes());
                return repository.save(update);
            } else {
                return repository.save(mode);
            }
        } catch (Exception e) {
            logger.error("Failed to add/update automation modes for {} in {}", mode.getUsername(), mode.getRoomName(), e);
            throw new RuntimeException("Failed to add/update automation modes: " + e.getMessage(), e);
        }
    }

    public Optional<AutomationMode> getAutomationMode(String username, String roomName) {
        try {
            return repository.findByUsernameAndRoomName(username, roomName);
        } catch (Exception e) {
            logger.error("Failed to fetch automation modes for {} in {}", username, roomName, e);
            throw new RuntimeException("Failed to get automation modes: " + e.getMessage(), e);
        }
    }

    public void deleteAutomationMode(String username, String roomName) {
        try {
            repository.deleteByUsernameAndRoomName(username, roomName);
        } catch (Exception e) {
            logger.error("Failed to delete automation modes for {} in {}", username, roomName, e);
            throw new RuntimeException("Failed to delete automation modes: " + e.getMessage(), e);
        }
    }

    // AutomationModeService.java
    @Transactional
    public void updateAutomationModeRoomName(String username, String oldRoomName, String newRoomName) {
        logger.info("[updateAutomationModeRoomName] user='{}' '{}'→'{}'", username, oldRoomName, newRoomName);
        try {
            repository.findByUsernameAndRoomName(username, oldRoomName)
                    .ifPresent(m -> {
                        m.setRoomName(newRoomName);
                        repository.save(m);
                        logger.debug("[updateAutomationModeRoomName] Mode id='{}' updated", m.getId());
                    });
        } catch (Exception e) {
            logger.error("[updateAutomationModeRoomName] FAILED user='{}' '{}'→'{}': {}",
                    username, oldRoomName, newRoomName, e.getMessage(), e);
            throw new RuntimeException("Failed to update automation mode roomName: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void setCurrentlyActivatedMode(String username,
                                          String roomName,
                                          String modeName) {
        repository.findByUsernameAndRoomName(username, roomName)
                .ifPresent(m -> {
                    m.setCurrentlyActivatedMode(modeName);
                    repository.save(m);
                    logger.debug("Set currentlyActivatedMode='{}' for {}/{}", modeName, username, roomName);
                });
    }

}