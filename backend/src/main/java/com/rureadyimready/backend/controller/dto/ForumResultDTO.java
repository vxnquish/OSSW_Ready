package com.rureadyimready.backend.controller.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class ForumResultDTO {
    private List<ForumTitleDTO> forums;
    private int pages;

    public ForumResultDTO(Page<ForumTitleDTO> pageResult) {
        this.forums = pageResult.getContent();
        this.pages = pageResult.getTotalPages();
    }
}