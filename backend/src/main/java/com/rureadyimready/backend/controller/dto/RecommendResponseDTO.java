package com.rureadyimready.backend.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RecommendResponseDTO {
    private List<String> result;
}