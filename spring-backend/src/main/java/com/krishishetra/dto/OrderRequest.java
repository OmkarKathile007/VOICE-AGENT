package com.krishishetra.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank
    private String productId;

    @NotBlank
    private String productName;

    private String cropName;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    private Double pricePerUnit;

    @NotBlank
    private String deliveryAddress;

    @NotBlank
    private String phone;

    private String paymentMethod = "cod";

    private String notes;
}
