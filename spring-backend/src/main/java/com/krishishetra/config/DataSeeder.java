package com.krishishetra.config;

import com.krishishetra.model.Product;
import com.krishishetra.model.SHG;
import com.krishishetra.model.User;
import com.krishishetra.model.VerificationEvent;
import com.krishishetra.repository.ProductRepository;
import com.krishishetra.repository.SHGRepository;
import com.krishishetra.repository.UserRepository;
import com.krishishetra.service.ShgService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Seeds a self-contained SHG demo (one SHG + FPO + farmers + listings across all
 * verification states) so the workflow is demonstrable end-to-end on a fresh DB.
 *
 * Idempotent: it only runs when the demo SHG account is absent, and is guarded by
 * {@code app.seed.shg-demo} — set it to {@code false} to disable seeding entirely.
 * Login as {@code shg@krishishetra.in} / {@code demo123} to review listings, or as
 * {@code ramesh@krishishetra.in} / {@code demo123} to create them via the voice agent.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final String FPO_ID = "fpo-demo-1";
    private static final String FPO_NAME = "Krishi Pragati FPO";
    private static final String SHG_ID = "shg-demo-1";
    private static final String SHG_EMAIL = "shg@krishishetra.in";

    private final SHGRepository shgRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.shg-demo:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled) return;
        if (userRepository.existsByEmail(SHG_EMAIL)) return;   // already seeded

        Instant now = Instant.now();

        // ── SHG (entity + login account) ────────────────────────────────────────
        shgRepository.save(SHG.builder()
                .id(SHG_ID)
                .name("Saksham Mahila SHG")
                .district("Pune").taluka("Haveli").village("Wagholi")
                .contactPerson("Sunita Deshmukh")
                .phone("+91 98220 11234")
                .email(SHG_EMAIL)
                .mappedFPOIds(new ArrayList<>(List.of(FPO_ID)))
                .createdAt(now)
                .build());

        userRepository.save(User.builder()
                .email(SHG_EMAIL)
                .password(passwordEncoder.encode("demo123"))
                .name("Saksham Mahila SHG")
                .role("SHG")
                .phone("+91 98220 11234")
                .district("Pune").taluka("Haveli").village("Wagholi")
                .createdAt(now)
                .build());

        // ── Farmers (login accounts mapped to the FPO + SHG) ────────────────────
        User ramesh = seedFarmer("ramesh@krishishetra.in", "Ramesh Patil", "Wagholi",
                "3.2 acres · Black cotton soil · Rabi + Kharif", "+91 90110 22001", now);
        User savita = seedFarmer("savita@krishishetra.in", "Savita More", "Loni Kalbhor",
                "1.8 acres · Loamy soil · Drip irrigated", "+91 90110 22002", now);
        User ganesh = seedFarmer("ganesh@krishishetra.in", "Ganesh Jadhav", "Theur",
                "5.0 acres · Sandy loam · Canal water", "+91 90110 22003", now);

        // ── Listings across every verification state ────────────────────────────
        productRepository.saveAll(List.of(
                pending(ramesh, "Wheat", "Sharbati Wheat", "Flours", 12, "quintal", 2450, 91.0,
                        "I have twelve quintal of sharbati wheat, good quality, price two thousand four fifty per quintal from Wagholi.",
                        List.of("Organic (PGS-India)"), now),
                pending(savita, "Tomato", "Hybrid Tomato", "Farm Produce", 8, "quintal", 1800, 78.0,
                        "Eight quintal fresh tomato available, expecting eighteen hundred per quintal, Loni market.",
                        List.of(), now),
                pending(ganesh, "Onion", "Red Onion (Nashik)", "Farm Produce", 20, "quintal", 1500, 84.0,
                        "Twenty quintal red onion ready, fifteen hundred rupees per quintal, Theur.",
                        List.of("APMC Graded"), now),
                pending(ramesh, "Turmeric", "Rajapuri Turmeric", "Spices", 4, "quintal", 9200, 95.0,
                        "Four quintal rajapuri turmeric, premium, ninety two hundred per quintal.",
                        List.of("Organic (PGS-India)", "Lab Tested"), now),
                approved(savita, "Soybean", "Yellow Soybean", "Farm Produce", 15, "quintal", 4300, 88.0,
                        List.of("APMC Graded"), now),
                rejected(ganesh, "Cotton", "Long Staple Cotton", "Farm Produce", 6, "quintal", 7000, 52.0,
                        "Image Not Clear", now)
        ));

        System.out.println("✓ Seeded SHG demo (shg@krishishetra.in / demo123, farmers ·/demo123)");
    }

    // ── helpers ─────────────────────────────────────────────────────────────────

    private User seedFarmer(String email, String name, String village,
                            String land, String phone, Instant now) {
        return userRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode("demo123"))
                .name(name)
                .role("Farmer")
                .phone(phone)
                .fpoId(FPO_ID).fpoName(FPO_NAME).mappedSHGId(SHG_ID)
                .district("Pune").taluka("Haveli").village(village)
                .landDetails(land)
                .createdAt(now)
                .build());
    }

    private Product.ProductBuilder base(User farmer, String crop, String name, String category,
                                        int qty, String unit, double price, Double quality, Instant now) {
        Map<String, Object> ai = new java.util.LinkedHashMap<>();
        ai.put("crop", crop);
        ai.put("quantity", qty + " " + unit);
        ai.put("price", String.valueOf((int) price));
        ai.put("village", farmer.getVillage());
        return Product.builder()
                .name(name)
                .price(price)
                .category(category)
                .imageUrl("")
                .rating(0).reviews(0)
                .farmerId(farmer.getId()).farmerName(farmer.getName()).farmerEmail(farmer.getEmail())
                .village(farmer.getVillage())
                .fpoId(FPO_ID).fpoName(FPO_NAME).shgId(SHG_ID)
                .crop(crop)
                .quantity(qty + " " + unit)
                .expectedPrice(String.valueOf((int) price))
                .aiExtractedFields(ai)
                .qualityScore(quality)
                .source("voice")
                .createdAt(now);
    }

    private Product pending(User farmer, String crop, String name, String category, int qty, String unit,
                            double price, Double quality, String transcript, List<String> certs, Instant now) {
        List<VerificationEvent> history = new ArrayList<>();
        history.add(VerificationEvent.builder().action("CREATED")
                .actorEmail(farmer.getEmail()).actorName(farmer.getName()).actorRole("Farmer")
                .at(now).build());
        return base(farmer, crop, name, category, qty, unit, price, quality, now)
                .inStock(false)
                .description("Direct-from-farm listing awaiting SHG verification.")
                .verificationStatus(ShgService.PENDING)
                .voiceTranscript(transcript)
                .certifications(certs)
                .verificationHistory(history)
                .build();
    }

    private Product approved(User farmer, String crop, String name, String category, int qty, String unit,
                             double price, Double quality, List<String> certs, Instant now) {
        Instant when = now.minusSeconds(3600);
        List<VerificationEvent> history = new ArrayList<>();
        history.add(VerificationEvent.builder().action("CREATED")
                .actorEmail(farmer.getEmail()).actorName(farmer.getName()).actorRole("Farmer")
                .at(when.minusSeconds(600)).build());
        history.add(VerificationEvent.builder().action(ShgService.APPROVED)
                .actorEmail(SHG_EMAIL).actorName("Saksham Mahila SHG").actorRole("SHG")
                .remark("Quality acceptable · Packaging verified").at(when).build());
        return base(farmer, crop, name, category, qty, unit, price, quality, now)
                .inStock(true)
                .description("Verified by Saksham Mahila SHG.")
                .verificationStatus(ShgService.APPROVED)
                .certifications(certs)
                .verifiedBy(SHG_EMAIL).verifiedByName("Saksham Mahila SHG").verifiedAt(when)
                .verificationRemark("Quality acceptable · Packaging verified")
                .verificationHistory(history)
                .build();
    }

    private Product rejected(User farmer, String crop, String name, String category, int qty, String unit,
                             double price, Double quality, String reason, Instant now) {
        Instant when = now.minusSeconds(7200);
        List<VerificationEvent> history = new ArrayList<>();
        history.add(VerificationEvent.builder().action("CREATED")
                .actorEmail(farmer.getEmail()).actorName(farmer.getName()).actorRole("Farmer")
                .at(when.minusSeconds(600)).build());
        history.add(VerificationEvent.builder().action(ShgService.REJECTED)
                .actorEmail(SHG_EMAIL).actorName("Saksham Mahila SHG").actorRole("SHG")
                .reason(reason).remark("Please re-upload a clear, well-lit photo of the produce.")
                .at(when).build());
        return base(farmer, crop, name, category, qty, unit, price, quality, now)
                .inStock(false)
                .description("Returned to farmer for corrections.")
                .verificationStatus(ShgService.REJECTED)
                .verifiedBy(SHG_EMAIL).verifiedByName("Saksham Mahila SHG").verifiedAt(when)
                .rejectionReason(reason)
                .verificationRemark("Please re-upload a clear, well-lit photo of the produce.")
                .verificationHistory(history)
                .build();
    }
}
