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
//    private List<String> tags;

    public ForumTitleDTO(long id, String title, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
//        this.tags = List.of();
    }

//    public ForumTitleDTO(long id, String title, LocalDateTime createdAt, List<Tags> tags) {
//        this.id = id;
//        this.title = title;
//        this.createdAt = createdAt;
//        this.tags = tags.stream().map(Tags::getValue).toList();
//    }
}