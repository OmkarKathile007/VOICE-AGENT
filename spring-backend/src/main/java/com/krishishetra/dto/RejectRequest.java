package com.krishishetra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * SHG rejection payload. A structured {@code reason} is mandatory; {@code remark}
 * is optional additional detail shown to the farmer.
 */
@Data
public class RejectRequest {

    /**
     * One of: Poor Product Quality | Incorrect Quantity | Duplicate Listing |
     * Image Not Clear | Invalid Information | Other.
     */
    @NotBlank
    private String reason;

    private String remark;
}
