package com.krishishetra.dto;

import lombok.Data;

/** SHG approval payload — remark is optional. */
@Data
public class ApproveRequest {
    private String remark;
}
