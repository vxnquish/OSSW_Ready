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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

    public ForumResultDTO findByTag(String tags, int page, int size) {
//        return new ForumResultDTO(forumRepository.findByTagName(tag,
//                PageRequest.of(page - 1, size, Sort.by("f.createdAt").descending())));
        List<String> tagList = Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty()) // 빈 문자열 제거
                .collect(Collectors.toList());

        if (tagList.isEmpty()) {
            // 태그가 없으면 전체 목록 반환
            return findAll(page, size);
        } else if (tagList.size() == 1) {
            // 단일 태그는 기존 방식 사용
            return new ForumResultDTO(forumRepository.findByTagName(tagList.get(0),
                    PageRequest.of(page - 1, size, Sort.by("f.createdAt").descending())));
        } else {
            // 다중 태그는 새로운 메서드 사용 (OR 조건)
            return new ForumResultDTO(forumRepository.findByTagNames(tagList,
                    PageRequest.of(page - 1, size, Sort.by("f.createdAt").descending())));
        }
    }
}
