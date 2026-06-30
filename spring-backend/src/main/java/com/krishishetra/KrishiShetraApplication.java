package com.krishishetra;

import com.krishishetra.model.Product;
import com.krishishetra.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.Instant;
import java.util.List;

@SpringBootApplication
public class KrishiShetraApplication {

    public static void main(String[] args) {
        SpringApplication.run(KrishiShetraApplication.class, args);
    }

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                productRepository.saveAll(List.of(
                    Product.builder().name("Organic Foxtail Millet (Kangni)").price(150).originalPrice(180.0)
                        .category("Millets").origin("Rajasthan").badge("15% OFF").rating(4.8).reviews(124)
                        .imageUrl("/foxtail1.jpg").inStock(true)
                        .description("Premium organic foxtail millet — unpolished, naturally dried, sourced directly from verified FPOs. Nutritious, gluten-free.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Pearl Millet (Bajra) - Premium Quality").price(120).category("Millets")
                        .origin("Gujarat").badge("Bestseller").rating(4.9).reviews(312)
                        .imageUrl("/pearlmillet.jpg").inStock(true)
                        .description("High-protein pearl millet, ideal for rotis, porridge, and malt drinks. Cold-season crop grown without pesticides.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Sorghum (Jowar) Flour - Stone Ground").price(90).originalPrice(110.0)
                        .category("Flours").origin("Maharashtra").rating(4.6).reviews(89)
                        .imageUrl("/jowar.jpg").inStock(true)
                        .description("Stone-ground sorghum flour — high fibre, gluten-free, perfect for bhakri, dosa, and baking.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Cold-Pressed Coconut Oil - 1 Litre").price(350).category("Oils")
                        .origin("Kerala").badge("New").rating(4.7).reviews(45)
                        .imageUrl("/coconutoil.jpg").inStock(true)
                        .description("Wood-pressed virgin coconut oil. No heat treatment, retains natural aroma and nutrients.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Natural Forest Honey - Raw & Unprocessed").price(450).category("Honey")
                        .origin("Uttarakhand").rating(4.9).reviews(210)
                        .imageUrl("/honey.jpg").inStock(true)
                        .description("Wild-harvested raw honey from Himalayan forests. Unheated, unfiltered, with natural enzymes intact.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Organic Ragi (Finger Millet) - Unpolished").price(130).category("Millets")
                        .origin("Karnataka").badge("Organic").rating(4.8).reviews(178)
                        .imageUrl("/ragi.jpg").inStock(true)
                        .description("Calcium-rich finger millet. Ideal for mudde, porridge, and weaning foods. Certified organic farm.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Kodo Millet - Diabetic Friendly").price(160).originalPrice(200.0)
                        .category("Millets").origin("Madhya Pradesh").badge("20% OFF").rating(4.5).reviews(67)
                        .imageUrl("/kodo.jpg").inStock(true)
                        .description("Low glycaemic index kodo millet. Ideal for diabetics. Ancient grain revived by tribal farmers of MP.")
                        .createdAt(Instant.now()).build(),
                    Product.builder().name("Groundnut Oil (Cold-Pressed) - 1 Litre").price(400).category("Oils")
                        .origin("Andhra Pradesh").rating(4.8).reviews(156)
                        .imageUrl("/groundnut.jpg").inStock(true)
                        .description("Chekku-extracted groundnut oil. Rich in monounsaturated fats, traditional taste with high smoke point.")
                        .createdAt(Instant.now()).build()
                ));
                System.out.println("✓ Seeded 8 marketplace products");
            }
        };
    }
}
