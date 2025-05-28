package com.example.Lightify.Service;

import com.example.Lightify.Entity.Bulb;
import com.example.Lightify.Repository.BulbRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class BulbService {
    private static final Logger logger = LoggerFactory.getLogger(BulbService.class);
    private final BulbRepository bulbRepository;

    public BulbService(BulbRepository bulbRepository) {
        this.bulbRepository = bulbRepository;
    }

    public Bulb addBulb(Bulb bulb) {
        try {
            Optional<Bulb> existing = bulbRepository.findByUsernameAndBulbId(
                    bulb.getUsername(), bulb.getBulbId());
            if (existing.isPresent()) {
                String errorMsg = "Bulb already exists for user: " + bulb.getUsername()
                        + " with name: " + bulb.getName();
                logger.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
            return bulbRepository.save(bulb);
        } catch (Exception e) {
            logger.error("Failed to add bulb for user: {} name: {}", bulb.getUsername(), bulb.getName(), e);
            throw new RuntimeException("Failed to add bulb: " + e.getMessage(), e);
        }
    }

    public List<Bulb> getBulbsByUsername(String username) {
        try {
            return bulbRepository.findByUsername(username);
        } catch (Exception e) {
            logger.error("Failed to retrieve bulbs for user: {}", username, e);
            throw new RuntimeException("Failed to get bulbs: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieve a specific bulb by username and bulbId
     */
    public Bulb getBulbByUsernameAndBulbId(String username, String bulbId) {
        return bulbRepository.findByUsernameAndBulbId(username, bulbId)
                .orElseThrow(() -> new NoSuchElementException(
                        String.format("No bulb found for user: %s with bulbId: %s", username, bulbId)));
    }


    /**
     * Update the name of a bulb identified by username and bulbId
     */
    public Bulb updateBulbName(String username, String bulbId, String newName) {
        try {
            Bulb bulb = getBulbByUsernameAndBulbId(username, bulbId);
            bulb.setName(newName);
            return bulbRepository.save(bulb);
        } catch (Exception e) {
            logger.error("Failed to update bulb name for user: {} bulbId: {}", username, bulbId, e);
            throw new RuntimeException("Failed to update bulb: " + e.getMessage(), e);
        }
    }


    public void deleteBulbById(String id) {
        try {
            bulbRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Failed to delete bulb with id: {}", id, e);
            throw new RuntimeException("Failed to delete bulb: " + e.getMessage(), e);
        }
    }

    /**
     * Delete a bulb by username and bulbId
     */
    public void deleteBulbByUsernameAndBulbId(String username, String bulbId) {
        try {
            bulbRepository.deleteByUsernameAndBulbId(username, bulbId);
        } catch (Exception e) {
            logger.error("Failed to delete bulb for user: {} bulbId: {}", username, bulbId, e);
            throw new RuntimeException("Failed to delete bulb: " + e.getMessage(), e);
        }
    }
}
