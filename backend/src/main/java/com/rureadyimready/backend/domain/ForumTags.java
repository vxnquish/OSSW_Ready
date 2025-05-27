package com.rureadyimready.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@IdClass(ForumTagsId.class)
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@Getter
public class ForumTags {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forum_content_id", nullable = false)
    private ForumContent forumContent;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tags tags;
}
