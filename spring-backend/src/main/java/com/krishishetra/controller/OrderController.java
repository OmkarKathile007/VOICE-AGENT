package com.krishishetra.controller;

import com.krishishetra.dto.OrderRequest;
import com.krishishetra.model.Order;
import com.krishishetra.model.User;
import com.krishishetra.repository.OrderRepository;
import com.krishishetra.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(
            @Valid @RequestBody OrderRequest req,
            @AuthenticationPrincipal UserDetails principal) {

        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .buyerId(user.getId())
                .buyerEmail(user.getEmail())
                .buyerName(user.getName())
                .productId(req.getProductId())
                .productName(req.getProductName())
                .cropName(req.getCropName())
                .quantity(req.getQuantity())
                .pricePerUnit(req.getPricePerUnit())
                .totalAmount(req.getPricePerUnit() * req.getQuantity())
                .deliveryAddress(req.getDeliveryAddress())
                .phone(req.getPhone())
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "cod")
                .notes(req.getNotes())
                .status("pending")
                .createdAt(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(orderRepository.save(order));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> myOrders(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(
                orderRepository.findByBuyerEmailOrderByCreatedAtDesc(principal.getUsername())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails principal) {

        return orderRepository.findById(id)
                .filter(o -> o.getBuyerEmail().equals(principal.getUsername()))
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Order not found")));
    }
}
