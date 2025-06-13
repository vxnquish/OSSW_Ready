package com.rureadyimready.backend.controller;
//
//import com.rureadyimready.backend.controller.dto.ChatRequestDTO;
//import com.rureadyimready.backend.controller.dto.ChatResponseDTO;
//import com.rureadyimready.backend.controller.dto.RecommendResponseDTO;
//import com.rureadyimready.backend.openfeign.dto.PlaceRequestDTO;
//import com.rureadyimready.backend.service.LoveTutorService;
//import com.rureadyimready.backend.service.RecommendationService;
//import com.rureadyimready.backend.service.PlaceRecommendationService;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin
//@RequiredArgsConstructor
//public class AdviceController {
//
//    private final LoveTutorService loveTutorService;
//    private final RecommendationService recommendationService;
//    private final PlaceRecommendationService placeRecommendationService;
//
//    @PostMapping("/chat")
//    public ChatResponseDTO chat(@RequestBody ChatRequestDTO body) {
//        String message = body.getMessage();
//        String response = loveTutorService.getAdvice(message);
//        return new ChatResponseDTO(response);
//    }
//
//    @GetMapping("/recommend")
//    public RecommendResponseDTO recommend(@RequestParam String location) {
//        return new RecommendResponseDTO(recommendationService.getRecommendations(location));
//    }
//    @PostMapping("/place-recommend")
//    public ChatResponseDTO recommendPlace(@RequestBody PlaceRequestDTO request) {
//        String response = placeRecommendationService.recommendPlace(
//                request.getLocation(),
//                request.getPreference()
//        );
//        return new ChatResponseDTO(response);
//    }
//}

import com.rureadyimready.backend.controller.dto.ChatRequestDTO;
import com.rureadyimready.backend.controller.dto.ChatResponseDTO;
import com.rureadyimready.backend.controller.dto.RecommendResponseDTO;
import com.rureadyimready.backend.openfeign.dto.PlaceRequestDTO;
import com.rureadyimready.backend.service.LoveTutorService;
import com.rureadyimready.backend.service.RecommendationService;
import com.rureadyimready.backend.service.PlaceRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
@RequiredArgsConstructor
public class AdviceController {

    private final LoveTutorService loveTutorService;           // Together AI (연애상담)
    private final RecommendationService recommendationService; // 기존 하드코딩 추천
    private final PlaceRecommendationService placeRecommendationService; // Together AI (장소추천)

    // 연애상담 (Together AI)
    @PostMapping("/chat")
    public ChatResponseDTO chat(@RequestBody ChatRequestDTO body) {
        String message = body.getMessage();
        String response = loveTutorService.getAdvice(message);
        return new ChatResponseDTO(response);
    }

    // 기존 하드코딩 추천
    @GetMapping("/recommend")
    public RecommendResponseDTO recommend(@RequestParam String location) {
        return new RecommendResponseDTO(recommendationService.getRecommendations(location));
    }

//     AI 장소추천 (Together AI)
    @PostMapping("/place-recommend")
    public ChatResponseDTO recommendPlace(@RequestBody PlaceRequestDTO request) {
        String response = placeRecommendationService.recommendPlace(
                request.getLocation(),
                request.getPreference()
        );
        return new ChatResponseDTO(response);
    }
}