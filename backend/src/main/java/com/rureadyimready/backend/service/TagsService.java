package com.rureadyimready.backend.service;

import com.rureadyimready.backend.domain.Tags;
import com.rureadyimready.backend.repository.TagsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TagsService {
    private final TagsRepository tagsRepository;

    public List<String> findAllToString() {
        return tagsRepository.findAll()
                .stream()
                .map(Tags::getValue)
                .toList();
    }

    public Tags findByName(String name) {
        Optional<Tags> result = tagsRepository.findByValue(name);
        if (result.isPresent()) return result.get();
        else throw new NoSuchElementException("태그가 없습니다.");
    }
}