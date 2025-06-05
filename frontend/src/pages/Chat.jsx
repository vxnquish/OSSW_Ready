import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { askLoveAdvice } from '../api/flask';
import './Chat.css';
import loveIcon from '../../icons/loveletterEmoji.png';
import userIcon from '../../icons/user.png';
import AiIcon from '../../icons/ai.png';

const keywordHints = ["짝사랑", "고백", "이별", "썸", "데이트", "연애", "장거리", "연락", "권태기"];

export default function Chat() {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSend = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const res = await askLoveAdvice(message);
            const newEntry = {
                question: message,
                answer: res.response,
                time: new Date().toLocaleTimeString()
            };
            // 새로운 항목을 배열의 앞에 추가
            setHistory([newEntry, ...history]);
            setMessage('');
        } catch (err) {
            // 에러 메시지도 배열의 앞에 추가
            setHistory([{
                question: message,
                answer: '⚠️ 응답 중 오류가 발생했습니다.',
                time: new Date().toLocaleTimeString()
            }, ...history]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 상담 내용을 게시판에 공유하는 함수
    const shareToForum = (entry) => {
        const shareData = {
            question: entry.question,
            answer: entry.answer,
            time: entry.time
        };

        // 상담 내용을 sessionStorage에 저장하고 작성 페이지로 이동
        sessionStorage.setItem('shareConsultation', JSON.stringify(shareData));
        navigate('/forum/write');
    };

    return (
        <div className="chat-container">
            <h2>
                <img
                    src={loveIcon}
                    alt="연애상담 아이콘"
                    style={{
                        width: '1.4em',
                        verticalAlign: 'middle',
                        marginRight: '0.4rem'
                    }}
                />
                연애 상담
            </h2>

            {/* 안내 메시지 */}
            <div className="chat-notice">
                <div className="notice-icon">💡</div>
                <div className="notice-content">
                    <p><strong>안내:</strong> 다른 페이지로 이동하면 대화 내역이 초기화됩니다.</p>
                    <p>중요한 상담 내용은 <strong>"📢 상담 공유하기"</strong> 버튼으로 게시판에 저장해보세요!</p>
                </div>
            </div>

            <div className="keywords">
                {keywordHints.map((k, i) => (
                    <button key={i} onClick={() => setMessage(k)}>{k}</button>
                ))}
            </div>

            <div className="input-group">
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="고민을 입력하세요"
                />
                <button onClick={handleSend}>상담 요청</button>
            </div>

            {loading && (
                <div className="spinner-wrapper">
                    <div className="spinner" />
                    <p>AI가 상담 중입니다...</p>
                </div>
            )}

            <ul className="history">
                {history.map((entry, i) => (
                    <li key={i}>
                        <p><strong><img
                            src={userIcon}
                            alt="사용자 아이콘"
                            style={{
                                width: '1.4em',
                                verticalAlign: 'middle',
                                marginRight: '0.4rem'
                            }}
                        /> 당신:</strong> {entry.question}</p>
                        <p><strong><img
                            src={AiIcon}
                            alt="ai 아이콘"
                            style={{
                                width: '1.4em',
                                verticalAlign: 'middle',
                                marginRight: '0.4rem'
                            }}
                        /> AI:</strong> {entry.answer}</p>
                        <div className="consultation-actions">
                            <small>🕒 {entry.time}</small>
                            <button
                                className="share-btn"
                                onClick={() => shareToForum(entry)}
                                title="게시판에 공유하기"
                            >
                                📢 상담 공유하기
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}