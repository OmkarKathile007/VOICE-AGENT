package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * A single entry in a {@link Product}'s verification history. Embedded inside the
 * product document (no separate collection) so the full audit trail travels with
 * the listing — created, approved, rejected and re-submitted events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationEvent {

    /** CREATED | APPROVED | REJECTED | RESUBMITTED */
    private String action;

    /** Email of the actor (SHG verifier or the farmer for CREATED/RESUBMITTED). */
    private String actorEmail;

    private String actorName;

    /** Role of the actor — e.g. SHG, FPO, Farmer. */
    private String actorRole;

    /** Free-text remark added by the verifier. */
    private String remark;

    /** Structured rejection reason (only set on REJECTED). */
    private String reason;

    private Instant at;
}
