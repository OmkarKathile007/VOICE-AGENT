package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;

    private double price;

    private Double originalPrice;

    private String imageUrl;

    private String category;

    private String origin;

    private String badge;

    private double rating;

    private int reviews;

    private String description;

    private boolean inStock;

    private Instant createdAt;
}
