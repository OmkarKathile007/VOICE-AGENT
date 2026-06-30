package com.krishishetra.controller;

import com.krishishetra.AbstractIntegrationTest;
import com.krishishetra.dto.OrderRequest;
import com.krishishetra.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end tests for placing and retrieving orders, including authentication
 * and ownership enforcement.
 */
class OrderControllerIT extends AbstractIntegrationTest {

    @Autowired
    private OrderRepository orderRepository;

    private OrderRequest sampleOrder() {
        OrderRequest req = new OrderRequest();
        req.setProductId("p1");
        req.setProductName("Pearl Millet");
        req.setCropName("Bajra");
        req.setQuantity(4);
        req.setPricePerUnit(120.0);
        req.setDeliveryAddress("123 Village Road");
        req.setPhone("9876543210");
        return req;
    }

    @Test
    void placingOrderRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleOrder())))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isIn(401, 403));
    }

    @Test
    void placeOrderComputesTotalAndPersists() throws Exception {
        String token = registerAndGetToken("buyer@krishi.in", "secret123", "Consumer");

        mockMvc.perform(post("/api/orders")
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleOrder())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAmount", is(480.0))) // 120 * 4
                .andExpect(jsonPath("$.status", is("pending")))
                .andExpect(jsonPath("$.buyerEmail", is("buyer@krishi.in")));

        assertThat(orderRepository.findByBuyerEmailOrderByCreatedAtDesc("buyer@krishi.in")).hasSize(1);
    }

    @Test
    void placeOrderWithMissingFieldReturns400() throws Exception {
        String token = registerAndGetToken("buyer2@krishi.in", "secret123", "Consumer");

        OrderRequest invalid = sampleOrder();
        invalid.setProductId(null); // @NotBlank

        mockMvc.perform(post("/api/orders")
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void myOrdersReturnsOnlyCallersOrders() throws Exception {
        String token = registerAndGetToken("buyer3@krishi.in", "secret123", "Consumer");
        mockMvc.perform(post("/api/orders")
                .header("Authorization", bearer(token))
                .contentType(APPLICATION_JSON)
                .content(toJson(sampleOrder())));

        mockMvc.perform(get("/api/orders/my").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].buyerEmail", is("buyer3@krishi.in")));
    }

    @Test
    void getOrderByIdReturnsOrderForOwner() throws Exception {
        String token = registerAndGetToken("owner@krishi.in", "secret123", "Consumer");
        MvcResult created = mockMvc.perform(post("/api/orders")
                        .header("Authorization", bearer(token))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleOrder())))
                .andReturn();
        String orderId = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(get("/api/orders/" + orderId).header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(orderId)));
    }

    @Test
    void getOrderByIdReturns404ForNonOwner() throws Exception {
        String ownerToken = registerAndGetToken("owner2@krishi.in", "secret123", "Consumer");
        MvcResult created = mockMvc.perform(post("/api/orders")
                        .header("Authorization", bearer(ownerToken))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(sampleOrder())))
                .andReturn();
        String orderId = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        String otherToken = registerAndGetToken("intruder@krishi.in", "secret123", "Consumer");
        mockMvc.perform(get("/api/orders/" + orderId).header("Authorization", bearer(otherToken)))
                .andExpect(status().isNotFound());
    }
}
