package com.krishishetra.controller;

import com.krishishetra.dto.FarmerListingRequest;
import com.krishishetra.model.Product;
import com.krishishetra.model.User;
import com.krishishetra.model.VerificationEvent;
import com.krishishetra.repository.ProductRepository;
import com.krishishetra.repository.UserRepository;
import com.krishishetra.service.ShgService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShgService shgService;

    /** A product is shown in the marketplace only once an SHG has approved it.
     *  Legacy/admin products with no verification status are treated as approved. */
    private static boolean isVisibleInMarket(Product p) {
        return p.getVerificationStatus() == null
                || ShgService.APPROVED.equals(p.getVerificationStatus());
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All Products")) {
            products = productRepository.findByCategory(category);
        } else {
            products = productRepository.findAll();
        }
        // Marketplace must ONLY ever show APPROVED produce — never pending/rejected.
        products = products.stream().filter(ProductController::isVisibleInMarket).toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return productRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found")));
    }

    /** Admin/seed product creation — these are published directly to the market. */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        product.setCreatedAt(Instant.now());
        product.setInStock(true);
        if (product.getVerificationStatus() == null) {
            product.setVerificationStatus(ShgService.APPROVED);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    /**
     * Farmer listing creation (AI voice agent or manual form). The produce is saved
     * as PENDING_SHG_VERIFICATION, routed to the farmer's mapped SHG, and kept OUT
     * of the marketplace until an SHG approves it.
     */
    @PostMapping("/farmer-listing")
    public ResponseEntity<Product> createFarmerListing(
            @Valid @RequestBody FarmerListingRequest req,
            @AuthenticationPrincipal UserDetails principal) {

        User farmer = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String shgId = shgService.routeListingToShg(farmer);

        List<VerificationEvent> history = new ArrayList<>();
        history.add(VerificationEvent.builder()
                .action("CREATED")
                .actorEmail(farmer.getEmail())
                .actorName(farmer.getName())
                .actorRole(farmer.getRole())
                .at(Instant.now())
                .build());

        Product product = Product.builder()
                .name(req.getName() != null && !req.getName().isBlank() ? req.getName() : capitalize(req.getCrop()))
                .price(parsePrice(req.getPrice()))
                .category(req.getCategory() != null && !req.getCategory().isBlank() ? req.getCategory() : "Farm Produce")
                .imageUrl(req.getImageUrl())
                .images(req.getImages())
                .origin(req.getLocation())
                .rating(0)
                .reviews(0)
                .inStock(false)
                .description("Direct-from-farm listing awaiting SHG verification.")
                // verification
                .verificationStatus(ShgService.PENDING)
                .verificationHistory(history)
                // farmer context
                .farmerId(farmer.getId())
                .farmerName(farmer.getName())
                .farmerEmail(farmer.getEmail())
                .village(req.getLocation() != null ? req.getLocation() : farmer.getVillage())
                .fpoId(farmer.getFpoId())
                .fpoName(farmer.getFpoName())
                .shgId(shgId)
                .crop(req.getCrop())
                .quantity(req.getQuantity())
                .expectedPrice(req.getPrice())
                .voiceTranscript(req.getVoiceTranscript())
                .aiExtractedFields(req.getAiExtractedFields())
                .qualityScore(req.getQualityScore())
                .certifications(req.getCertifications())
                .source(req.getSource() != null ? req.getSource() : "manual")
                .createdAt(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    /** A farmer's own listings, newest first — with verification status & history. */
    @GetMapping("/my-listings")
    public ResponseEntity<List<Product>> myListings(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(
                productRepository.findByFarmerEmailOrderByCreatedAtDesc(principal.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product update) {
        return productRepository.findById(id).map(existing -> {
            update.setId(id);
            update.setCreatedAt(existing.getCreatedAt());
            return ResponseEntity.ok(productRepository.save(update));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── helpers ─────────────────────────────────────────────────────────────────

    private static double parsePrice(String raw) {
        if (raw == null) return 0;
        String digits = raw.replaceAll("[^0-9.]", "");
        if (digits.isBlank()) return 0;
        try {
            return Double.parseDouble(digits);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private static String capitalize(String s) {
        if (s == null || s.isBlank()) return "Farm Produce";
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}
