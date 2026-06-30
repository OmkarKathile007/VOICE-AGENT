package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "voice_sessions")
public class VoiceSession {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String userEmail;

    private String summary;

    private String transcript;

    private String duration;

    private List<String> actions;

    private Instant createdAt;
}
