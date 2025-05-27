package com.rureadyimready.backend.controller.dto;

import lombok.Data;

@Data
public class ForumSearchDTO {
    private String content;
    private ForumSearchMode mode;
    private int page;
    private Integer size; // nullable
}