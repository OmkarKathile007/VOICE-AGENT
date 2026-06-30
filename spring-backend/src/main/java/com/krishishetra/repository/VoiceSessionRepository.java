package com.krishishetra.repository;

import com.krishishetra.model.VoiceSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VoiceSessionRepository extends MongoRepository<VoiceSession, String> {
    List<VoiceSession> findByUserIdOrderByCreatedAtDesc(String userId);
    List<VoiceSession> findByUserEmailOrderByCreatedAtDesc(String email);
}
