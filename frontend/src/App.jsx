import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Recommend from './pages/Recommend';
import Forum from './pages/Forum';            // ✅ 게시판 목록
import ForumWrite from './pages/ForumWrite';  // ✅ 게시글 작성
import ForumDetail from './pages/ForumDetail'; // ✅ 게시글 상세

const App = () => (
  <Router>
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>🏠 홈</Link>
      <Link to="/chat" style={{ marginRight: '1rem' }}>💌 연애 상담</Link>
      <Link to="/recommend" style={{ marginRight: '1rem' }}>🗺️ 데이트 추천</Link>
      <Link to="/forum">📢 게시판</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/recommend" element={<Recommend />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/write" element={<ForumWrite />} />
      <Route path="/forum/:id" element={<ForumDetail />} /> {/* ✅ 상세 페이지 라우트 */}
    </Routes>
  </Router>
);

export default App;
