package com.krishishetra.dto;

import com.krishishetra.model.Product;
import com.krishishetra.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Full farmer profile plus their listings bucketed by verification status. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerDetailResponse {
    private FarmerProfile farmer;
    private List<Product> currentListings;   // pending
    private List<Product> approvedListings;
    private List<Product> rejectedListings;
    private long totalListings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FarmerProfile {
        private String id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String village;
        private String district;
        private String taluka;
        private String fpoId;
        private String fpoName;
        private String landDetails;
        private String address;

        public static FarmerProfile from(User u) {
            return FarmerProfile.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .phone(u.getPhone())
                    .role(u.getRole())
                    .village(u.getVillage())
                    .district(u.getDistrict())
                    .taluka(u.getTaluka())
                    .fpoId(u.getFpoId())
                    .fpoName(u.getFpoName())
                    .landDetails(u.getLandDetails())
                    .address(u.getAddress())
                    .build();
        }
    }
}
