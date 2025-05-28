package com.example.Lightify.Repository;

import com.example.Lightify.Entity.Bulb;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BulbRepository extends MongoRepository<Bulb, String> {
    List<Bulb> findByUsername(String username);
    Optional<Bulb> findByUsernameAndName(String username, String name);
    void deleteByUsernameAndName(String username, String name);
}
