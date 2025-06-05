import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Forum.css';
import megaphone from "../../icons/megaphone.png";

export default function Forum() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // 게시물 목록 로드
    const loadPosts = () => {
        fetch('http://localhost:8080/forum/list/1')
            .then((res) => res.json())
            .then((data) => {
                setPosts(Array.isArray(data.forums) ? data.forums : []);
            })
            .catch((err) => {
                console.error('게시글 불러오기 실패:', err);
                setPosts([]);
            });
    };

    // 태그 목록 로드
    const loadTags = () => {
        fetch('http://localhost:8080/forum/tags')
            .then((res) => res.json())
            .then((data) => {
                setAvailableTags(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error('태그 불러오기 실패:', err);
                setAvailableTags([]);
            });
    };

    // 태그로 검색
    const searchByTag = (tag) => {
        const searchData = {
            content: tag,
            page: 1,
            size: 15,
            mode: 'TAG'
        };

        fetch('http://localhost:8080/forum/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData)
        })
            .then((res) => res.json())
            .then((data) => {
                setPosts(Array.isArray(data.forums) ? data.forums : []);
            })
            .catch((err) => {
                console.error('태그 검색 실패:', err);
                setPosts([]);
            });
    };

    // 텍스트 검색 (제목 + 내용)
    const searchByText = (searchText) => {
        if (!searchText.trim()) {
            loadPosts();
            return;
        }

        const searchData = {
            content: searchText,
            page: 1,
            size: 15,
            mode: 'TITLE_AND_CONTENT'
        };

        fetch('http://localhost:8080/forum/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData)
        })
            .then((res) => res.json())
            .then((data) => {
                setPosts(Array.isArray(data.forums) ? data.forums : []);
            })
            .catch((err) => {
                console.error('텍스트 검색 실패:', err);
                setPosts([]);
            });
    };

    useEffect(() => {
        loadPosts();
        loadTags();
    }, [location]);

    // 검색어 변경 시 검색 실행
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (selectedTag) {
                // 태그가 선택된 상태에서는 텍스트 검색 안함
                return;
            }
            searchByText(search);
        }, 300); // 300ms 디바운스

        return () => clearTimeout(timeoutId);
    }, [search, selectedTag]);

    // 태그 선택 처리
    const handleTagSelect = (tag) => {
        if (tag === selectedTag) {
            // 같은 태그 클릭 시 선택 해제
            setSelectedTag('');
            setSearch('');
            loadPosts();
        } else if (tag === '') {
            // 전체 선택
            setSelectedTag('');
            setSearch('');
            loadPosts();
        } else {
            // 새 태그 선택
            setSelectedTag(tag);
            setSearch('');
            searchByTag(tag);
        }
    };

    return (
        <div className="forum-container">
            <h2>
                <img
                    src={megaphone}
                    alt="메가폰 아이콘"
                    style={{
                        width: '1.4em',
                        verticalAlign: 'middle',
                        marginRight: '0.4rem'
                    }}
                />익명 게시판</h2>

            <div className="forum-top">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="제목 또는 내용으로 검색"
                    disabled={selectedTag !== ''} // 태그가 선택되면 검색창 비활성화
                />
                <button onClick={() => navigate('/forum/write')}>작성</button>
            </div>

            {/* 태그 필터 버튼들 */}
            <div className="tag-filter-container">
                <button
                    className={`tag-filter-btn ${selectedTag === '' ? 'active' : ''}`}
                    onClick={() => handleTagSelect('')}
                >
                    전체
                </button>
                {availableTags.map((tag) => (
                    <button
                        key={tag}
                        className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                        onClick={() => handleTagSelect(tag)}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            <ul className="forum-posts">
                {posts.length === 0 ? (
                    <li className="empty">
                        {selectedTag ? `"${selectedTag}" 태그의 게시물이 없습니다.` : '게시물이 없습니다.'}
                    </li>
                ) : (
                    posts.map((post) => (
                        <li
                            key={post.id}
                            className="forum-item"
                            onClick={() => navigate(`/forum/${post.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div>
                                <p>{post.title}</p>
                                {/* 태그 표시 */}
                                {post.tags && (
                                    <div className="tags">
                                        {Array.isArray(post.tags)
                                            ? post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`tag ${selectedTag === tag ? 'tag-selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTagSelect(tag);
                                                    }}
                                                >
                            #{tag}
                          </span>
                                            ))
                                            : <span
                                                className={`tag ${selectedTag === post.tags ? 'tag-selected' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTagSelect(post.tags);
                                                }}
                                            >
                          #{post.tags}
                        </span>
                                        }
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}