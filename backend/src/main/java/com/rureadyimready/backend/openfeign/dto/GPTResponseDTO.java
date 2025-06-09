package com.rureadyimready.backend.openfeign.dto;

import lombok.Data;

public class GPTResponseDTO {
    private ChoicesDTO[] choices;
    @Data
    static class ChoicesDTO {
        private String message;
    }
    public String getContent() {
        return choices[0].getMessage();
    }
}
