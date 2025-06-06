package com.rureadyimready.backend.controller.dto;

import com.rureadyimready.backend.domain.Comment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentDTO {
    private Long id;

    @NotBlank(message = "댓글 내용은 비어 있을 수 없습니다.")
    @Size(max = 1000, message = "댓글은 1000자 이하이어야 합니다.")
    private String content;

    private String anonymousName;
    private LocalDateTime createdAt;
    private Long forumContentId;

    public static CommentDTO fromEntity(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .anonymousName(comment.getAnonymousName())
                .createdAt(comment.getCreatedAt())
                .forumContentId(comment.getForumContent().getId())
                .build();
    }
}