import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Forum.css';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8080/forum/list/1')
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data.forums) ? data.forums : []);
        setSearch('');
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
        setPosts([]);
      });
  }, [location]);

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="forum-container">
      <h2>📢 익명 게시판</h2>

      <div className="forum-top">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어 입력"
        />
        <button onClick={() => navigate('/forum/write')}>작성</button>
      </div>

      <ul className="forum-posts">
        {filteredPosts.length === 0 ? (
          <li className="empty">게시물이 없습니다.</li>
        ) : (
          filteredPosts.map((post) => (
            <li
              key={post.id}
              className="forum-item"
              onClick={() => navigate(`/forum/${post.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <p>{post.title}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
