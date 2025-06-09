package com.rureadyimready.backend.service;

import com.rureadyimready.backend.controller.dto.CommentDTO;
import com.rureadyimready.backend.controller.dto.CommentRequestDTO;
import com.rureadyimready.backend.domain.Comment;
import com.rureadyimready.backend.domain.ForumContent;
import com.rureadyimready.backend.repository.CommentRepository;
import com.rureadyimready.backend.repository.ForumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ForumRepository forumRepository;

    @Transactional
    @Override
    public CommentDTO save(CommentRequestDTO commentRequest) {
        // 게시글 존재 확인
        ForumContent forumContent = forumRepository.findById(commentRequest.getForumContentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        // 해당 게시글의 댓글 수 확인하여 익명 이름 생성
        Long commentCount = commentRepository.countByForumContentId(commentRequest.getForumContentId());
        String anonymousName = "익명" + (commentCount + 1);

        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .anonymousName(anonymousName)
                .forumContent(forumContent)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentDTO.fromEntity(savedComment);
    }

    @Override
    public List<CommentDTO> findByForumContentId(Long forumContentId) {
        List<Comment> comments = commentRepository.findByForumContentIdOrderByCreatedAtAsc(forumContentId);
        return comments.stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Long countByForumContentId(Long forumContentId) {
        return commentRepository.countByForumContentId(forumContentId);
    }

    @Transactional
    @Override
    public void deleteById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."));

        commentRepository.delete(comment);
    }
}