package com.rureadyimready.backend.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ForumContent {

    public static final int TITLE_LENGTH = 96;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ✅ 전략 명시
    private Long id;

    @Column(nullable = false, length = TITLE_LENGTH)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Setter
    @OneToMany(mappedBy = "forumContent", cascade = CascadeType.ALL,
            fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference // ✅ 양방향 직렬화용
    private List<ForumTags> forumTags;
}
