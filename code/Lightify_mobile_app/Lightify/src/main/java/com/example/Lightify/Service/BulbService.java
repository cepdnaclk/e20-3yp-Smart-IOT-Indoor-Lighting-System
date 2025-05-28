package com.example.Lightify.Service;

import com.example.Lightify.Entity.Bulb;
import com.example.Lightify.Repository.BulbRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
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
            Optional<Bulb> existing = bulbRepository.findByUsernameAndName(
                    bulb.getUsername(), bulb.getName());
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

    public void deleteBulbById(String id) {
        try {
            bulbRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Failed to delete bulb with id: {}", id, e);
            throw new RuntimeException("Failed to delete bulb: " + e.getMessage(), e);
        }
    }

    public void deleteBulbByUsernameAndName(String username, String name) {
        try {
            bulbRepository.deleteByUsernameAndName(username, name);
        } catch (Exception e) {
            logger.error("Failed to delete bulb for user: {} name: {}", username, name, e);
            throw new RuntimeException("Failed to delete bulb: " + e.getMessage(), e);
        }
    }
}
