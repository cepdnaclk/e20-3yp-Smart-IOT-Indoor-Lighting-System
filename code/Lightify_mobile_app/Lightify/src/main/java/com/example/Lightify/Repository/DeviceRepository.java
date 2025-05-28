package com.example.Lightify.Repository;

import com.example.Lightify.Entity.Device;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends MongoRepository<Device, String> {
    List<Device> findByUsername(String username);
    Optional<Device> findByUsernameAndMacAddress(String username, String macAddress);
    void deleteByUsernameAndMacAddress(String username, String macAddress);
}
