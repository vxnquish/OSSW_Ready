// src/pages/Recommend.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Recommend.css';

export default function Recommend() {
  const [keyword, setKeyword] = useState('이태원 맛집');
  const [mood, setMood] = useState('');
  const [budget, setBudget] = useState('');
  const [places, setPlaces] = useState([]);
  const [pagination, setPagination] = useState(null);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);
  const infowindowRef = useRef(null);
  const markersRef = useRef([]);

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
    // 최초 자동 검색
    searchPlaces();
  }, []);

  const searchPlaces = () => {
    // 키워드 + 분위기 + 예산을 합쳐서 쿼리 생성
    let query = keyword;
    if (mood) query += ` ${mood}`;
    if (budget) query += ` 예산${budget}원`;

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
        `<div style="padding:5px;">${title}</div>`
      );
      infowindowRef.current.open(mapRef.current, marker);
    });
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindowRef.current.close();
    });

    markersRef.current.push(marker);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchPlaces();
  };

  return (
    <div className="recommend-container">
      <h2>🗺️ 장소 검색 & 데이트 코스</h2>
      <div className="map_wrap">
        <div
          id="map"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        ></div>
        <div id="menu_wrap" className="bg_white">
          <div className="option">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                searchPlaces();
              }}
            >
              키워드: {' '}
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                size="10"
                onKeyDown={handleKeyDown}
              />{' '}
              분위기: {' '}
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">선택</option>
                <option value="로맨틱">로맨틱</option>
                <option value="아늑한">아늑한</option>
                <option value="야경">야경</option>
              </select>{' '}
              예산(원): {' '}
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="예:50000"
                size="7"
              />{' '}
              <button type="submit">검색하기</button>
            </form>
          </div>
          <hr />
          <ul id="placesList">
            {places.map((place, i) => (
              <li key={i} className={`item marker_${i + 1}`}>
                <span className="markerbg"></span>
                <div className="info">
                  <h5>{place.place_name}</h5>
                  <span>
                    {place.road_address_name || place.address_name}
                  </span>
                  {place.phone && (
                    <span className="tel">{place.phone}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div id="pagination"></div>
        </div>
      </div>
    </div>
  );
}
