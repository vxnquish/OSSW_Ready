// src/pages/Recommend.jsx
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
    let query = keyword;
    if (mood) query += ` ${mood}`;
    if (!query.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }
    placesServiceRef.current.keywordSearch(
      query,
      placesSearchCB,
      { size: 15 }
    );
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
        `<div style="padding:5px;">${title}</div>`
      );
      infowindowRef.current.open(mapRef.current, marker);
    });
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindowRef.current.close();
    });

    markersRef.current.push(marker);
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
          <ul id="placesList">
            {places.map((place, i) => (
                <li key={i} className={`item marker_${i + 1}`}>
                <span className="markerbg"></span>
                <div className="info">
                  <h5>{place.place_name}</h5>
                  <span>
                    {place.road_address_name || place.address_name}
                  </span>
                  {place.phone && <span className="tel">{place.phone}</span>}
                </div>
              </li>
            ))}
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
                placeholder="검색어를 입력하세요"
              />
              <label>분위기:</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="">선택</option>
                <option value="로맨틱">로맨틱</option>
                <option value="아늑한">아늑한</option>
                <option value="야경">야경</option>
              </select>
              <button type="submit">검색하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>
);
}
