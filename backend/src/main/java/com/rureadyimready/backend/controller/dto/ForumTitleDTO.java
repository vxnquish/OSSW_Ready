package com.rureadyimready.backend.controller.dto;

import com.rureadyimready.backend.domain.Tags;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ForumTitleDTO {
    private long id;
    private String title;
    private LocalDateTime createdAt;

    public ForumTitleDTO(long id, String title, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
    }

}