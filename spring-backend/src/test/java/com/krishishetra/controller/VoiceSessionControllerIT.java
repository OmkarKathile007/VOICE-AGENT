package com.krishishetra.controller;

import com.krishishetra.AbstractIntegrationTest;
import com.krishishetra.model.VoiceSession;
import com.krishishetra.repository.VoiceSessionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end tests for voice-session history (save / list / delete) with
 * authentication and per-user ownership.
 */
class VoiceSessionControllerIT extends AbstractIntegrationTest {

    @Autowired
    private VoiceSessionRepository sessionRepository;

    private VoiceSession sampleSession() {
        return VoiceSession.builder()
                .summary("Asked about crop prices")
                .transcript("...")
                .duration("00:42")
                .actions(List.of("checked-prices"))
                .build();
    }

    @Test
    void savingSessionRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/voice-sessions")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleSession())))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isIn(401, 403));
    }

    @Test
    void saveSessionStampsOwnerFromPrincipal() throws Exception {
        String token = registerAndGetToken("voice@krishi.in", "secret123", "Consumer");

        mockMvc.perform(post("/api/voice-sessions")
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleSession())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userEmail", is("voice@krishi.in")))
                .andExpect(jsonPath("$.summary", is("Asked about crop prices")));

        assertThat(sessionRepository.findByUserEmailOrderByCreatedAtDesc("voice@krishi.in")).hasSize(1);
    }

    @Test
    void getMySessionsReturnsOnlyCallersSessions() throws Exception {
        String token = registerAndGetToken("voice2@krishi.in", "secret123", "Consumer");
        mockMvc.perform(post("/api/voice-sessions")
                .header("Authorization", bearer(token))
                .contentType(APPLICATION_JSON)
                .content(toJson(sampleSession())));

        mockMvc.perform(get("/api/voice-sessions").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].userEmail", is("voice2@krishi.in")));
    }

    @Test
    void deleteOwnSessionRemovesIt() throws Exception {
        String token = registerAndGetToken("voice3@krishi.in", "secret123", "Consumer");
        MvcResult created = mockMvc.perform(post("/api/voice-sessions")
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleSession())))
                .andReturn();
        String id = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(delete("/api/voice-sessions/" + id).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        assertThat(sessionRepository.findById(id)).isEmpty();
    }

    @Test
    void deleteAnotherUsersSessionIsNoOp() throws Exception {
        String ownerToken = registerAndGetToken("voiceowner@krishi.in", "secret123", "Consumer");
        MvcResult created = mockMvc.perform(post("/api/voice-sessions")
                        .header("Authorization", bearer(ownerToken))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleSession())))
                .andReturn();
        String id = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        String otherToken = registerAndGetToken("voiceintruder@krishi.in", "secret123", "Consumer");
        mockMvc.perform(delete("/api/voice-sessions/" + id).header("Authorization", bearer(otherToken)))
                .andExpect(status().isNoContent());

        // The session must still exist — only its owner may delete it.
        assertThat(sessionRepository.findById(id)).isPresent();
    }
}
