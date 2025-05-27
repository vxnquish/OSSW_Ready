package com.rureadyimready.backend.controller;

import com.rureadyimready.backend.controller.dto.ForumContentDTO;
import com.rureadyimready.backend.controller.dto.ForumResultDTO;
import com.rureadyimready.backend.controller.dto.ForumSearchDTO;
import com.rureadyimready.backend.controller.dto.ForumSearchMode;
import com.rureadyimready.backend.service.ForumService;
import com.rureadyimready.backend.service.TagsService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forum")
@CrossOrigin
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final TagsService tagsService;

    public static final int DEFAULT_PAGE_SIZE = 15;

    /**
     * 게시글 ID를 받아 게시글 정보 제공
     */
    @GetMapping("/{id}")
    public ForumContentDTO findById(@PathVariable long id) {
        return ForumContentDTO.fromEntity(forumService.findById(id));
    }

    /**
     * 게시글 정보를 받아 등록
     */
    @PostMapping("/save")
    public Lid save(@RequestBody @Valid ForumContentDTO forum) {
        return new Lid(forumService.save(forum).getId());
    }

    @Data
    @AllArgsConstructor
    class Lid {
        long id;
    }

    /**
     * 게시글 목록 조회 (페이지네이션 포함)
     */
    @GetMapping("/list/{page}")
    public ForumResultDTO getList(@PathVariable int page, @RequestParam(required = false) Integer size) {
        if (size == null) size = DEFAULT_PAGE_SIZE;
        return forumService.findAll(page, size);
    }

    /**
     * 게시글 검색
     */
    @PostMapping("/search")
    public ForumResultDTO search(@RequestBody ForumSearchDTO search) {
        if (search.getSize() == null) search.setSize(DEFAULT_PAGE_SIZE);
        if (search.getMode() == null) search.setMode(ForumSearchMode.TITLE_AND_CONTENT);

        if (search.getContent() == null) {
            return getList(search.getPage(), search.getSize());
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
    public List<String> findAllTags() {
        return tagsService.findAllToString();
    }
}
