import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForumWrite.css';
import mapIcon from '../../icons/pencilEmoji.png';

export default function ForumWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSharedConsultation, setIsSharedConsultation] = useState(false);

    const navigate = useNavigate();

    // 컴포넌트 마운트 시 공유된 상담 내용 확인 및 태그 로드
    useEffect(() => {
        // 공유된 상담 내용 확인
        const sharedData = sessionStorage.getItem('shareConsultation');
        if (sharedData) {
            try {
                const consultationData = JSON.parse(sharedData);
                setIsSharedConsultation(true);

                // 상담 내용을 게시글 내용으로 설정
                const formattedContent = `💬 질문: ${consultationData.question}\n\n🤖 AI 상담사 답변:\n${consultationData.answer}\n\n⏰ 상담 시간: ${consultationData.time}`;
                setContent(formattedContent);

                // 제목에 힌트 제공
                setTitle('연애 상담 공유 - ');

                // 사용된 데이터 삭제
                sessionStorage.removeItem('shareConsultation');
            } catch (error) {
                console.error('공유 데이터 파싱 오류:', error);
            }
        }

        // 태그 목록 불러오기
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
            setIsSharedConsultation(false);

            navigate('/forum', { replace: true });
        } catch (err) {
            console.error('작성 실패:', err);
            alert('글 작성 중 오류가 발생했습니다.');
        }
    };

    // 상담 내용 초기화 함수
    const clearSharedContent = () => {
        setContent('');
        setTitle('');
        setIsSharedConsultation(false);
    };

    return (
        <div className="forum-write">
            <h2>
                <img
                    src={mapIcon}
                    alt="작성아이콘"
                    style={{
                        width: '1.4em',
                        verticalAlign: 'middle',
                        marginRight: '0.4rem'
                    }}
                />
                {isSharedConsultation ? '💕 연애 상담 공유하기' : '게시글 작성'}
            </h2>

            {isSharedConsultation && (
                <div className="shared-notice">
                    <p>💌 연애 상담 내용이 자동으로 입력되었습니다!</p>
                    <p>제목을 수정하고 태그를 선택한 후 게시해주세요.</p>
                    <button
                        type="button"
                        className="clear-shared-btn"
                        onClick={clearSharedContent}
                    >
                        🗑️ 상담 내용 지우기
                    </button>
                </div>
            )}

            <input
                type="text"
                placeholder={isSharedConsultation ? "제목을 완성해주세요 (예: 연애 상담 공유 - 첫 데이트 고민)" : "제목을 입력하세요"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                placeholder={isSharedConsultation ? "상담 내용이 자동으로 입력되었습니다. 필요시 수정해주세요." : "내용을 입력하세요"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={isSharedConsultation ? 'shared-content' : ''}
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

            <button onClick={handleSubmit}>
                {isSharedConsultation ? '💕 상담 내용 공유하기' : '작성'}
            </button>
        </div>
    );
}