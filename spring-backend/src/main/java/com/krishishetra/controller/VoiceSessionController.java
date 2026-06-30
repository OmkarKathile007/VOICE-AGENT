package com.krishishetra.controller;

import com.krishishetra.model.User;
import com.krishishetra.model.VoiceSession;
import com.krishishetra.repository.UserRepository;
import com.krishishetra.repository.VoiceSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/voice-sessions")
@RequiredArgsConstructor
public class VoiceSessionController {

    private final VoiceSessionRepository sessionRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<VoiceSession>> getMySessions(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(
                sessionRepository.findByUserEmailOrderByCreatedAtDesc(principal.getUsername())
        );
    }

    @PostMapping
    public ResponseEntity<VoiceSession> saveSession(
            @RequestBody VoiceSession session,
            @AuthenticationPrincipal UserDetails principal) {

        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        session.setUserId(user.getId());
        session.setUserEmail(user.getEmail());
        session.setCreatedAt(Instant.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(sessionRepository.save(session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails principal) {

        sessionRepository.findById(id).ifPresent(s -> {
            if (s.getUserEmail().equals(principal.getUsername())) {
                sessionRepository.deleteById(id);
            }
        });
        return ResponseEntity.noContent().build();
    }
}
