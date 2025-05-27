import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">💘 RUREADYIMREADY</h1>
      <p className="home-subtitle">연애에 어려움을 겪는 사람들을 위한 종합 연애 플랫폼</p>

      <div className="home-buttons">
        <Link to="/chat" className="home-btn">💬 연애 상담</Link>
        <Link to="/recommend" className="home-btn">📍 데이트 코스 추천</Link>
        <Link to="/forum" className="home-btn">📢 게시판</Link>
      </div>

      <footer className="home-footer">
        © 2025 RUREADYIMREADY | Made with 💖
      </footer>
    </div>
  );
};

export default Home;
