package com.krishishetra.service;

import com.krishishetra.dto.FarmerDetailResponse;
import com.krishishetra.dto.ShgAnalyticsResponse;
import com.krishishetra.dto.ShgDashboardResponse;
import com.krishishetra.model.Product;
import com.krishishetra.model.SHG;
import com.krishishetra.model.User;
import com.krishishetra.model.VerificationEvent;
import com.krishishetra.repository.ProductRepository;
import com.krishishetra.repository.SHGRepository;
import com.krishishetra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Core SHG verification logic: scoping (an SHG only ever sees its own farmers and
 * listings), the approve/reject state machine, and dashboard/analytics aggregation.
 */
@Service
@RequiredArgsConstructor
public class ShgService {

    public static final String PENDING = "PENDING_SHG_VERIFICATION";
    public static final String APPROVED = "APPROVED";
    public static final String REJECTED = "REJECTED";

    private static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");

    private final SHGRepository shgRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ── Identity / scoping ──────────────────────────────────────────────────────

    /**
     * Load the SHG entity backing the authenticated SHG user. If the user has the
     * SHG role but no SHG profile yet (e.g. just registered), one is auto-provisioned
     * from their account so the dashboard works immediately.
     */
    public SHG requireShg(String email) {
        return shgRepository.findByEmail(email).orElseGet(() -> {
            User u = userRepository.findByEmail(email)
                    .filter(usr -> "SHG".equalsIgnoreCase(usr.getRole()))
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.FORBIDDEN, "No SHG profile is linked to this account."));
            SHG shg = SHG.builder()
                    .name(u.getName() != null ? u.getName() : "Self-Help Group")
                    .email(u.getEmail())
                    .phone(u.getPhone())
                    .contactPerson(u.getName())
                    .district(u.getDistrict())
                    .taluka(u.getTaluka())
                    .village(u.getVillage())
                    .mappedFPOIds(u.getFpoId() != null && !u.getFpoId().isBlank()
                            ? new ArrayList<>(List.of(u.getFpoId())) : new ArrayList<>())
                    .createdAt(Instant.now())
                    .build();
            return shgRepository.save(shg);
        });
    }

    /** Resolve which SHG a farmer's listings should be routed to (by FPO mapping). */
    public String routeListingToShg(User farmer) {
        if (farmer.getMappedSHGId() != null && !farmer.getMappedSHGId().isBlank()) {
            return farmer.getMappedSHGId();
        }
        if (farmer.getFpoId() != null && !farmer.getFpoId().isBlank()) {
            return shgRepository.findAll().stream()
                    .filter(s -> s.getMappedFPOIds() != null && s.getMappedFPOIds().contains(farmer.getFpoId()))
                    .map(SHG::getId)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    private void assertOwnsProduct(SHG shg, Product product) {
        if (!Objects.equals(product.getShgId(), shg.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This listing belongs to another SHG.");
        }
    }

    private void assertOwnsFarmer(SHG shg, User farmer) {
        boolean byShg = Objects.equals(farmer.getMappedSHGId(), shg.getId());
        boolean byFpo = farmer.getFpoId() != null
                && shg.getMappedFPOIds() != null
                && shg.getMappedFPOIds().contains(farmer.getFpoId());
        if (!byShg && !byFpo) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This farmer is not mapped to your SHG.");
        }
    }

    // ── Listing queues ──────────────────────────────────────────────────────────

    public List<Product> pendingProducts(SHG shg) {
        return productRepository.findByShgIdAndVerificationStatusOrderByCreatedAtDesc(shg.getId(), PENDING);
    }

    public List<Product> approvedProducts(SHG shg) {
        return productRepository.findByShgIdAndVerificationStatusOrderByCreatedAtDesc(shg.getId(), APPROVED);
    }

    public List<Product> rejectedProducts(SHG shg) {
        return productRepository.findByShgIdAndVerificationStatusOrderByCreatedAtDesc(shg.getId(), REJECTED);
    }

    // ── Farmers ─────────────────────────────────────────────────────────────────

    public List<User> farmers(SHG shg) {
        Map<String, User> byId = new LinkedHashMap<>();
        userRepository.findByMappedSHGId(shg.getId()).forEach(u -> byId.put(u.getId(), u));
        if (shg.getMappedFPOIds() != null && !shg.getMappedFPOIds().isEmpty()) {
            userRepository.findByFpoIdIn(shg.getMappedFPOIds())
                    .forEach(u -> byId.putIfAbsent(u.getId(), u));
        }
        return new ArrayList<>(byId.values());
    }

    public FarmerDetailResponse farmerDetail(SHG shg, String farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Farmer not found."));
        assertOwnsFarmer(shg, farmer);

        List<Product> all = productRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
        List<Product> pending = all.stream().filter(p -> PENDING.equals(p.getVerificationStatus())).toList();
        List<Product> approved = all.stream().filter(p -> APPROVED.equals(p.getVerificationStatus())).toList();
        List<Product> rejected = all.stream().filter(p -> REJECTED.equals(p.getVerificationStatus())).toList();

        return FarmerDetailResponse.builder()
                .farmer(FarmerDetailResponse.FarmerProfile.from(farmer))
                .currentListings(pending)
                .approvedListings(approved)
                .rejectedListings(rejected)
                .totalListings(all.size())
                .build();
    }

    // ── Approve / Reject state machine ──────────────────────────────────────────

    public Product approve(SHG shg, String productId, String remark, User actor) {
        Product p = loadOwnedPending(shg, productId);

        p.setVerificationStatus(APPROVED);
        p.setVerifiedBy(actor.getEmail());
        p.setVerifiedByName(actor.getName());
        p.setVerifiedAt(Instant.now());
        p.setVerificationRemark(remark);
        p.setRejectionReason(null);
        p.setInStock(true);                       // publish to marketplace
        appendHistory(p, APPROVED, actor, remark, null);
        return productRepository.save(p);
    }

    public Product reject(SHG shg, String productId, String reason, String remark, User actor) {
        Product p = loadOwnedPending(shg, productId);

        p.setVerificationStatus(REJECTED);
        p.setVerifiedBy(actor.getEmail());
        p.setVerifiedByName(actor.getName());
        p.setVerifiedAt(Instant.now());
        p.setRejectionReason(reason);
        p.setVerificationRemark(remark);
        p.setInStock(false);
        appendHistory(p, REJECTED, actor, remark, reason);
        return productRepository.save(p);
    }

    private Product loadOwnedPending(SHG shg, String productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found."));
        assertOwnsProduct(shg, p);
        if (!PENDING.equals(p.getVerificationStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This listing has already been " +
                            (APPROVED.equals(p.getVerificationStatus()) ? "approved." : "rejected."));
        }
        return p;
    }

    private void appendHistory(Product p, String action, User actor, String remark, String reason) {
        if (p.getVerificationHistory() == null) {
            p.setVerificationHistory(new ArrayList<>());
        }
        p.getVerificationHistory().add(VerificationEvent.builder()
                .action(action)
                .actorEmail(actor.getEmail())
                .actorName(actor.getName())
                .actorRole(actor.getRole())
                .remark(remark)
                .reason(reason)
                .at(Instant.now())
                .build());
    }

    // ── Dashboard ───────────────────────────────────────────────────────────────

    public ShgDashboardResponse dashboard(SHG shg) {
        long pending = productRepository.countByShgIdAndVerificationStatus(shg.getId(), PENDING);
        long totalApproved = productRepository.countByShgIdAndVerificationStatus(shg.getId(), APPROVED);
        long totalRejected = productRepository.countByShgIdAndVerificationStatus(shg.getId(), REJECTED);
        long total = productRepository.countByShgId(shg.getId());

        List<Product> approved = approvedProducts(shg);
        List<Product> rejected = rejectedProducts(shg);
        LocalDate today = LocalDate.now(ZONE);
        long approvedToday = approved.stream().filter(p -> isOn(today, p.getVerifiedAt())).count();
        long rejectedToday = rejected.stream().filter(p -> isOn(today, p.getVerifiedAt())).count();

        long decided = totalApproved + totalRejected;
        double accuracy = decided == 0 ? 0.0 : Math.round((totalApproved * 1000.0) / decided) / 10.0;

        return ShgDashboardResponse.builder()
                .shgName(shg.getName())
                .pendingVerification(pending)
                .approvedToday(approvedToday)
                .rejectedToday(rejectedToday)
                .totalFarmers(farmers(shg).size())
                .mappedFPOs(shg.getMappedFPOIds() == null ? 0 : shg.getMappedFPOIds().size())
                .verificationAccuracy(accuracy)
                .totalApproved(totalApproved)
                .totalRejected(totalRejected)
                .totalListings(total)
                .build();
    }

    // ── Analytics ───────────────────────────────────────────────────────────────

    public ShgAnalyticsResponse analytics(SHG shg) {
        List<Product> all = productRepository.findByShgIdOrderByCreatedAtDesc(shg.getId());

        long pending = all.stream().filter(p -> PENDING.equals(p.getVerificationStatus())).count();
        long approved = all.stream().filter(p -> APPROVED.equals(p.getVerificationStatus())).count();
        long rejected = all.stream().filter(p -> REJECTED.equals(p.getVerificationStatus())).count();

        // 7-day trend
        List<ShgAnalyticsResponse.TrendPoint> trends = new ArrayList<>();
        LocalDate today = LocalDate.now(ZONE);
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            long a = all.stream().filter(p -> APPROVED.equals(p.getVerificationStatus()) && isOn(day, p.getVerifiedAt())).count();
            long r = all.stream().filter(p -> REJECTED.equals(p.getVerificationStatus()) && isOn(day, p.getVerifiedAt())).count();
            long pd = all.stream().filter(p -> isOn(day, p.getCreatedAt())).count();
            trends.add(ShgAnalyticsResponse.TrendPoint.builder()
                    .date(day.toString()).approved(a).rejected(r).pending(pd).build());
        }

        return ShgAnalyticsResponse.builder()
                .totalPending(pending)
                .totalApproved(approved)
                .totalRejected(rejected)
                .verificationTrends(trends)
                .mostActiveFarmers(topCounts(all, Product::getFarmerName))
                .mostActiveFPOs(topCounts(all, Product::getFpoName))
                .topVillages(topCounts(all, Product::getVillage))
                .build();
    }

    private List<ShgAnalyticsResponse.CountItem> topCounts(
            List<Product> products, java.util.function.Function<Product, String> key) {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Product p : products) {
            String k = key.apply(p);
            if (k == null || k.isBlank()) continue;
            counts.merge(k, 1L, Long::sum);
        }
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> ShgAnalyticsResponse.CountItem.builder().label(e.getKey()).count(e.getValue()).build())
                .toList();
    }

    private boolean isOn(LocalDate day, Instant instant) {
        return instant != null && instant.atZone(ZONE).toLocalDate().equals(day);
    }
}
