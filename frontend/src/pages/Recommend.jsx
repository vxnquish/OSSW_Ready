import React, { useState, useEffect, useRef } from 'react';
import './Recommend.css';
import mapIcon from '../../icons/lovemap.png';

export default function Recommend() {
  // 검색 키워드 상태 (기본값: '홍대 데이트')
  const [keyword, setKeyword] = useState('홍대 데이트');
  // 분위기 필터 상태
  const [mood, setMood] = useState('');
  // 검색 결과 장소 데이터 배열 상태
  const [places, setPlaces] = useState([]);
  // 페이지네이션 정보 상태
  const [pagination, setPagination] = useState(null);
  // 카카오 지도 객체 참조용
  const mapRef = useRef(null);
  // 카카오 장소 검색 서비스 참조용
  const placesServiceRef = useRef(null);
  // 인포윈도우 참조용
  const infowindowRef = useRef(null);
  // 생성된 마커들 참조용
  const markersRef = useRef([]);
  // 선택된 장소들 상태
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  // 경로 폴리라인 참조용
  const routeLineRef = useRef(null);
  // 선택된 장소 마커들 참조용
  const selectedMarkersRef = useRef([]);
  // 체크박스 상태 관리
  const [checkedItems, setCheckedItems] = useState(new Set());

  // 분위기별 키워드 매핑
  const moodKeywords = {
    '로맨틱': ['로맨틱', '데이트', '분위기', '커플', '낭만', '뷰맛집', '야경맛집', '감성'],
    '아늑한': ['아늑한', '조용한', '프라이빗', '힐링', '카페', '북카페', '소규모', '인테리어'],
    '야경': ['야경', '뷰', '루프탑', '스카이', '전망', '야간', '밤', '뷰맛집', '옥상']
  };

  // 컴포넌트 마운트 시 지도 초기화 및 첫 검색 실행
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

  // 키워드와 분위기를 조합해 장소 검색 실행
  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    // 분위기가 선택된 경우 관련 키워드들로 여러 번 검색
    if (mood && moodKeywords[mood]) {
      searchWithMoodKeywords();
    } else {
      // 기본 검색
      placesServiceRef.current.keywordSearch(
          keyword,
          placesSearchCB,
          { size: 15 }
      );
    }
  };

  // 분위기별 키워드로 검색
  const searchWithMoodKeywords = () => {
    const baseKeyword = keyword;
    const moodWords = moodKeywords[mood];
    let allResults = [];
    let searchCount = 0;
    const totalSearches = Math.min(3, moodWords.length); // 최대 3개의 키워드 조합으로 검색

    // 여러 키워드 조합으로 검색
    for (let i = 0; i < totalSearches; i++) {
      const searchQuery = `${baseKeyword} ${moodWords[i]}`;

      placesServiceRef.current.keywordSearch(
          searchQuery,
          (data, status) => {
            searchCount++;

            if (status === window.kakao.maps.services.Status.OK) {
              // 중복 제거를 위해 place_name과 address_name 기준으로 필터링
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

            // 모든 검색이 완료되면 결과 표시
            if (searchCount === totalSearches) {
              if (allResults.length > 0) {
                // 거리순으로 정렬 (가까운 순)
                allResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                // 최대 15개로 제한
                const limitedResults = allResults.slice(0, 15);

                setPlaces(limitedResults);
                displayPlaces(limitedResults);
                // 페이지네이션은 단순화 (분위기 검색 시에는 페이지네이션 비활성화)
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

  // 검색 콜백 함수
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

  // 지도에 마커 표시
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

  // 단일 마커 생성
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

  // 선택된 장소용 특별한 마커 생성
  const addSelectedMarker = (place) => {
    const position = new window.kakao.maps.LatLng(place.y, place.x);

    // 하트 모양의 핑크색 마커 이미지
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    const marker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
      map: mapRef.current,
    });

    // 마커에 장소 정보 저장 (제거 시 식별용)
    marker.placeInfo = {
      place_name: place.place_name,
      x: place.x,
      y: place.y
    };

    // 선택된 마커 클릭 시 정보 표시
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

  // 선택된 마커들 삭제
  const clearSelectedMarkers = () => {
    selectedMarkersRef.current.forEach(marker => marker.setMap(null));
    selectedMarkersRef.current = [];
  };

  // 기존 마커 삭제
  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  // 페이지네이션 UI 생성
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

  // 장소 선택/해제 핸들러
  const handlePlaceSelect = (place, isSelected, index) => {
    // 고유 ID 생성 (장소명 + 좌표로 중복 방지)
    const placeId = `${place.place_name}_${place.x}_${place.y}`;

    if (isSelected) {
      // 이미 선택된 장소인지 확인 (다른 검색 결과에서 같은 장소 선택 방지)
      const alreadySelected = selectedPlaces.some(p =>
          `${p.place_name}_${p.x}_${p.y}` === placeId
      );

      if (!alreadySelected) {
        setSelectedPlaces(prev => [...prev, place]);
        addSelectedMarker(place);
      }
      setCheckedItems(prev => new Set([...prev, index]));
    } else {
      // 선택 해제 시 장소와 마커 제거
      setSelectedPlaces(prev => prev.filter(p =>
          `${p.place_name}_${p.x}_${p.y}` !== placeId
      ));
      setCheckedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      // 해당 선택된 마커 제거 (더 정확한 방법)
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

  // 모든 선택 상태 초기화
  const clearAllSelections = () => {
    setSelectedPlaces([]);
    clearSelectedMarkers();
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
      routeLineRef.current = null;
    }
  };

  // 선택된 장소들로 경로 표시
  const displayRoute = () => {
    // 기존 경로 삭제
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
    }

    if (selectedPlaces.length < 2) return;

    // 선택된 장소들의 좌표로 경로 생성
    const routeCoords = selectedPlaces.map(place =>
        new window.kakao.maps.LatLng(place.y, place.x)
    );

    // 폴리라인 생성
    const routeLine = new window.kakao.maps.Polyline({
      path: routeCoords,
      strokeWeight: 4,
      strokeColor: '#FF6B6B',
      strokeOpacity: 0.8,
      strokeStyle: 'solid'
    });

    routeLine.setMap(mapRef.current);
    routeLineRef.current = routeLine;

    // 선택된 장소들이 모두 보이도록 지도 범위 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    routeCoords.forEach(coord => bounds.extend(coord));
    mapRef.current.setBounds(bounds);
  };

  // 경로 초기화
  const clearRoute = () => {
    clearAllSelections();
  };

  // 선택된 장소가 변경될 때마다 경로 업데이트
  useEffect(() => {
    displayRoute();
  }, [selectedPlaces]);

  // 엔터 키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchPlaces();
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
                // 현재 장소가 이미 선택되어 있는지 확인
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
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    searchPlaces();
                  }}
              >
                <label>키워드:</label>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="검색어를 입력하세요 (예: 홍대 데이트)"
                />
                <label>분위기:</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)}>
                  <option value="">전체</option>
                  <option value="로맨틱">로맨틱</option>
                  <option value="아늑한">아늑한</option>
                  <option value="야경">야경</option>
                </select>
                <button type="submit">검색하기</button>
              </form>
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
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}