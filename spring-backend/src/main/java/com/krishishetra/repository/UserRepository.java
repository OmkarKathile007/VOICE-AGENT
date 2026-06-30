package com.krishishetra.repository;

import com.krishishetra.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // ── SHG → farmer lookups ────────────────────────────────────────────────────
    List<User> findByMappedSHGId(String mappedSHGId);
    List<User> findByFpoIdIn(List<String> fpoIds);
    List<User> findByFpoId(String fpoId);
    List<User> findByRole(String role);
}
