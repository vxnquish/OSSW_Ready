import React, { useState } from 'react';
import { askLoveAdvice } from '../api/flask';
import './Chat.css';

const keywordHints = ["짝사랑", "고백", "이별", "썸", "데이트", "연애", "장거리", "연락", "권태기"];

export default function Chat() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setHistory([...history, newEntry]);
      setMessage('');
    } catch (err) {
      setHistory([...history, {
        question: message,
        answer: '⚠️ 응답 중 오류가 발생했습니다.',
        time: new Date().toLocaleTimeString()
      }]);
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

  return (
    <div className="chat-container">
      <h2>💌 연애 상담</h2>

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
            <p><strong>😟 당신:</strong> {entry.question}</p>
            <p><strong>🤖 AI:</strong> {entry.answer}</p>
            <small>🕒 {entry.time}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
