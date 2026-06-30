package com.krishishetra.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pure unit tests for {@link JwtUtil} — no Spring context. The {@code @Value}
 * fields are injected manually via {@link ReflectionTestUtils}.
 */
class JwtUtilTest {

    private static final String SECRET = "unit-test-secret-key-which-is-long-enough-for-hs256";
    private static final long ONE_HOUR_MS = 3_600_000L;

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", ONE_HOUR_MS);
    }

    @Test
    @DisplayName("generated token carries the subject (email) and role claim")
    void generateTokenEncodesEmailAndRole() {
        String token = jwtUtil.generateToken("farmer@krishi.in", "FPO");

        assertThat(token).isNotBlank();
        assertThat(jwtUtil.getEmailFromToken(token)).isEqualTo("farmer@krishi.in");
        assertThat(jwtUtil.getRoleFromToken(token)).isEqualTo("FPO");
    }

    @Test
    @DisplayName("a freshly generated token validates as true")
    void validateTokenAcceptsValidToken() {
        String token = jwtUtil.generateToken("a@b.com", "Consumer");

        assertThat(jwtUtil.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("garbage / malformed token is rejected")
    void validateTokenRejectsGarbage() {
        assertThat(jwtUtil.validateToken("not-a-real-token")).isFalse();
    }

    @Test
    @DisplayName("token signed with a different secret is rejected")
    void validateTokenRejectsForeignSignature() {
        JwtUtil other = new JwtUtil();
        ReflectionTestUtils.setField(other, "jwtSecret", "a-completely-different-secret-key-also-long-enough");
        ReflectionTestUtils.setField(other, "jwtExpirationMs", ONE_HOUR_MS);
        String foreignToken = other.generateToken("a@b.com", "Consumer");

        assertThat(jwtUtil.validateToken(foreignToken)).isFalse();
    }

    @Test
    @DisplayName("an already-expired token is rejected")
    void validateTokenRejectsExpiredToken() {
        JwtUtil shortLived = new JwtUtil();
        ReflectionTestUtils.setField(shortLived, "jwtSecret", SECRET);
        // Negative expiry => token's exp is in the past the moment it is created.
        ReflectionTestUtils.setField(shortLived, "jwtExpirationMs", -1_000L);
        String expired = shortLived.generateToken("a@b.com", "Consumer");

        assertThat(jwtUtil.validateToken(expired)).isFalse();
    }
}
