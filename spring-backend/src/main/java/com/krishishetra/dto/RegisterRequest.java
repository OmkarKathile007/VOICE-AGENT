package com.krishishetra.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String name;

    private String role = "Consumer";

    private String phone;

    // ── Optional farmer linkage / profile (set when onboarding a farmer) ─────────
    private String fpoId;

    private String fpoName;

    private String mappedSHGId;

    private String district;

    private String taluka;

    private String village;

    private String landDetails;

    private String address;
}
