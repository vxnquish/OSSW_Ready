// OSSW_Ready/frontend/src/App.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Recommend from './pages/Recommend'
import Forum from './pages/Forum'
import ForumWrite from './pages/ForumWrite'
import ForumDetail from './pages/ForumDetail'
import './App.css'

// 페이지 애니메이션 래퍼 컴포넌트
const PageWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 20)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className={`page-wrapper ${isVisible ? 'page-enter' : 'page-enter-preparing'}`}>
      {children}
    </div>
  )
}

// 애니메이션이 적용된 라우트 컴포넌트
const AnimatedRoutes = () => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  return (
    <div
      className={`routes-container ${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === 'fadeOut') {
          setTransitionStage('fadeIn')
          setDisplayLocation(location)
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/chat"
          element={
            <PageWrapper>
              <Chat />
            </PageWrapper>
          }
        />
        <Route
          path="/recommend"
          element={
            <PageWrapper>
              <Recommend />
            </PageWrapper>
          }
        />
        <Route
          path="/forum"
          element={
            <PageWrapper>
              <Forum />
            </PageWrapper>
          }
        />
        <Route
          path="/forum/write"
          element={
            <PageWrapper>
              <ForumWrite />
            </PageWrapper>
          }
        />
        <Route
          path="/forum/:id"
          element={
            <PageWrapper>
              <ForumDetail />
            </PageWrapper>
          }
        />
      </Routes>
    </div>
  )
}

const App = () => (
  <>
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>🏠 홈</Link>
      <Link to="/chat" style={{ marginRight: '1rem' }}>💌 연애 상담</Link>
      <Link to="/recommend" style={{ marginRight: '1rem' }}>🗺️ 데이트 추천</Link>
      <Link to="/forum">📢 게시판</Link>
    </nav>
    <AnimatedRoutes />
  </>
)

export default App
