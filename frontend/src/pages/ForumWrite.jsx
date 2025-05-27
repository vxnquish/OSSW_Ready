import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForumWrite.css';

export default function ForumWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();

  // 태그 목록 불러오기
  useEffect(() => {
    fetch('http://localhost:8080/forum/tags')
      .then((res) => res.json())
      .then((data) => setAllTags(data))
      .catch((err) => console.error('태그 불러오기 실패:', err));
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');

    try {
      const response = await fetch('http://localhost:8080/forum/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags: selectedTags }),
      });

      if (!response.ok) throw new Error('서버 응답 오류');

      const result = await response.json();
      console.log('작성 완료:', result);

      setTitle('');
      setContent('');
      setSelectedTags([]);

      navigate('/forum', { replace: true });
    } catch (err) {
      console.error('작성 실패:', err);
      alert('글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="forum-write">
      <h2>✍️ 게시글 작성</h2>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="tag-select">
        <p>🏷️ 태그 선택</p>
        <div className="tag-list">
          {allTags.map((tag) => (
            <label key={tag} className="tag-item">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit}>작성</button>
    </div>
  );
}
