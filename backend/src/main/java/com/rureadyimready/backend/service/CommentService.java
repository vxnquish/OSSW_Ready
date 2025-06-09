package com.rureadyimready.backend.service;

import com.rureadyimready.backend.controller.dto.CommentDTO;
import com.rureadyimready.backend.controller.dto.CommentRequestDTO;

import java.util.List;

public interface CommentService {
    CommentDTO save(CommentRequestDTO commentRequest);
    List<CommentDTO> findByForumContentId(Long forumContentId);
    Long countByForumContentId(Long forumContentId);
    void deleteById(Long commentId);
}