package com.rureadyimready.backend.controller.dto;

import com.rureadyimready.backend.domain.ForumContent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ForumContentDTO {
    @NotBlank(message = "제목은 비어 있을 수 없습니다.")
    @Size(max = 96, message = "제목의 길이는 96자 이하이어야 합니다.")
    private String title;
    @NotBlank(message = "본문은 비어 있을 수 없습니다.")
    private String content;
    private List<String> tags;

    public ForumContent toEntity() {
        return ForumContent.builder()
                .title(title)
                .content(content).build();
    }

    public static ForumContentDTO fromEntity(ForumContent entity) {
        return ForumContentDTO.builder()
                .title(entity.getTitle())
                .content(entity.getContent())
                .tags(entity.getForumTags().stream()
                        .map(t -> t.getTags().getValue()).toList())
                .build();
    }
}