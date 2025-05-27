package com.rureadyimready.backend.openfeign.dto;

import lombok.Data;

@Data
public class GrogResponseDTO {
    private TogetherResponseDTO.ChoicesDTO[] choices;
    @Data
    static class ChoicesDTO {
        private TogetherResponseDTO.ChoicesDTO.Message message;
        @Data
        static class Message {
            private String content;
        }
    }
    public String getContent() {
        return choices[0].getMessage().getContent();
    }
}