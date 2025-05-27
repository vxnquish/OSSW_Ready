package com.rureadyimready.backend.service;

import com.rureadyimready.backend.openfeign.TogetherClient;
import com.rureadyimready.backend.openfeign.dto.TogetherRequestMessageDTO;
import com.rureadyimready.backend.openfeign.dto.TogetherResponseDTO;
import com.rureadyimready.backend.openfeign.dto.TogetherRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Primary
@Service
@RequiredArgsConstructor
public class LoveTutorServiceTogether implements LoveTutorService {
    private final TogetherClient client;

    @Value("${externals.together.apikey}")
    private String apiKey;

    @Value("${externals.together.model}")
    private String model;

    @Override
    public String getAdvice(String message) {
        TogetherRequestDTO requestDTO= TogetherRequestDTO.builder()
                .model(model)
                .messages(List.of(TogetherRequestMessageDTO.builder()
                                .role("system")
                                .content("너는 연애 상담 전문가야. 공감하면서 현실적이고 따뜻한 조언을 해줘.")
                                .build(),
                        TogetherRequestMessageDTO.builder()
                                .role("user")
                                .content(message)
                                .build()))
                .build();
        ResponseEntity<TogetherResponseDTO> response = client.chat("Bearer " + apiKey, requestDTO);
        return response.getBody().getContent();
    }
}
