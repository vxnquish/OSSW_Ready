package com.rureadyimready.backend.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    private Map<String, List<String>> data =
            Map.of("서울", List.of("한강 피크닉", "북촌 한옥마을 산책"),
                   "부산", List.of("광안리 야경", "영도 흰여울길"));

    public List<String> getRecommendations(String location) {
        return data.getOrDefault(location, List.of("추천할 장소가 없어요 😢"));
    }
}