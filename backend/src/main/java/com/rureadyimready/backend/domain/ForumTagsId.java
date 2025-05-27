package com.rureadyimready.backend.domain;

import java.io.Serializable;
import java.util.Objects;

public class ForumTagsId implements Serializable {
    private Long forumContent;
    private Long tags;

    public ForumTagsId() {}

    public ForumTagsId(Long forumContent, Long tags) {
        this.forumContent = forumContent;
        this.tags = tags;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ForumTagsId)) return false;
        ForumTagsId that = (ForumTagsId) o;
        return Objects.equals(forumContent, that.forumContent) &&
               Objects.equals(tags, that.tags);
    }

    @Override
    public int hashCode() {
        return Objects.hash(forumContent, tags);
    }
}