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
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;

    private double price;

    private Double originalPrice;

    private String imageUrl;

    private String category;

    private String origin;

    private String badge;

    private double rating;

    private int reviews;

    private String description;

    private boolean inStock;

    // ── SHG verification workflow ───────────────────────────────────────────────
    /** PENDING_SHG_VERIFICATION | APPROVED | REJECTED. Null = legacy/admin product (treated as APPROVED). */
    @Indexed
    private String verificationStatus;

    /** Email of the SHG verifier who approved/rejected. */
    private String verifiedBy;

    private String verifiedByName;

    private Instant verifiedAt;

    /** Free-text remark left by the SHG on approval. */
    private String verificationRemark;

    /** Structured reason on rejection (e.g. "Poor Product Quality"). */
    private String rejectionReason;

    /** Full audit trail of created/approved/rejected/resubmitted events. */
    @Builder.Default
    private List<VerificationEvent> verificationHistory = new ArrayList<>();

    // ── Farmer listing context (set when a farmer creates a product via voice) ──
    @Indexed
    private String farmerId;

    private String farmerName;

    private String farmerEmail;

    private String village;

    @Indexed
    private String fpoId;

    private String fpoName;

    /** SHG the listing is routed to (resolved from the farmer's FPO mapping). */
    @Indexed
    private String shgId;

    private String crop;

    private String quantity;

    /** Price the farmer expects, as captured (kept alongside numeric {@link #price}). */
    private String expectedPrice;

    /** Raw AI voice transcript the listing was extracted from. */
    private String voiceTranscript;

    /** Structured fields the AI agent extracted from the transcript. */
    private Map<String, Object> aiExtractedFields;

    /** 0–100 quality score from the AI quality scan. */
    private Double qualityScore;

    /** Government / organic certifications attached to the listing. */
    private List<String> certifications;

    /** Additional product images (base64 or URLs). */
    private List<String> images;

    /** "manual" | "voice" — how the listing was created. */
    private String source;

    private Instant createdAt;
}
