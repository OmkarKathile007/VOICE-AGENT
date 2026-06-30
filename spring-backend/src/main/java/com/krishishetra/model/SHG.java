package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A Self-Help Group — the local verification authority. An SHG is linked to one
 * login {@link User} (same email, role = SHG) and is mapped to one or more FPOs;
 * it can only see/verify farmers belonging to those mapped FPOs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "shgs")
public class SHG {

    @Id
    private String id;

    private String name;

    private String district;

    private String taluka;

    private String village;

    private String contactPerson;

    private String phone;

    /** Matches the SHG login {@link User#getEmail()}. */
    @Indexed(unique = true)
    private String email;

    /** FPO ids this SHG is responsible for verifying. */
    @Builder.Default
    private List<String> mappedFPOIds = new ArrayList<>();

    private Instant createdAt;
}
