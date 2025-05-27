package com.rureadyimready.backend.controller;

import com.rureadyimready.backend.controller.dto.ChatRequestDTO;
import com.rureadyimready.backend.controller.dto.ChatResponseDTO;
import com.rureadyimready.backend.controller.dto.RecommendResponseDTO;
import com.rureadyimready.backend.service.LoveTutorService;
import com.rureadyimready.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
@RequiredArgsConstructor
public class AdviceController {

    private final LoveTutorService loveTutorService;
    private final RecommendationService recommendationService;

    @PostMapping("/chat")
    public ChatResponseDTO chat(@RequestBody ChatRequestDTO body) {
        String message = body.getMessage();
        String response = loveTutorService.getAdvice(message);
        return new ChatResponseDTO(response);
    }

    @GetMapping("/recommend")
    public RecommendResponseDTO recommend(@RequestParam String location) {
        return new RecommendResponseDTO(recommendationService.getRecommendations(location));
    }
}

