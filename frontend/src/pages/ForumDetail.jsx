import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from './Comments'; // Comments 컴포넌트 활성화
import './ForumDetail.css';

export default function ForumDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [commentCount, setCommentCount] = useState(0); // 댓글 수 상태 추가

    // 댓글 수 조회 함수
    const loadCommentCount = async () => {
        try {
            const response = await fetch(`http://localhost:8080/comment/forum/${id}/count`);
            if (response.ok) {
                const data = await response.json();
                setCommentCount(data.count || 0);
            }
        } catch (error) {
            console.error('댓글 수 조회 실패:', error);
            setCommentCount(0);
        }
    };

    // 게시글 로드 함수
    const loadPost = async () => {
        try {
            setLoading(true);
            setError(false);
            setErrorMessage('');

            console.log('게시글 로드 시도:', id);

            const response = await fetch(`http://localhost:8080/forum/${id}`);

            console.log('응답 상태:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('서버 응답 오류:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('받은 데이터:', data);

            if (!data) {
                throw new Error('데이터가 없습니다');
            }

            setPost(data);
            setError(false);

            // 댓글 수도 함께 로드
            await loadCommentCount();
        } catch (err) {
            console.error('게시글 불러오기 실패:', err);
            setError(true);
            setErrorMessage(err.message || '알 수 없는 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadPost();
        }
    }, [id]);

    // 뒤로 가기 버튼
    const handleBackClick = () => {
        navigate('/forum');
    };

    if (loading) {
        return (
            <div className="forum-detail">
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    로딩 중... (게시글 ID: {id})
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="forum-detail">
                <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                    <h3>❗ 게시글을 찾을 수 없습니다</h3>
                    <p>게시글 ID: {id}</p>
                    <p>오류 메시지: {errorMessage}</p>
                    <div style={{ marginTop: '1rem' }}>
                        <button
                            onClick={handleBackClick}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginRight: '0.5rem'
                            }}
                        >
                            목록으로 돌아가기
                        </button>
                        <button
                            onClick={loadPost}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="forum-detail">
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    게시글 데이터가 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="forum-detail">
            {/* 뒤로 가기 버튼 */}
            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={handleBackClick}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#667eea',
                        border: '1px solid #667eea',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    ← 목록으로
                </button>
            </div>

            {/* 게시글 내용 */}
            <h2>{post.title || '제목 없음'}</h2>

            {/* 게시글 메타 정보 */}
            {post.createdAt && (
                <div style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
          <span>📅 {new Date(post.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          })}</span>
                    {post.commentCount !== undefined ? (
                        <span>💬 댓글 {post.commentCount}개</span>
                    ) : (
                        <span>💬 댓글 {commentCount}개</span>
                    )}
                </div>
            )}

            {/* 태그 표시 */}
            <div className="forum-tags">
                {post.tags?.map((tag, idx) => (
                    <span key={idx} className="forum-tag">#{tag}</span>
                ))}
            </div>

            {/* 게시글 본문 */}
            <p className="forum-content">{post.content || '내용 없음'}</p>

            {/* 댓글 컴포넌트 활성화 */}
            <Comments
                forumContentId={parseInt(id)}
                onCommentUpdate={() => {
                    loadPost();
                    loadCommentCount();
                }}
            />
        </div>
    );
}