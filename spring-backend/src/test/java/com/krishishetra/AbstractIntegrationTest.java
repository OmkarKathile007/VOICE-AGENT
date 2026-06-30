package com.krishishetra;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishishetra.dto.LoginRequest;
import com.krishishetra.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Base class for full-stack integration tests.
 *
 * <p>Boots the whole Spring context (security filter chain, JWT, controllers,
 * repositories) against an embedded in-memory MongoDB. Every test method starts
 * with an empty database.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected MongoTemplate mongoTemplate;

    @BeforeEach
    void wipeDatabase() {
        mongoTemplate.getCollectionNames().forEach(mongoTemplate::dropCollection);
    }

    protected String toJson(Object o) throws Exception {
        return objectMapper.writeValueAsString(o);
    }

    /** Registers a new user and returns the issued JWT. */
    protected String registerAndGetToken(String email, String password, String role) throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail(email);
        req.setPassword(password);
        req.setRole(role);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(req)))
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    /** Logs in an existing user and returns the issued JWT. */
    protected String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(req)))
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    protected static String bearer(String token) {
        return "Bearer " + token;
    }
}
