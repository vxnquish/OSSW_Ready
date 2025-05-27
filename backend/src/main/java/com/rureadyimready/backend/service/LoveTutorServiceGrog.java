package com.rureadyimready.backend.service;

import com.rureadyimready.backend.openfeign.GrogClient;
import com.rureadyimready.backend.openfeign.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoveTutorServiceGrog implements LoveTutorService {
    private final GrogClient client;

    @Value("${externals.grog.apikey}")
    private String apiKey;

    @Value("${externals.grog.model}")
    private String model;

    @Override
    public String getAdvice(String message) {
        GrogRequestDTO requestDTO = GrogRequestDTO.builder()
                .model(model)
                .stream(false)
                .messages(List.of(GrogRequestMessageDTO.builder()
                                .role("system")
                                .content("너는 연애 상담 전문가야. 공감하면서 현실적이고 따뜻한 조언을 해줘.")
                                .build(),
                        GrogRequestMessageDTO.builder()
                                .role("user")
                                .content(message)
                                .build()))
                .build();
        ResponseEntity<GrogResponseDTO> response = client.chat("Bearer " + apiKey, requestDTO);
        return response.getBody().getContent();
    }
}