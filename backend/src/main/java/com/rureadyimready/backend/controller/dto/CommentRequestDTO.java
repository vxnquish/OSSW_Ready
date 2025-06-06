package com.rureadyimready.backend.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequestDTO {
    @NotNull(message = "게시글 ID는 필수입니다.")
    private Long forumContentId;

    @NotBlank(message = "댓글 내용은 비어 있을 수 없습니다.")
    @Size(max = 1000, message = "댓글은 1000자 이하이어야 합니다.")
    private String content;
}