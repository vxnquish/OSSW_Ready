package com.rureadyimready.backend.repository;

import com.rureadyimready.backend.domain.Tags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagsRepository extends JpaRepository<Tags, Long> {
    Optional<Tags> findByValue(String value);
    List<Tags> findByValueIn(Collection<String> values);
}