package com.krishishetra.controller;

import com.krishishetra.AbstractIntegrationTest;
import com.krishishetra.dto.LoginRequest;
import com.krishishetra.dto.RegisterRequest;
import com.krishishetra.model.User;
import com.krishishetra.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end tests for the auth flow (register / login / me) against the real
 * security filter chain, JWT and embedded MongoDB.
 */
class AuthControllerIT extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    private RegisterRequest registerRequest(String email, String password) {
        RegisterRequest req = new RegisterRequest();
        req.setEmail(email);
        req.setPassword(password);
        req.setName("Test Farmer");
        req.setRole("FPO");
        req.setPhone("9876543210");
        return req;
    }

    @Test
    void registerCreatesUserAndReturnsToken() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(registerRequest("new@krishi.in", "secret123"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email", is("new@krishi.in")))
                .andExpect(jsonPath("$.role", is("FPO")));

        User saved = userRepository.findByEmail("new@krishi.in").orElseThrow();
        assertThat(saved.getName()).isEqualTo("Test Farmer");
        // Password must be stored hashed, never in plain text.
        assertThat(saved.getPassword()).isNotEqualTo("secret123");
    }

    @Test
    void registerWithDuplicateEmailReturns409() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(registerRequest("dup@krishi.in", "secret123"))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(registerRequest("dup@krishi.in", "secret123"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", is("Email already registered")));
    }

    @Test
    void registerWithInvalidEmailReturns400() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(registerRequest("not-an-email", "secret123"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerWithShortPasswordReturns400() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(registerRequest("short@krishi.in", "123"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginWithValidCredentialsReturnsToken() throws Exception {
        registerAndGetToken("login@krishi.in", "secret123", "Consumer");

        LoginRequest login = new LoginRequest();
        login.setEmail("login@krishi.in");
        login.setPassword("secret123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email", is("login@krishi.in")));
    }

    @Test
    void loginWithWrongPasswordReturns401() throws Exception {
        registerAndGetToken("wrongpw@krishi.in", "secret123", "Consumer");

        LoginRequest login = new LoginRequest();
        login.setEmail("wrongpw@krishi.in");
        login.setPassword("totally-wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Invalid email or password")));
    }

    @Test
    void meReturnsProfileForValidToken() throws Exception {
        String token = registerAndGetToken("me@krishi.in", "secret123", "Processor");

        mockMvc.perform(get("/api/auth/me").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("me@krishi.in")))
                .andExpect(jsonPath("$.role", is("Processor")));
    }
}
