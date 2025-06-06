package com.rureadyimready.backend.controller;

import com.rureadyimready.backend.controller.dto.ForumContentDTO;
import com.rureadyimready.backend.controller.dto.ForumResultDTO;
import com.rureadyimready.backend.controller.dto.ForumSearchDTO;
import com.rureadyimready.backend.controller.dto.ForumSearchMode;
import com.rureadyimready.backend.domain.ForumContent;
import com.rureadyimready.backend.service.ForumService;
import com.rureadyimready.backend.service.TagsService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forum")
@CrossOrigin
@RequiredArgsConstructor
@Slf4j // 로깅 추가
public class ForumController {

    private final ForumService forumService;
    private final TagsService tagsService;

    public static final int DEFAULT_PAGE_SIZE = 15;

    /**
     * 게시글 ID를 받아 게시글 정보 제공 (조회 전용) - 댓글 수 포함
     */
    @GetMapping("/{id}")
    public ResponseEntity<ForumContentDTO> getForumContent(@PathVariable long id) {
        try {
            log.info("게시글 조회 요청: ID = {}", id);

            // 댓글 수를 포함한 조회 메서드 사용
            ForumContentDTO dto = forumService.findByIdWithCommentCount(id);
            if (dto == null) {
                log.warn("게시글을 찾을 수 없음: ID = {}", id);
                return ResponseEntity.notFound().build();
            }

            log.info("게시글 조회 성공: ID = {}, Title = {}, CommentCount = {}",
                    id, dto.getTitle(), dto.getCommentCount());

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("게시글 조회 중 오류 발생: ID = {}, Error = {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 기존 방식 유지 (호환성)
     */
    @GetMapping("/{id}/legacy")
    public ForumContentDTO getForumContentLegacy(@PathVariable long id) {
        log.info("레거시 게시글 조회: ID = {}", id);
        return ForumContentDTO.fromEntity(forumService.findById(id));
    }

    /**
     * 게시글 정보를 받아 등록 (작성 전용)
     */
    @PostMapping("/save")
    public ForumSaveResponse saveForumContent(@RequestBody @Valid ForumContentDTO forum) {
        try {
            log.info("게시글 작성 요청: Title = {}", forum.getTitle());

            ForumContent savedForum = forumService.save(forum);

            log.info("게시글 작성 완료: ID = {}", savedForum.getId());
            return new ForumSaveResponse(savedForum.getId(), "게시글이 성공적으로 작성되었습니다.");
        } catch (Exception e) {
            log.error("게시글 작성 중 오류: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Data
    @AllArgsConstructor
    static class ForumSaveResponse {
        private Long id;
        private String message;
    }

    /**
     * 게시글 목록 조회 (페이지네이션 포함)
     */
    @GetMapping("/list/{page}")
    public ResponseEntity<ForumResultDTO> getForumList(@PathVariable int page, @RequestParam(required = false) Integer size) {
        try {
            if (size == null) size = DEFAULT_PAGE_SIZE;
            log.info("게시글 목록 조회: page = {}, size = {}", page, size);

            ForumResultDTO result = forumService.findAll(page, size);
            log.info("게시글 목록 조회 완료: 총 {}개", result.getForums().size());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("게시글 목록 조회 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 게시글 검색
     */
    @PostMapping("/search")
    public ForumResultDTO searchForums(@RequestBody ForumSearchDTO search) {
        if (search.getSize() == null) search.setSize(DEFAULT_PAGE_SIZE);
        if (search.getMode() == null) search.setMode(ForumSearchMode.TITLE_AND_CONTENT);

        if (search.getContent() == null) {
            return forumService.findAll(search.getPage(), search.getSize());
        }

        return switch (search.getMode()) {
            case TITLE -> forumService.findByTitle(search.getContent(), search.getPage(), search.getSize());
            case CONTENT -> forumService.findByContent(search.getContent(), search.getPage(), search.getSize());
            case TITLE_AND_CONTENT -> forumService.findByTitleAndContent(search.getContent(), search.getPage(), search.getSize());
            case TAG -> forumService.findByTag(search.getContent(), search.getPage(), search.getSize());
        };
    }

    /**
     * 전체 태그 목록 조회
     */
    @GetMapping("/tags")
    public List<String> getAllTags() {
        return tagsService.findAllToString();
    }

    /**
     * 데이터베이스 상태 확인용 (디버깅)
     */
    @GetMapping("/debug/count")
    public ResponseEntity<String> getForumCount() {
        try {
            ForumResultDTO result = forumService.findAll(1, 100);
            return ResponseEntity.ok("총 게시글 수: " + result.getForums().size());
        } catch (Exception e) {
            return ResponseEntity.ok("오류: " + e.getMessage());
        }
    }
}