import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Forum.css';
import megaphone from "../../icons/megaphone.png";

export default function Forum() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [clickedPostId, setClickedPostId] = useState(null); // 클릭된 게시물 추적
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

    // 다중 태그로 검색
    const searchByTags = (tags) => {
        if (tags.length === 0) {
            loadPosts();
            return;
        }

        const searchData = {
            content: tags.join(','),
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
            if (selectedTags.length > 0) {
                return;
            }
            searchByText(search);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, selectedTags]);

    // 태그 선택/해제 처리
    const handleTagSelect = (tag) => {
        if (tag === '') {
            setSelectedTags([]);
            setSearch('');
            loadPosts();
        } else {
            const newSelectedTags = selectedTags.includes(tag)
                ? selectedTags.filter(t => t !== tag)
                : [...selectedTags, tag];

            setSelectedTags(newSelectedTags);
            setSearch('');
            searchByTags(newSelectedTags);
        }
    };

    // 선택된 태그들 초기화
    const clearSelectedTags = () => {
        setSelectedTags([]);
        setSearch('');
        loadPosts();
    };

    // 🎯 개선된 게시물 클릭 핸들러
    const handlePostClick = (postId) => {
        setClickedPostId(postId);

        // 클릭 애니메이션 후 네비게이션 (더 빠르게)
        setTimeout(() => {
            navigate(`/forum/${postId}`);
        }, 100); // 0.1초로 단축
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
                />익명 게시판
            </h2>

            <div className="forum-top">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={selectedTags.length > 0 ? "태그 필터가 활성화되어 있습니다" : "제목 또는 내용으로 검색"}
                    disabled={selectedTags.length > 0}
                />
                <button onClick={() => navigate('/forum/write')}>작성</button>
            </div>

            {selectedTags.length > 0 && (
                <div className="selected-tags-container">
                    <span>선택된 태그:</span>
                    {selectedTags.map((tag) => (
                        <span key={tag} className="selected-tag">
                            #{tag}
                            <button
                                className="remove-tag-btn"
                                onClick={() => handleTagSelect(tag)}
                                title={`${tag} 태그 제거`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <button
                        className="clear-tags-btn"
                        onClick={clearSelectedTags}
                        title="모든 태그 선택 해제"
                    >
                        전체 해제
                    </button>
                </div>
            )}

            <div className="tag-filter-container">
                <button
                    className={`tag-filter-btn ${selectedTags.length === 0 ? 'active' : ''}`}
                    onClick={() => handleTagSelect('')}
                >
                    전체
                </button>
                {availableTags.map((tag) => (
                    <button
                        key={tag}
                        className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                        onClick={() => handleTagSelect(tag)}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            <ul className="forum-posts">
                {posts.length === 0 ? (
                    <li className="empty">
                        {selectedTags.length > 0
                            ? `선택된 태그 (${selectedTags.map(tag => `#${tag}`).join(', ')})의 게시물이 없습니다.`
                            : '게시물이 없습니다.'
                        }
                    </li>
                ) : (
                    posts.map((post) => (
                        <li
                            key={post.id}
                            className={`forum-item ${clickedPostId === post.id ? 'clicking' : ''}`}
                            onClick={() => handlePostClick(post.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div>
                                <p>{post.title}</p>
                                {post.tags && (
                                    <div className="tags">
                                        {Array.isArray(post.tags)
                                            ? post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`tag ${selectedTags.includes(tag) ? 'tag-selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTagSelect(tag);
                                                    }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))
                                            : <span
                                                className={`tag ${selectedTags.includes(post.tags) ? 'tag-selected' : ''}`}
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