package com.rureadyimready.backend.service;

import com.rureadyimready.backend.openfeign.TogetherClient;
import com.rureadyimready.backend.openfeign.dto.TogetherRequestDTO;
import com.rureadyimready.backend.openfeign.dto.TogetherRequestMessageDTO;
import com.rureadyimready.backend.openfeign.dto.TogetherResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.rureadyimready.backend.openfeign.GptClient;
import com.rureadyimready.backend.openfeign.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

//package com.rureadyimready.backend.service;
//
//import com.rureadyimready.backend.openfeign.GptClient;
//import com.rureadyimready.backend.openfeign.dto.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class PlaceRecommendationService {
//    private final GptClient client;
//
//    @Value("${externals.gpt.apikey}")
//    private String apiKey;
//
//    @Value("${externals.gpt.model}")
//    private String model;
//
//    public String recommendPlace(String location, String preference) {
//        TogetherRequestDTO requestDTO = TogetherRequestDTO.builder()
//                .model(model)
//                .messages(List.of(
//                        TogetherRequestMessageDTO.builder()
//                                .role("system")
//                                .content("너는 블로그와 리뷰를 검색해서 장소를 추천하는 전문가야. " +
//                                        "실제 존재하는 장소의 이름, 주소, 특징, 그리고 가능하면 관련 블로그 링크를 제공해줘. " +
//                                        "각 장소마다 구체적인 정보와 왜 그 분위기에 맞는지 설명해줘.")
//                                .build(),
//                        TogetherRequestMessageDTO.builder()
//                                .role("user")
//                                .content(location + "에서 " + preference + " 분위기의 데이트 장소를 추천해줘. " +
//                                        "장소명, 주소, 특징을 포함해서 5개 정도 추천해줘.")
//                                .build()
//                ))
//                .build();
//
//        ResponseEntity<GPTResponseDTO> response = client.chat("Bearer " + apiKey, requestDTO);
//        return response.getBody().getContent();
//    }
//}
// PlaceRecommendationService.java 수정
@Service
@RequiredArgsConstructor
public class PlaceRecommendationService {
    private final TogetherClient client;  // GptClient → TogetherClient 변경

    @Value("${externals.together.apikey}")  // GPT → Together 변경
    private String apiKey;

    @Value("${externals.together.model}")  // GPT → Together 변경
    private String model;

    public String recommendPlace(String location, String preference) {
        TogetherRequestDTO requestDTO = TogetherRequestDTO.builder()
                .model(model)
                .messages(List.of(
                        TogetherRequestMessageDTO.builder()
                                .role("system")
                                .content("너는 블로그와 리뷰를 검색해서 장소를 추천하는 전문가야.")
                                .build(),
                        TogetherRequestMessageDTO.builder()
                                .role("user")
                                .content(location + "에서 " + preference + " 분위기의 데이트 장소를 추천해줘.")
                                .build()
                ))
                .build();

        ResponseEntity<TogetherResponseDTO> response = client.chat("Bearer " + apiKey, requestDTO);  // GPTResponseDTO → TogetherResponseDTO 변경
        return response.getBody().getContent();
    }
}