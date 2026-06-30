package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String name;

    private String role;  // Farmer, FPO, SHG, Startup, Processor, Consumer

    private String phone;

    // ── Farmer ↔ FPO ↔ SHG linkage (set for farmers / FPO members) ──────────────
    /** FPO this farmer belongs to. Used to route listings to the mapped SHG. */
    @Indexed
    private String fpoId;

    private String fpoName;

    /** SHG that verifies this farmer's listings (resolved from the FPO mapping). */
    private String mappedSHGId;

    // ── Profile details (surfaced on the SHG "Farmer Details" page) ─────────────
    private String district;

    private String taluka;

    private String village;

    /** e.g. "2.5 acres · Loamy soil · Rabi + Kharif". */
    private String landDetails;

    private String address;

    private Instant createdAt;
}
