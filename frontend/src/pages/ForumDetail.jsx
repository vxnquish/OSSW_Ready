import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ForumDetail.css';

export default function ForumDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/forum/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }
        return res.json();
      })
      .then((data) => setPost(data))
      .catch((err) => {
        console.error('상세 불러오기 실패:', err);
        setError(true);
      });
  }, [id]);

  if (error) return <div className="forum-detail">❗ 게시글을 찾을 수 없습니다.</div>;
  if (!post) return <div className="forum-detail">로딩 중...</div>;

  return (
    <div className="forum-detail">
      <h2>{post.title}</h2>
      <div className="forum-tags">
        {post.tags?.map((tag, idx) => (
          <span key={idx} className="forum-tag">#{tag}</span>
        ))}
      </div>
      <p className="forum-content">{post.content}</p>
    </div>
  );
}
