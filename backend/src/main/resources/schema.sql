DROP TABLE IF EXISTS forum_tags;
DROP TABLE IF EXISTS forum_content;
DROP TABLE IF EXISTS tags;

CREATE TABLE tags (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(12) NOT NULL UNIQUE
);

CREATE TABLE forum_content (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL
);

CREATE TABLE forum_tags (
  forum_content_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (forum_content_id, tag_id),
  FOREIGN KEY (forum_content_id) REFERENCES forum_content(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
