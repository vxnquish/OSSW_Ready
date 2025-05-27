package com.rureadyimready.backend.service;

import java.util.List;

public interface RecommendationService {
    List<String> getRecommendations(String location);
}
