package com.rureadyimready.backend.controller;

import com.rureadyimready.backend.controller.dto.CommentDTO;
import com.rureadyimready.backend.controller.dto.CommentRequestDTO;
import com.rureadyimready.backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
@CrossOrigin
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 작성
     */
    @PostMapping("/save")
    public CommentIdResponse save(@RequestBody @Valid CommentRequestDTO commentRequest) {
        CommentDTO savedComment = commentService.save(commentRequest);
        return new CommentIdResponse(savedComment.getId());
    }

    @Data
    @AllArgsConstructor
    static class CommentIdResponse {
        private Long id;
    }

    /**
     * 특정 게시글의 댓글 목록 조회
     */
    @GetMapping("/forum/{forumContentId}")
    public List<CommentDTO> getCommentsByForumId(@PathVariable Long forumContentId) {
        return commentService.findByForumContentId(forumContentId);
    }

    /**
     * 특정 게시글의 댓글 수 조회
     */
    @GetMapping("/forum/{forumContentId}/count")
    public CommentCountResponse getCommentsCount(@PathVariable Long forumContentId) {
        Long count = commentService.countByForumContentId(forumContentId);
        return new CommentCountResponse(count);
    }

    @Data
    @AllArgsConstructor
    static class CommentCountResponse {
        private Long count;
    }

    /**
     * 댓글 삭제
     */
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentService.deleteById(commentId);
    }
}