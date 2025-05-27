package com.rureadyimready.backend.repository;

import com.rureadyimready.backend.domain.ForumContent;
import com.rureadyimready.backend.controller.dto.ForumTitleDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumRepository extends JpaRepository<ForumContent, Long> {

    @Query("""
        select f
        from ForumContent f
        left join fetch f.forumTags t
        left join fetch t.tags
        where f.id = :id
    """)
    Optional<ForumContent> findByIdWithTags(@Param("id") long id);

    @Query("select new com.rureadyimready.backend.controller.dto.ForumTitleDTO(f.id, f.title, f.createdAt) from ForumContent f")
    Page<ForumTitleDTO> findAllWithoutContent(Pageable pageable);

    @Query("select new com.rureadyimready.backend.controller.dto.ForumTitleDTO(f.id, f.title, f.createdAt) from ForumContent f where f.title like concat('%', :title, '%')")
    Page<ForumTitleDTO> findByTitleContaining(@Param("title") String title, Pageable pageable);

    @Query("select new com.rureadyimready.backend.controller.dto.ForumTitleDTO(f.id, f.title, f.createdAt) from ForumContent f where f.content like concat('%', :content, '%')")
    Page<ForumTitleDTO> findByContentContaining(@Param("content") String content, Pageable pageable);

    @Query("select new com.rureadyimready.backend.controller.dto.ForumTitleDTO(f.id, f.title, f.createdAt) from ForumContent f where f.title like concat('%', :content, '%') or f.content like concat('%', :content, '%')")
    Page<ForumTitleDTO> findByTitleContainingAndContentContaining(@Param("content") String content, Pageable pageable);

    @Query("select new com.rureadyimready.backend.controller.dto.ForumTitleDTO(f.id, f.title, f.createdAt) from ForumTags ft join ft.forumContent f join ft.tags t where t.value = :tag")
    Page<ForumTitleDTO> findByTagName(@Param("tag") String tag, Pageable pageable);
}
