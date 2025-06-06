import React, { useState, useEffect } from 'react';
import './Comments.css';

export default function Comments({ forumContentId, onCommentUpdate }) {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 댓글 목록 로드
    const loadComments = async () => {
        if (!forumContentId) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/comment/forum/${forumContentId}`);
            if (!response.ok) {
                throw new Error('댓글을 불러올 수 없습니다.');
            }
            const data = await response.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('댓글 로딩 실패:', error);
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 댓글 작성
    const handleSubmitComment = async () => {
        if (!commentContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        if (!forumContentId) {
            alert('잘못된 게시글입니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/comment/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    forumContentId: forumContentId,
                    content: commentContent.trim()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || '댓글 작성에 실패했습니다.');
            }

            const result = await response.json();
            console.log('댓글 작성 완료:', result);

            // 댓글 입력창 초기화 및 목록 새로고침
            setCommentContent('');
            await loadComments();

            // 부모 컴포넌트에 댓글 업데이트 알림
            if (onCommentUpdate) {
                onCommentUpdate();
            }
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert(error.message || '댓글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 엔터 키로 댓글 작성
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    // 시간 포맷팅 함수
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;

        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 익명 이름에서 아바타 아이콘 생성
    const getAvatarIcon = (anonymousName) => {
        const number = anonymousName.replace('익명', '');
        const icons = ['😊', '😄', '😃', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃'];
        return icons[parseInt(number) % icons.length] || '😊';
    };

    // 컴포넌트 마운트 시 댓글 로드
    useEffect(() => {
        loadComments();
    }, [forumContentId]);

    return (
        <div className="comments-container">
            <div className="comments-header">
                <h3 className="comments-title">
                    💬 댓글
                    <span className="comments-count">{comments.length}</span>
                </h3>
            </div>

            {/* 댓글 작성 폼 */}
            <div className="comment-form">
                <h4>✍️ 댓글 작성</h4>
                <textarea
                    className="comment-textarea"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="익명으로 댓글을 작성해보세요... (Shift+Enter: 줄바꿈, Enter: 작성)"
                    disabled={isSubmitting}
                />
                <div className="comment-form-actions">
                    <div className="anonymous-info">
                        🎭 익명{comments.length + 1}으로 작성됩니다
                    </div>
                    <button
                        className="comment-submit-btn"
                        onClick={handleSubmitComment}
                        disabled={isSubmitting || !commentContent.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner"></span>
                                작성 중...
                            </>
                        ) : (
                            '댓글 작성'
                        )}
                    </button>
                </div>
            </div>

            {/* 댓글 목록 */}
            <div className="comments-section">
                {isLoading ? (
                    <div className="comments-loading">
                        <span className="loading-spinner"></span>
                        댓글을 불러오는 중...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="comments-empty">
                        <div className="comments-empty-icon">💭</div>
                        <div>아직 댓글이 없습니다.</div>
                        <div>첫 번째 댓글을 작성해보세요!</div>
                    </div>
                ) : (
                    <ul className="comments-list">
                        {comments.map((comment) => (
                            <li key={comment.id} className="comment-item">
                                <div className="comment-header">
                                    <div className="comment-author">
                                        <div className="comment-avatar">
                                            {getAvatarIcon(comment.anonymousName)}
                                        </div>
                                        <span className="comment-name">
                                            {comment.anonymousName}
                                        </span>
                                    </div>
                                    <span className="comment-time">
                                        {formatTime(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="comment-content">
                                    {comment.content}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}