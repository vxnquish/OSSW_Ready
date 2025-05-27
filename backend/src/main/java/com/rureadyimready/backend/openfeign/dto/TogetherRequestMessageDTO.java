package com.rureadyimready.backend.openfeign.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TogetherRequestMessageDTO {
    private String role;
    private String content;
}