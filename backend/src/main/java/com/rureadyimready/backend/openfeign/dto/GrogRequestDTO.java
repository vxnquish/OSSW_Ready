package com.rureadyimready.backend.openfeign.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GrogRequestDTO {
    private String model;
    private boolean stream;
    private List<GrogRequestMessageDTO> messages;
}