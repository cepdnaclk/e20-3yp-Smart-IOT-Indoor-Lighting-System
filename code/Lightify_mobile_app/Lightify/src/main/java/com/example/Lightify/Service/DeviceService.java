package com.example.Lightify.Service;

import com.example.Lightify.Entity.Device;
import com.example.Lightify.Repository.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {
    private static final Logger logger = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public Device addDevice(Device device) {
        try {
            Optional<Device> existing = deviceRepository.findByUsernameAndMacAddress(
                    device.getUsername(), device.getMacAddress());
            if (existing.isPresent()) {
                String errorMsg = "Device already exists for user: " + device.getUsername()
                        + " and MAC: " + device.getMacAddress();
                logger.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
            return deviceRepository.save(device);
        } catch (Exception e) {
            logger.error("Failed to add device for user: {} mac: {}", device.getUsername(), device.getMacAddress(), e);
            throw new RuntimeException("Failed to add device: " + e.getMessage(), e);
        }
    }

    public List<Device> getDevicesByUsername(String username) {
        try {
            return deviceRepository.findByUsername(username);
        } catch (Exception e) {
            logger.error("Failed to retrieve devices for user: {}", username, e);
            throw new RuntimeException("Failed to get devices: " + e.getMessage(), e);
        }
    }

    public void deleteDeviceById(String id) {
        try {
            deviceRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Failed to delete device with id: {}", id, e);
            throw new RuntimeException("Failed to delete device: " + e.getMessage(), e);
        }
    }

    public void deleteDeviceByUsernameAndMacAddress(String username, String macAddress) {
        try {
            deviceRepository.deleteByUsernameAndMacAddress(username, macAddress);
        } catch (Exception e) {
            logger.error("Failed to delete device for user: {} mac: {}", username, macAddress, e);
            throw new RuntimeException("Failed to delete device: " + e.getMessage(), e);
        }
    }
}
