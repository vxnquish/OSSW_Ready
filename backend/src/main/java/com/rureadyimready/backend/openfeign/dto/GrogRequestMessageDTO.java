package com.rureadyimready.backend.openfeign.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GrogRequestMessageDTO {
    private String role;
    private String content;
}