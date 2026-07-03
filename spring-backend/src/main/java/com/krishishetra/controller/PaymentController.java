package com.krishishetra.controller;

import com.krishishetra.dto.CreatePaymentOrderRequest;
import com.krishishetra.dto.VerifyPaymentRequest;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.validation.Valid;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Razorpay payment endpoints. Both require an authenticated buyer (JWT).
 *
 *  1. POST /api/payments/razorpay/order  → create a Razorpay order for the cart total
 *  2. POST /api/payments/razorpay/verify → verify the payment signature after checkout
 *
 * The secret key never leaves the server. The browser only receives the public
 * key id and the Razorpay order id.
 */
@RestController
@RequestMapping("/api/payments/razorpay")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    /** Create a Razorpay order and return the details the browser needs to open Checkout. */
    @PostMapping("/order")
    public ResponseEntity<?> createOrder(
            @Valid @RequestBody CreatePaymentOrderRequest req,
            @AuthenticationPrincipal UserDetails principal) {

        // Razorpay works in the smallest currency unit (paise for INR).
        long amountPaise = Math.round(req.getAmount() * 100);

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "rcpt_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", true); // auto-capture on success

            com.razorpay.Order rzpOrder = client.orders.create(orderRequest);

            return ResponseEntity.ok(Map.of(
                    "orderId", rzpOrder.get("id"),
                    "amount", amountPaise,
                    "currency", currency,
                    "keyId", keyId
            ));
        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for {}", principal.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Could not initiate payment. Please try again."));
        }
    }

    /** Verify the signature Razorpay returns to the browser after a successful payment. */
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody VerifyPaymentRequest req) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", req.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", req.getRazorpayPaymentId());
            attributes.put("razorpay_signature", req.getRazorpaySignature());

            boolean valid = Utils.verifyPaymentSignature(attributes, keySecret);
            if (valid) {
                return ResponseEntity.ok(Map.of("verified", true));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("verified", false, "error", "Payment signature verification failed"));
        } catch (RazorpayException e) {
            log.error("Razorpay signature verification error", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("verified", false, "error", "Payment signature verification failed"));
        }
    }
}
