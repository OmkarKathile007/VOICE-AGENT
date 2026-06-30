package com.krishishetra.repository;

import com.krishishetra.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByInStockTrue();

    // ── Marketplace gating ──────────────────────────────────────────────────────
    List<Product> findByVerificationStatus(String verificationStatus);

    // ── SHG verification queues (scoped to the SHG that owns the listing) ────────
    List<Product> findByShgIdOrderByCreatedAtDesc(String shgId);
    List<Product> findByShgIdAndVerificationStatusOrderByCreatedAtDesc(String shgId, String verificationStatus);
    long countByShgIdAndVerificationStatus(String shgId, String verificationStatus);
    long countByShgId(String shgId);

    // ── Farmer's own listings (status tracking) ─────────────────────────────────
    List<Product> findByFarmerEmailOrderByCreatedAtDesc(String farmerEmail);
    List<Product> findByFarmerIdOrderByCreatedAtDesc(String farmerId);
}
