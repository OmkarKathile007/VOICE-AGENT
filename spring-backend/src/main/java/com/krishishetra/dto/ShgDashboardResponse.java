package com.krishishetra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Metrics for the SHG dashboard cards. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShgDashboardResponse {
    private String shgName;
    private long pendingVerification;
    private long approvedToday;
    private long rejectedToday;
    private long totalFarmers;
    private long mappedFPOs;
    /** approved / (approved + rejected) as a percentage, 0–100. */
    private double verificationAccuracy;

    // Supporting totals used across the dashboard.
    private long totalApproved;
    private long totalRejected;
    private long totalListings;
}
