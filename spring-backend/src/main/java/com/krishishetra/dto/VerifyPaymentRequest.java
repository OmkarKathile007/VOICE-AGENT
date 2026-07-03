package com.krishishetra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * The three fields Razorpay Checkout hands back to the browser after a
 * successful payment. The backend re-computes the HMAC signature from
 * {@code razorpayOrderId|razorpayPaymentId} using the secret key and compares
 * it to {@code razorpaySignature} — this is what proves the payment is genuine.
 */
@Data
public class VerifyPaymentRequest {

    @NotBlank
    private String razorpayOrderId;

    @NotBlank
    private String razorpayPaymentId;

    @NotBlank
    private String razorpaySignature;
}
