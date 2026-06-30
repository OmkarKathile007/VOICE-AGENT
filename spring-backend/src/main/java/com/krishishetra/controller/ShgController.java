package com.krishishetra.controller;

import com.krishishetra.dto.ApproveRequest;
import com.krishishetra.dto.FarmerDetailResponse;
import com.krishishetra.dto.RejectRequest;
import com.krishishetra.dto.ShgAnalyticsResponse;
import com.krishishetra.dto.ShgDashboardResponse;
import com.krishishetra.model.Product;
import com.krishishetra.model.SHG;
import com.krishishetra.model.User;
import com.krishishetra.repository.UserRepository;
import com.krishishetra.service.ShgService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * SHG verification API. Every endpoint is restricted to {@code ROLE_SHG} and is
 * scoped through {@link ShgService} so an SHG can only ever see and act on the
 * farmers and listings mapped to it.
 */
@RestController
@RequestMapping("/api/shg")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SHG')")
public class ShgController {

    private static final Set<String> VALID_REJECT_REASONS = Set.of(
            "Poor Product Quality", "Incorrect Quantity", "Duplicate Listing",
            "Image Not Clear", "Invalid Information", "Other");

    private final ShgService shgService;
    private final UserRepository userRepository;

    private SHG currentShg(UserDetails principal) {
        return shgService.requireShg(principal.getUsername());
    }

    private User currentUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<SHG> profile(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(currentShg(principal));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ShgDashboardResponse> dashboard(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.dashboard(currentShg(principal)));
    }

    @GetMapping("/farmers")
    public ResponseEntity<List<User>> farmers(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.farmers(currentShg(principal)));
    }

    @GetMapping("/pending-products")
    public ResponseEntity<List<Product>> pending(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.pendingProducts(currentShg(principal)));
    }

    @GetMapping("/approved-products")
    public ResponseEntity<List<Product>> approved(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.approvedProducts(currentShg(principal)));
    }

    @GetMapping("/rejected-products")
    public ResponseEntity<List<Product>> rejected(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.rejectedProducts(currentShg(principal)));
    }

    @GetMapping("/farmer/{id}")
    public ResponseEntity<FarmerDetailResponse> farmer(
            @PathVariable String id, @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.farmerDetail(currentShg(principal), id));
    }

    @PostMapping("/product/{id}/approve")
    public ResponseEntity<Product> approveProduct(
            @PathVariable String id,
            @RequestBody(required = false) ApproveRequest body,
            @AuthenticationPrincipal UserDetails principal) {
        String remark = body != null ? body.getRemark() : null;
        Product saved = shgService.approve(currentShg(principal), id, remark, currentUser(principal));
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/product/{id}/reject")
    public ResponseEntity<Product> rejectProduct(
            @PathVariable String id,
            @Valid @RequestBody RejectRequest body,
            @AuthenticationPrincipal UserDetails principal) {
        String reason = VALID_REJECT_REASONS.contains(body.getReason()) ? body.getReason() : "Other";
        Product saved = shgService.reject(currentShg(principal), id, reason, body.getRemark(), currentUser(principal));
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/analytics")
    public ResponseEntity<ShgAnalyticsResponse> analytics(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(shgService.analytics(currentShg(principal)));
    }
}
