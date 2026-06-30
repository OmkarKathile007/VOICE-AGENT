package com.krishishetra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Indexed
    private String buyerId;

    private String buyerEmail;

    private String buyerName;

    private String productId;

    private String productName;

    private String cropName;

    private int quantity;

    private double pricePerUnit;

    private double totalAmount;

    private String deliveryAddress;

    private String phone;

    private String paymentMethod;  // "cod" | "upi"

    private String status;  // "pending" | "confirmed" | "shipped" | "delivered"

    private String notes;

    private Instant createdAt;
}
