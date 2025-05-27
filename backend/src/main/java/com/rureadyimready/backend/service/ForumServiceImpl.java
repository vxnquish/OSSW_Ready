package com.rureadyimready.backend.service;

import com.rureadyimready.backend.controller.dto.ForumContentDTO;
import com.rureadyimready.backend.controller.dto.ForumResultDTO;
import com.rureadyimready.backend.domain.ForumContent;
import com.rureadyimready.backend.domain.ForumTags;
import com.rureadyimready.backend.domain.Tags;
import com.rureadyimready.backend.repository.ForumRepository;
import com.rureadyimready.backend.repository.TagsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ForumServiceImpl implements ForumService {
    private final ForumRepository forumRepository;
    private final TagsRepository tagsRepository;

    @Transactional(readOnly = false)
    public ForumContent save(ForumContentDTO data) {
        List<String> tagValues = data.getTags();

        ForumContent entity = data.toEntity();

        // 태그가 없는 경우: 빈 리스트 설정 후 저장
        if (tagValues == null || tagValues.isEmpty()) {
            entity.setForumTags(List.of());
            return forumRepository.save(entity);
        }

        // 태그가 있는 경우: 유효성 검증
        List<Tags> tags = tagsRepository.findByValueIn(tagValues);
        if (tags.size() != tagValues.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 태그가 있습니다.");
        }

        entity.setForumTags(tags.stream()
                .map(tag -> ForumTags.builder()
                        .forumContent(entity)
                        .tags(tag)
                        .build())
                .toList());

        return forumRepository.save(entity);
    }

    public ForumContent findById(long id) {
        return forumRepository.findByIdWithTags(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, id + "번 게시글이 없습니다."));
    }

    public ForumResultDTO findAll(int page, int size) {
        return new ForumResultDTO(forumRepository.findAllWithoutContent(PageRequest.of(page - 1, size,
                Sort.by("createdAt").descending())));
    }

    public ForumResultDTO findByTitle(String title, int page, int size) {
        return new ForumResultDTO(forumRepository.findByTitleContaining(title,
                PageRequest.of(page - 1, size, Sort.by("createdAt").descending())));
    }

    public ForumResultDTO findByContent(String content, int page, int size) {
        return new ForumResultDTO(forumRepository.findByContentContaining(content,
                PageRequest.of(page - 1, size, Sort.by("createdAt").descending())));
    }

    public ForumResultDTO findByTitleAndContent(String content, int page, int size) {
        return new ForumResultDTO(forumRepository.findByTitleContainingAndContentContaining(content,
                PageRequest.of(page - 1, size, Sort.by("createdAt").descending())));
    }

    public ForumResultDTO findByTag(String tag, int page, int size) {
        return new ForumResultDTO(forumRepository.findByTagName(tag,
                PageRequest.of(page - 1, size, Sort.by("f.createdAt").descending())));
    }
}
