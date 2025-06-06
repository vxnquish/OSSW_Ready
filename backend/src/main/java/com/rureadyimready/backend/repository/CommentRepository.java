package com.rureadyimready.backend.repository;

import com.rureadyimready.backend.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.forumContent.id = :forumContentId ORDER BY c.createdAt ASC")
    List<Comment> findByForumContentIdOrderByCreatedAtAsc(@Param("forumContentId") Long forumContentId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.forumContent.id = :forumContentId")
    Long countByForumContentId(@Param("forumContentId") Long forumContentId);
}