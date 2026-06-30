package com.krishishetra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * Payload a farmer (via the AI voice agent or the manual listing form) submits to
 * create a product listing. The listing is saved as a {@code PENDING_SHG_VERIFICATION}
 * product and routed to the farmer's mapped SHG — it does NOT appear in the
 * marketplace until an SHG approves it.
 */
@Data
public class FarmerListingRequest {

    @NotBlank
    private String crop;

    @NotBlank
    private String quantity;

    /** Expected price as captured (e.g. "5000" or "₹50/kg"). */
    @NotBlank
    private String price;

    /** Village / market location. */
    private String location;

    /** Display name for the marketplace card; defaults to the crop name. */
    private String name;

    private String category;

    private String imageUrl;

    private List<String> images;

    /** "manual" | "voice". */
    private String source;

    // ── AI voice-agent enrichment (optional) ────────────────────────────────────
    private String voiceTranscript;

    private Map<String, Object> aiExtractedFields;

    private Double qualityScore;

    private List<String> certifications;
}
