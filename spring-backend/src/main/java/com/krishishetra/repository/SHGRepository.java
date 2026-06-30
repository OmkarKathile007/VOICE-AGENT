package com.krishishetra.repository;

import com.krishishetra.model.SHG;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SHGRepository extends MongoRepository<SHG, String> {
    Optional<SHG> findByEmail(String email);
}
