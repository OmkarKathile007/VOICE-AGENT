package com.krishishetra.repository;

import com.krishishetra.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
    List<Order> findByBuyerEmailOrderByCreatedAtDesc(String email);
}
