package com.krishishetra.controller;

import com.krishishetra.dto.OrderRequest;
import com.krishishetra.model.Order;
import com.krishishetra.model.User;
import com.krishishetra.repository.OrderRepository;
import com.krishishetra.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link OrderController} business logic (total computation,
 * defaulting, ownership checks) with mocked repositories.
 */
@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderController orderController;

    private UserDetails principalFor(String email) {
        UserDetails principal = mock(UserDetails.class);
        when(principal.getUsername()).thenReturn(email);
        return principal;
    }

    private OrderRequest sampleRequest() {
        OrderRequest req = new OrderRequest();
        req.setProductId("p1");
        req.setProductName("Pearl Millet");
        req.setQuantity(3);
        req.setPricePerUnit(120.0);
        req.setDeliveryAddress("Village A");
        req.setPhone("9999999999");
        return req;
    }

    @Test
    void placeOrderComputesTotalAndDefaultsStatusAndBuyerFromPrincipal() {
        User buyer = User.builder().id("u1").email("buyer@krishi.in").name("Buyer One").build();
        when(userRepository.findByEmail("buyer@krishi.in")).thenReturn(Optional.of(buyer));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        ResponseEntity<?> response =
                orderController.placeOrder(sampleRequest(), principalFor("buyer@krishi.in"));

        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        org.mockito.Mockito.verify(orderRepository).save(captor.capture());
        Order saved = captor.getValue();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(saved.getTotalAmount()).isEqualTo(360.0); // 120 * 3
        assertThat(saved.getStatus()).isEqualTo("pending");
        assertThat(saved.getPaymentMethod()).isEqualTo("cod"); // defaulted
        assertThat(saved.getBuyerId()).isEqualTo("u1");
        assertThat(saved.getBuyerEmail()).isEqualTo("buyer@krishi.in");
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void getOrderReturnsOrderWhenRequesterIsOwner() {
        Order order = Order.builder().id("o1").buyerEmail("buyer@krishi.in").build();
        when(orderRepository.findById("o1")).thenReturn(Optional.of(order));

        ResponseEntity<?> response =
                orderController.getOrder("o1", principalFor("buyer@krishi.in"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(order);
    }

    @Test
    void getOrderReturns404WhenRequesterIsNotOwner() {
        Order order = Order.builder().id("o1").buyerEmail("someone-else@krishi.in").build();
        when(orderRepository.findById("o1")).thenReturn(Optional.of(order));

        ResponseEntity<?> response =
                orderController.getOrder("o1", principalFor("buyer@krishi.in"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getOrderReturns404WhenOrderMissing() {
        when(orderRepository.findById("missing")).thenReturn(Optional.empty());

        // Order is absent, so the ownership filter (and thus principal) is never consulted.
        ResponseEntity<?> response =
                orderController.getOrder("missing", mock(UserDetails.class));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
