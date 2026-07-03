package com.krishishetra.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * Request to create a Razorpay order. {@code amount} is the grand total in rupees
 * (e.g. delivery included); the backend converts it to paise for Razorpay.
 */
@Data
public class CreatePaymentOrderRequest {

    @NotNull
    @Positive
    private Double amount;
}
