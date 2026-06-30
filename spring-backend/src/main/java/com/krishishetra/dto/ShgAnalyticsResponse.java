package com.krishishetra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Aggregated analytics for the SHG charts. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShgAnalyticsResponse {

    private long totalPending;
    private long totalApproved;
    private long totalRejected;

    /** Daily verification trend over the last N days. */
    private List<TrendPoint> verificationTrends;

    private List<CountItem> mostActiveFarmers;
    private List<CountItem> mostActiveFPOs;
    private List<CountItem> topVillages;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendPoint {
        private String date;      // yyyy-MM-dd
        private long approved;
        private long rejected;
        private long pending;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountItem {
        private String label;
        private long count;
    }
}
