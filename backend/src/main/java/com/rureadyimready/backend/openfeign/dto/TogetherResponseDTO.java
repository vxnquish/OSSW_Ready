package com.rureadyimready.backend.openfeign.dto;

import lombok.Data;

@Data
public class TogetherResponseDTO {
    private ChoicesDTO[] choices;
    @Data
    static class ChoicesDTO {
        private Message message;
        @Data
        static class Message {
            private String content;
        }
    }
    public String getContent() {
        return choices[0].getMessage().getContent();
    }
}