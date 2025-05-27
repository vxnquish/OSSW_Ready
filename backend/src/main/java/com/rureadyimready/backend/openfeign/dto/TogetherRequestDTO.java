package com.rureadyimready.backend.openfeign.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TogetherRequestDTO {
    private String model;
    private List<TogetherRequestMessageDTO> messages;
}