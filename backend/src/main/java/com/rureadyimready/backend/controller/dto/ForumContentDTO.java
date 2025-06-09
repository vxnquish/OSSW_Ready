package com.rureadyimready.backend.controller.dto;

import com.rureadyimready.backend.domain.ForumContent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ForumContentDTO {
    private Long id; // ID 추가

    @NotBlank(message = "제목은 비어 있을 수 없습니다.")
    @Size(max = 96, message = "제목의 길이는 96자 이하이어야 합니다.")
    private String title;
    @NotBlank(message = "본문은 비어 있을 수 없습니다.")
    private String content;
    private List<String> tags;
    private LocalDateTime createdAt; // 생성일시 추가
    private Long commentCount; // 댓글 수 추가

//    public ForumContent toEntity() {
//        return ForumContent.builder()
//                .title(title)
//                .content(content).build();
//    }
    public ForumContent toEntity() {
        return ForumContent.builder()
                .title(title != null ? title : "")
                .content(content != null ? content : "")
                .build();
    }
public static ForumContentDTO fromEntity(ForumContent entity) {
    if (entity == null) {
        return null;
    }

    // 안전한 댓글 수 계산
    long commentCount = 0L;
    try {
        if (entity.getComments() != null) {
            commentCount = (long) entity.getComments().size();
        }
    } catch (Exception e) {
        // Lazy loading 실패 시 0으로 설정
        commentCount = 0L;
    }
    // 안전한 태그 목록 생성
    List<String> tags = List.of();
    try {
        if (entity.getForumTags() != null && !entity.getForumTags().isEmpty()) {
            tags = entity.getForumTags().stream()
                    .filter(forumTag -> forumTag != null && forumTag.getTags() != null)
                    .map(forumTag -> forumTag.getTags().getValue())
                    .filter(tagValue -> tagValue != null && !tagValue.trim().isEmpty())
                    .toList();
        }
    } catch (Exception e) {
        // Lazy loading 실패 시 빈 리스트
        tags = List.of();
    }
    return ForumContentDTO.builder()
            .id(entity.getId())
            .title(entity.getTitle())
            .content(entity.getContent())
            .createdAt(entity.getCreatedAt())
            .commentCount(commentCount)
            .tags(tags)
            .build();
    }

}