package com.rureadyimready.backend.openfeign.dto;

import lombok.Data;

@Data
public class PlaceRequestDTO {
    private String location;    // "서울 강남"
    private String preference;  // "맛집", "카페", "데이트 코스" 등
}