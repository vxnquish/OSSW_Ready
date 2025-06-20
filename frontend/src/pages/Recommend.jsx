import React, { useState, useEffect, useRef } from 'react';
import './Recommend.css';
import mapIcon from '../../icons/lovemap.png';
import { askPlaceRecommendation } from '../api/flask'; // AI 추천 API 함수 import
import AiIcon from '../../icons/ai.png';
import placeIcon from "../../icons/place.png";

export default function Recommend() {
  // 기존 상태들
  const [keyword, setKeyword] = useState('홍대 데이트');
  const [mood, setMood] = useState('');
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);
  const infowindowRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const routeLineRef = useRef(null);
  const selectedMarkersRef = useRef([]);
  const [checkedItems, setCheckedItems] = useState(new Set());

  // 공유 모달 관련 상태들
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareForm, setShareForm] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [isSharing, setIsSharing] = useState(false);

  // 태그 관련 상태들
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [loadingTags, setLoadingTags] = useState(false);

  // ✨ 새로 추가: AI 추천 관련 상태들
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiResult, setShowAiResult] = useState(false);

  // 기존 분위기별 키워드 매핑
  const moodKeywords = {
    '로맨틱': ['로맨틱', '데이트', '분위기', '커플', '낭만', '뷰맛집', '야경맛집', '감성'],
    '아늑한': ['아늑한', '조용한', '프라이빗', '힐링', '카페', '북카페', '소규모', '인테리어'],
    '야경': ['야경', '뷰', '루프탑', '스카이', '전망', '야간', '밤', '뷰맛집', '옥상']
  };

  // ✨ 새로 추가: AI 장소 추천 함수
  const handleAiRecommendation = async () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const selectedMood = mood || '로맨틱'; // 기본값 설정
    setAiLoading(true);
    setShowAiResult(false);

    try {
      const result = await askPlaceRecommendation(keyword, selectedMood);
      setAiRecommendation(result.response);
      setShowAiResult(true);
    } catch (err) {
      console.error('AI 추천 오류:', err);
      alert('AI 추천을 받아오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setAiLoading(false);
    }
  };

  // ✨ 새로 추가: AI 추천 결과 닫기
  const closeAiResult = () => {
    setShowAiResult(false);
    setAiRecommendation('');
  };

  // 기존 컴포넌트 마운트 시 지도 초기화 및 첫 검색 실행
  useEffect(() => {
    if (!window.kakao) return;
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    mapRef.current = new window.kakao.maps.Map(container, options);
    placesServiceRef.current = new window.kakao.maps.services.Places();
    infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    searchPlaces();
  }, []);

  // 기존 태그 목록 로드
  useEffect(() => {
    if (showShareModal) {
      loadAvailableTags();
    }
  }, [showShareModal]);

  // 기존 함수들 유지...
  const loadAvailableTags = async () => {
    setLoadingTags(true);
    try {
      const response = await fetch('http://localhost:8080/forum/tags');
      if (response.ok) {
        const tags = await response.json();
        console.log('DB에서 로드된 태그들:', tags);
        setAvailableTags(tags);
      } else {
        console.error('태그 목록 로드 실패:', response.status);
        setAvailableTags([]);
        alert('태그 목록을 불러오는데 실패했습니다. 관리자에게 문의해주세요.');
      }
    } catch (error) {
      console.error('태그 로드 중 오류:', error);
      setAvailableTags([]);
      alert('태그 목록을 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoadingTags(false);
    }
  };

  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    if (mood && moodKeywords[mood]) {
      searchWithMoodKeywords();
    } else {
      placesServiceRef.current.keywordSearch(
          keyword,
          placesSearchCB,
          { size: 15 }
      );
    }
  };

  const searchWithMoodKeywords = () => {
    const baseKeyword = keyword;
    const moodWords = moodKeywords[mood];
    let allResults = [];
    let searchCount = 0;
    const totalSearches = Math.min(3, moodWords.length);

    for (let i = 0; i < totalSearches; i++) {
      const searchQuery = `${baseKeyword} ${moodWords[i]}`;

      placesServiceRef.current.keywordSearch(
          searchQuery,
          (data, status) => {
            searchCount++;

            if (status === window.kakao.maps.services.Status.OK) {
              data.forEach(place => {
                const isDuplicate = allResults.some(existing =>
                    existing.place_name === place.place_name &&
                    existing.address_name === place.address_name
                );
                if (!isDuplicate) {
                  allResults.push(place);
                }
              });
            }

            if (searchCount === totalSearches) {
              if (allResults.length > 0) {
                allResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                const limitedResults = allResults.slice(0, 15);

                setPlaces(limitedResults);
                displayPlaces(limitedResults);
                document.getElementById('pagination').innerHTML = '';
              } else {
                alert(`"${mood}" 분위기의 "${keyword}" 검색 결과가 없습니다. 다른 키워드나 분위기를 시도해보세요.`);
                setPlaces([]);
                clearMarkers();
              }
            }
          },
          { size: 15 }
      );
    }
  };

  const placesSearchCB = (data, status, paginationData) => {
    if (status === window.kakao.maps.services.Status.OK) {
      setPlaces(data);
      setPagination(paginationData);
      displayPlaces(data);
      displayPagination(paginationData);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      setPlaces([]);
      setPagination(null);
      clearMarkers();
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const displayPlaces = (places) => {
    clearMarkers();
    const bounds = new window.kakao.maps.LatLngBounds();
    places.forEach((place, i) => {
      const pos = new window.kakao.maps.LatLng(place.y, place.x);
      bounds.extend(pos);
      addMarker(pos, i, place.place_name);
    });
    mapRef.current.setBounds(bounds);
  };

  const addMarker = (position, idx, title) => {
    const imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
      offset: new window.kakao.maps.Point(13, 37),
    };
    const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imgOptions
    );
    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
      map: mapRef.current,
    });

    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infowindowRef.current.setContent(
          `<div style="padding:5px;font-size:12px;">${title}</div>`
      );
      infowindowRef.current.open(mapRef.current, marker);
    });
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindowRef.current.close();
    });

    markersRef.current.push(marker);
  };

  const addSelectedMarker = (place) => {
    const position = new window.kakao.maps.LatLng(place.y, place.x);
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
      map: mapRef.current,
    });

    marker.placeInfo = {
      place_name: place.place_name,
      x: place.x,
      y: place.y
    };

    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindowRef.current.setContent(
          `<div style="padding:10px;font-size:13px;color:#FF6B6B;font-weight:bold;">
          ❤️ ${place.place_name}
        </div>`
      );
      infowindowRef.current.open(mapRef.current, marker);
    });

    selectedMarkersRef.current.push(marker);
    return marker;
  };

  const clearSelectedMarkers = () => {
    selectedMarkersRef.current.forEach(marker => marker.setMap(null));
    selectedMarkersRef.current = [];
  };

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  const displayPagination = (p) => {
    const container = document.getElementById('pagination');
    container.innerHTML = '';
    for (let i = 1; i <= p.last; i++) {
      const el = document.createElement('a');
      el.href = '#';
      el.innerText = i;
      if (i === p.current) {
        el.className = 'on';
      } else {
        el.onclick = (() => () => p.gotoPage(i))();
      }
      container.appendChild(el);
    }
  };

  const handlePlaceSelect = (place, isSelected, index) => {
    const placeId = `${place.place_name}_${place.x}_${place.y}`;

    if (isSelected) {
      const alreadySelected = selectedPlaces.some(p =>
          `${p.place_name}_${p.x}_${p.y}` === placeId
      );

      if (!alreadySelected) {
        setSelectedPlaces(prev => [...prev, place]);
        addSelectedMarker(place);
      }
      setCheckedItems(prev => new Set([...prev, index]));
    } else {
      setSelectedPlaces(prev => prev.filter(p =>
          `${p.place_name}_${p.x}_${p.y}` !== placeId
      ));
      setCheckedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      const markerToRemove = selectedMarkersRef.current.find(marker => {
        return marker.placeInfo &&
            marker.placeInfo.place_name === place.place_name &&
            marker.placeInfo.x === place.x &&
            marker.placeInfo.y === place.y;
      });

      if (markerToRemove) {
        markerToRemove.setMap(null);
        selectedMarkersRef.current = selectedMarkersRef.current.filter(marker => marker !== markerToRemove);
      }
    }
  };

  const clearAllSelections = () => {
    setSelectedPlaces([]);
    clearSelectedMarkers();
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
      routeLineRef.current = null;
    }
  };

  const displayRoute = () => {
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
    }

    if (selectedPlaces.length < 2) return;

    const routeCoords = selectedPlaces.map(place =>
        new window.kakao.maps.LatLng(place.y, place.x)
    );

    const routeLine = new window.kakao.maps.Polyline({
      path: routeCoords,
      strokeWeight: 4,
      strokeColor: '#FF6B6B',
      strokeOpacity: 0.8,
      strokeStyle: 'solid'
    });

    routeLine.setMap(mapRef.current);
    routeLineRef.current = routeLine;

    const bounds = new window.kakao.maps.LatLngBounds();
    routeCoords.forEach(coord => bounds.extend(coord));
    mapRef.current.setBounds(bounds);
  };

  const clearRoute = () => {
    clearAllSelections();
  };

  useEffect(() => {
    displayRoute();
  }, [selectedPlaces]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchPlaces();
  };

  // 기존 공유 관련 함수들...
  const openShareModal = () => {
    if (selectedPlaces.length === 0) {
      alert('공유할 데이트 코스를 먼저 선택해주세요!');
      return;
    }

    const courseTitle = `${keyword} 데이트 코스 (${selectedPlaces.length}곳)`;
    const courseContent = generateCourseContent();

    let initialTags = [];

    if (availableTags.includes('데이트코스')) {
      initialTags.push('데이트코스');
    }

    if (mood && availableTags.includes(mood)) {
      initialTags.push(mood);
    }

    setShareForm({
      title: courseTitle,
      content: courseContent,
      tags: initialTags
    });
    setSelectedTags(initialTags);
    setShowShareModal(true);
  };

  const generateCourseContent = () => {
    let content = `✨ ${keyword}에서의 특별한 데이트 코스를 공유합니다!\n\n`;

    if (mood) {
      content += `🎯 분위기: ${mood}\n\n`;
    }

    content += `📍 코스 순서:\n`;
    selectedPlaces.forEach((place, index) => {
      content += `${index + 1}. ${place.place_name}\n`;
      content += `   📍 ${place.road_address_name || place.address_name}\n`;
      if (place.phone) {
        content += `   📞 ${place.phone}\n`;
      }
      content += `\n`;
    });

    content += `\n💕 총 ${selectedPlaces.length}개의 장소로 구성된 데이트 코스입니다.\n`;
    content += `즐거운 데이트 되세요! 🥰`;

    return content;
  };

  const handleShareFormChange = (field, value) => {
    setShareForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
          ? prev.filter(t => t !== tag)
          : [...prev, tag];

      setShareForm(prevForm => ({
        ...prevForm,
        tags: newTags
      }));

      return newTags;
    });
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      const newTag = customTag.trim();
      setSelectedTags(prev => [...prev, newTag]);
      setShareForm(prevForm => ({
        ...prevForm,
        tags: [...prevForm.tags, newTag]
      }));
      setCustomTag('');
    }
  };

  const handleCustomTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const getRecommendedTags = () => {
    const moodMapping = {
      '로맨틱': ['데이트코스', '로맨틱', '야경', '뷰맛집', '분위기'],
      '아늑한': ['데이트코스', '아늑한', '카페', '힐링', '조용한'],
      '야경': ['데이트코스', '야경', '뷰맛집', '로맨틱', '분위기']
    };

    const recommendedTagNames = moodMapping[mood] || ['데이트코스'];
    return availableTags.filter(tag => recommendedTagNames.includes(tag));
  };

  const submitDateCourse = async () => {
    if (!shareForm.title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }

    if (!shareForm.content.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    setIsSharing(true);

    try {
      const response = await fetch('http://localhost:8080/forum/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: shareForm.title,
          content: shareForm.content,
          tags: selectedTags
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('🎉 데이트 코스가 성공적으로 공유되었습니다!');
        setShowShareModal(false);
      } else {
        throw new Error(`서버 오류: ${response.status}`);
      }
    } catch (error) {
      console.error('공유 중 오류:', error);
      alert('공유 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareForm({ title: '', content: '', tags: [] });
    setSelectedTags([]);
    setCustomTag('');
  };

  return (
      <div className="recommend-container">
        <h2>
          <img
              src={mapIcon}
              alt="지도 아이콘"
              style={{
                width: '1.4em',
                verticalAlign: 'middle',
                marginRight: '0.4rem'
              }}
          />장소 검색 & 데이트 코스</h2>
        <div className="map_wrap">
          {/* 왼쪽: 검색 결과 리스트 */}
          <div id="results_wrap" className="bg_white">
            <div style={{ padding: '10px', fontSize: '12px', color: '#666', borderBottom: '1px solid #eee' }}>
              {mood ? `"${mood}" 분위기의 "${keyword}" 검색 결과` : `"${keyword}" 검색 결과`}
              <span style={{ float: 'right' }}>총 {places.length}개</span>
            </div>
            <ul id="placesList">
              {places.map((place, i) => {
                const placeId = `${place.place_name}_${place.x}_${place.y}`;
                const isAlreadySelected = selectedPlaces.some(p =>
                    `${p.place_name}_${p.x}_${p.y}` === placeId
                );

                return (
                    <li key={i} className={`item marker_${i + 1}`}>
                      <label className="heart-checkbox" htmlFor={`place_${i}`}>
                        <input
                            type="checkbox"
                            id={`place_${i}`}
                            checked={isAlreadySelected}
                            onChange={(e) => handlePlaceSelect(place, e.target.checked, i)}
                        />
                        <div className="heart">
                          {isAlreadySelected ? '❤️' : '🤍'}
                        </div>
                      </label>
                      <span className="markerbg"></span>
                      <div className="info">
                        <h5>
                          <label htmlFor={`place_${i}`} style={{ cursor: 'pointer' }}>
                            {place.place_name}
                            {isAlreadySelected && <span style={{ color: '#FF6B6B', marginLeft: '5px' }}>✨</span>}
                          </label>
                        </h5>
                        <span>
                      {place.road_address_name || place.address_name}
                    </span>
                        {place.phone && <span className="tel">{place.phone}</span>}
                        {place.distance && (
                            <span style={{ fontSize: '11px', color: '#999' }}>
                        {Math.round(place.distance)}m
                      </span>
                        )}
                      </div>
                    </li>
                );
              })}
            </ul>
            <div id="pagination"></div>
          </div>

          {/* 중앙: 지도 */}
          <div id="map"></div>

          {/* 오른쪽: 검색 폼 */}
          <div id="menu_wrap" className="bg_white">
            <div className="option">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label>키워드:</label>
                  <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="검색어를 입력하세요 (예: 홍대)"
                  />
                </div>
                <div>
                  <label>분위기:</label>
                  <select value={mood} onChange={(e) => setMood(e.target.value)}>
                    <option value="">전체</option>
                    <option value="로맨틱">로맨틱</option>
                    <option value="아늑한">아늑한</option>
                    <option value="야경">야경</option>
                  </select>
                </div>
                <button type="button" onClick={searchPlaces}>검색하기</button>
              </div>
            </div>

            {/* 선택된 장소 및 경로 관리 */}
            <div style={{
              marginTop: '20px',
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '0'
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(248, 113, 182, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(248, 113, 182, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <div style={{
                  marginBottom: '12px',
                  fontWeight: '700',
                  color: '#1a202c',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>💕 나의 데이트 코스</span>
                  <span style={{
                    fontSize: '12px',
                    color: '#f472b6',
                    fontWeight: '600'
                  }}>
                  {selectedPlaces.length}개 장소
                </span>
                </div>

                {selectedPlaces.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '13px',
                      padding: '40px 20px',
                      flex: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
                      <div>장소를 선택하여</div>
                      <div>데이트 코스를 만들어보세요!</div>
                    </div>
                ) : (
                    <>
                      <div style={{
                        flex: '1',
                        overflowY: 'auto',
                        marginBottom: '12px',
                        paddingRight: '4px'
                      }} className="selected-places-scroll">
                        {selectedPlaces.map((place, idx) => (
                            <div key={idx} style={{
                              marginBottom: '8px',
                              padding: '8px 12px',
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              border: '1px solid rgba(248, 113, 182, 0.1)',
                              fontSize: '12px'
                            }}>
                              <div style={{
                                fontWeight: '600',
                                color: '#f472b6',
                                marginBottom: '4px'
                              }}>
                                {idx + 1}. {place.place_name}
                              </div>
                              <div style={{
                                color: '#6b7280',
                                fontSize: '11px',
                                lineHeight: '1.3'
                              }}>
                                {place.road_address_name || place.address_name}
                              </div>
                            </div>
                        ))}
                      </div>

                      {selectedPlaces.length >= 2 && (
                          <div style={{
                            color: '#f472b6',
                            fontSize: '11px',
                            marginBottom: '12px',
                            textAlign: 'center',
                            fontWeight: '600'
                          }}>
                            ✨ 경로가 지도에 표시되었습니다
                          </div>
                      )}

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <button
                            onClick={openShareModal}
                            className="share-course-button"
                        >
                          📝 게시판에 공유하기
                        </button>

                        <button
                            onClick={clearRoute}
                            style={{
                              padding: '10px 16px',
                              fontSize: '12px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              width: '100%'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                        >
                          🗑️ 모든 선택 초기화
                        </button>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✨ 새로 추가: AI 추천 섹션 (지도 아래) */}
        <div
            className="ai-section"
            style={{
              margin: '2rem 0',
              padding: '3rem 2rem',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              letterSpacing: '-0.02em'
            }}>
              <img
                  src={AiIcon}
                  alt="ai 아이콘"
                  style={{
                    width: '1.4em',
                    verticalAlign: 'middle',
                    marginRight: '0.4rem'
                  }}
              /> AI 블로그 검색 장소 추천
            </h3>

            <p style={{
              color: '#4b5563',
              fontSize: '1.1rem',
              marginBottom: '2rem',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              AI가 블로그와 리뷰를 검색해서 <span style={{
              color: '#10b981',
              fontWeight: '700',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>"{keyword}"</span>
              {mood && <> <span style={{
                color: '#3b82f6',
                fontWeight: '700',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '2px 8px',
                borderRadius: '6px',
                marginLeft: '4px'
              }}>"{mood}"</span> 분위기</>}의 완벽한 데이트 장소를 추천해드려요!
            </p>

            {/* AI 추천 버튼 - 큰 사이즈 */}
            <button
                className="ai-button"
                onClick={handleAiRecommendation}
                disabled={aiLoading}
                style={{
                  background: aiLoading ?
                      'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' :
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: '2px solid transparent',
                  borderRadius: '20px',
                  padding: '24px 48px',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: aiLoading ?
                      '0 8px 25px rgba(156, 163, 175, 0.3)' :
                      '0 12px 35px rgba(16, 185, 129, 0.4)',
                  transform: aiLoading ? 'none' : 'translateY(0)',
                  margin: '0 auto',
                  minWidth: '320px',
                  position: 'relative',
                  overflow: 'hidden',
                  letterSpacing: '-0.01em'
                }}
                onMouseOver={(e) => {
                  if (!aiLoading) {
                    e.target.style.transform = 'translateY(-4px) scale(1.03)';
                    e.target.style.boxShadow = '0 16px 45px rgba(16, 185, 129, 0.5)';
                    e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!aiLoading) {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                    e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                  }
                }}
            >
              {/* 버튼 배경 효과 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.6s ease',
                pointerEvents: 'none'
              }}></div>

              {aiLoading ? (
                  <>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    AI가 블로그를 검색 중입니다...
                  </>
              ) : (
                  <>
                    <span style={{ fontSize: '1.4rem' }}>🤖</span>
                    AI 장소 추천받기
                  </>
              )}
            </button>
          </div>

          {/* AI 추천 결과 표시 영역 */}
          {showAiResult && (
              <div
                  className="ai-result-enter ai-result"
                  style={{
                    marginTop: '3rem',
                    padding: '2.5rem',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '20px',
                    border: '2px solid rgba(16, 185, 129, 0.2)',
                    position: 'relative',
                    textAlign: 'left',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
                    overflow: 'hidden'
                  }}>
                {/* 배경 장식 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}></div>

                <button
                    onClick={closeAiResult}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '2px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#ef4444',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      zIndex: 2
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                >
                  ✕
                </button>

                <div style={{
                  marginBottom: '2rem',
                  fontWeight: '800',
                  fontSize: '1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  position: 'relative',
                  zIndex: 1,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  <span style={{ fontSize: '1.6rem' }}></span>
                  <span><img
                      src={placeIcon}
                      alt="ai 아이콘"
                      style={{
                        width: '1.4em',
                        verticalAlign: 'middle',
                        marginRight: '0.4rem'
                      }}
                  />AI 추천 결과</span>
                </div>

                <div style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  color: '#374151',
                  maxHeight: '450px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-line',
                  padding: '1.5rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {aiRecommendation}
                </div>

                <div style={{
                  marginTop: '2rem',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  color: '#059669',
                  textAlign: 'center',
                  fontWeight: '600',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  💡 AI가 실시간으로 블로그와 리뷰를 검색해서 추천한 결과입니다
                </div>
              </div>
          )}
        </div>

        {/* CSS 애니메이션 추가 */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .ai-result-enter {
            animation: fadeInUp 0.5s ease-out;
          }
          
          @media (max-width: 768px) {
            .ai-section h3 {
              font-size: 1.5rem !important;
            }
            
            .ai-section p {
              font-size: 1rem !important;
            }
            
            .ai-button {
              padding: 20px 32px !important;
              font-size: 1.1rem !important;
              min-width: 280px !important;
            }
            
            .ai-result {
              padding: 2rem !important;
              margin-top: 2rem !important;
            }
          }
        `}</style>

        {/* 공유하기 모달... */}
        {showShareModal && (
            <div className="share-modal-overlay" onClick={closeShareModal}>
              <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <button
                    className="share-modal-close"
                    onClick={closeShareModal}
                >
                  ✕
                </button>

                <div className="share-modal-header">
                  <h2 className="share-modal-title">데이트 코스 공유하기</h2>
                  <p className="share-modal-subtitle">다른 커플들과 특별한 데이트 코스를 공유해보세요!</p>
                </div>

                <div className="course-preview">
                  <div className="course-preview-title">
                    <span>📍</span>
                    <span>선택된 데이트 코스 ({selectedPlaces.length}곳)</span>
                  </div>
                  {selectedPlaces.map((place, idx) => (
                      <div key={idx} className="course-place-item">
                        <div className="course-place-name">
                          {idx + 1}. {place.place_name}
                        </div>
                        <div className="course-place-address">
                          {place.road_address_name || place.address_name}
                        </div>
                      </div>
                  ))}
                </div>

                <div className="share-form">
                  <div className="share-form-group">
                    <label className="share-form-label">게시글 제목</label>
                    <input
                        type="text"
                        className="share-form-input"
                        value={shareForm.title}
                        onChange={(e) => handleShareFormChange('title', e.target.value)}
                        placeholder="데이트 코스 제목을 입력해주세요"
                    />
                  </div>

                  <div className="share-form-group">
                    <label className="share-form-label">상세 설명</label>
                    <textarea
                        className="share-form-textarea"
                        value={shareForm.content}
                        onChange={(e) => handleShareFormChange('content', e.target.value)}
                        placeholder="데이트 코스에 대한 상세한 설명을 추가해주세요..."
                    />
                  </div>

                  <div className="tag-section">
                    <label className="share-form-label">
                      태그 선택
                      {loadingTags && <span className="tag-loading"> (로딩 중...)</span>}
                    </label>

                    <div className="tag-container">
                      {availableTags.map(tag => (
                          <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`tag-button ${selectedTags.includes(tag) ? 'tag-selected' : ''}`}
                          >
                            {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                          </button>
                      ))}
                    </div>

                    {selectedTags.length > 0 && (
                        <div className="selected-tags-preview">
                          <div className="selected-tags-label">
                            선택된 태그 ({selectedTags.length}개):
                          </div>
                          <div className="selected-tags-display">
                            {selectedTags.join(', ')}
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="share-button-group">
                    <button
                        type="button"
                        className="share-button share-button-cancel"
                        onClick={closeShareModal}
                    >
                      취소
                    </button>
                    <button
                        type="button"
                        className="share-button share-button-submit"
                        onClick={submitDateCourse}
                        disabled={isSharing}
                    >
                      {isSharing ? (
                          <>
                            <span className="loading-spinner"></span>
                            공유 중...
                          </>
                      ) : (
                          '🎉 공유하기'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}