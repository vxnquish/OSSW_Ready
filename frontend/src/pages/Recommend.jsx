// src/pages/Recommend.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Recommend.css';

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
    // 지도 영역을 렌더링할 컨테이너 가져오기
    const container = document.getElementById('map');
    // 초기 지도 중심 좌표 및 레벨 설정
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3
    };
    // 지도 객체 생성 및 저장
    mapRef.current = new window.kakao.maps.Map(container, options);
    // 장소 검색 서비스 생성 및 저장
    placesServiceRef.current = new window.kakao.maps.services.Places();
    // 인포윈도우 생성 및 저장 (zIndex 설정)
    infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    // 최초 자동 검색 호출
    searchPlaces();
  }, []);

  // 키워드와 분위기를 조합해 장소 검색 실행
  const searchPlaces = () => {
    // 기본 키워드 설정
    let query = keyword;
    // 분위기가 선택된 경우 키워드에 추가
    if (mood) query += ` ${mood}`;

    // 빈 키워드인 경우 경고
    if (!query.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    // 장소 검색 서비스에 키워드로 검색 요청 (size: 한 페이지 결과 수)
    placesServiceRef.current.keywordSearch(
      query,
      placesSearchCB,
      { size: 15 }
    );
  };

  // 검색 콜백 함수: 상태에 따라 처리 분기
  const placesSearchCB = (data, status, paginationData) => {
    if (status === window.kakao.maps.services.Status.OK) {
      // 검색 결과가 있을 때 상태 업데이트 및 표시 함수 호출
      setPlaces(data);
      setPagination(paginationData);
      displayPlaces(data);
      displayPagination(paginationData);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      // 결과 없음
      alert('검색 결과가 존재하지 않습니다.');
      setPlaces([]);
      setPagination(null);
      clearMarkers();
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      // 오류 발생
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  // 지도에 검색된 장소 마커 표시 및 지도 범위 조정
  const displayPlaces = (places) => {
    clearMarkers();
    const bounds = new window.kakao.maps.LatLngBounds();
    places.forEach((place, i) => {
      const pos = new window.kakao.maps.LatLng(place.y, place.x);
      bounds.extend(pos);
      addMarker(pos, i, place.place_name);
    });
    // 지도 뷰를 검색된 모든 마커가 보이도록 설정
    mapRef.current.setBounds(bounds);
  };

  // 단일 마커 생성 및 이벤트 리스너 등록
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

    // 마커 호버 시 인포윈도우 열기
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infowindowRef.current.setContent(
        `<div style="padding:5px;">${title}</div>`
      );
      infowindowRef.current.open(mapRef.current, marker);
    });
    // 마커 마우스아웃 시 인포윈도우 닫기
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindowRef.current.close();
    });

    markersRef.current.push(marker);
  };

  // 기존 마커 모두 삭제
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

  // 엔터 키로 검색 기능 호출
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchPlaces();
  };

  // 화면에 렌더링할 JSX 반환
  return (
    <div className="recommend-container">
      <h2>🗺️ 장소 검색 & 데이트 코스</h2>
      <div className="map_wrap">
        {/* 지도 영역 */}
        <div
          id="map"
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
        ></div>
        {/* 검색 폼 및 결과 리스트 영역 */}
        <div id="menu_wrap" className="bg_white">
          {/* 검색 폼 */}
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
              <button type="submit">검색하기</button>
            </form>
          </div>
          <hr />
          {/* 검색 결과 리스트 */}
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
          {/* 페이지네이션 */}
          <div id="pagination"></div>
        </div>
      </div>
    </div>
  );
}
