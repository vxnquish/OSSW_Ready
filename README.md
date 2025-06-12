# 💘 RUREADYIMREADY

> 연애에 어려움을 겪는 사람들을 위한 종합 연애 플랫폼  
> 연애 상담 AI와 데이트 장소 추천 기능을 제공합니다.

---

## 🧩 주요 기능

- 🤖 **연애 상담**: 사용자의 고민을 입력받아, API와 연동해 AI가 자연스러운 조언을 제공합니다. 
 🔗 API 경로: POST /api/ai/consult


- 🗺️ **데이트 장소 추천**: 원하는 지역을 입력하면, 카카오맵 API와 연동하여 연인과 가기 좋은 추천 장소 리스트를 제공합니다. 
 🔗 API 경로: GET /api/place/recommend?location=이태원

---

## 🔄 기능 흐름도

Lovemap의 핵심 기능은 다음과 같은 흐름으로 작동합니다:

### **공통 흐름도**
[사용자 입력]
   ↓
[프론트엔드 (React)] 
   ↓
[백엔드 (Spring Boot)]
   ↓
[외부 API (GPT / Kakao)]
   ↓
[결과 응답]
   ↓
[프론트 UI 출력]

### 🤖 **연애 상담 기능 흐름도**
1. 🧍 사용자: 고민 입력
   └ 예: "고백하고 싶은데 타이밍을 못 잡겠어요"

2. 💻 프론트엔드: 입력값을 백엔드로 전송
   └ `POST /api/ai/consult`

3. 🧠 백엔드: Spring Boot 서버에서  API 호출
   └ 외부 연동: Together.ai (Groq 기반)

4. 🤖 AI 응답 수신
   └ 예: "상대의 반응을 보며 자연스럽게 대화를 시작해보세요."

5. 📱 프론트엔드: 사용자 화면에 응답 출력
   └ 대화 형태로 시각화

### 🗺️ **데이트 장소 추천 기능 흐름도**
1. 🧍 사용자: 지역 키워드 입력
   └ 예: "이태원"

2. 💻 프론트엔드: 입력값을 백엔드로 전송
   └ `GET /api/place/recommend?location=이태원`

3. 🌐 백엔드: Kakao Map API 호출
   └ 키워드 기반 장소 데이터 수집

4. 📦 백엔드: 장소 데이터 가공
   └ 장소명, 카테고리, 주소 등 추출

5. 📱 프론트엔드: 추천 장소 리스트 출력
   └ 카드 UI 형태로 사용자에게 제공

---

## 🛠️ 사용된 기술 스택

| 구분 | 기술 | 설명 |
|------|------|------|
| **프론트엔드** | React + Vite | 빠른 개발과 HMR을 위한 환경 구성 |
|  | JavaScript (JSX), CSS | UI/UX 구성 |
| **백엔드** | Java 17 + Spring Boot | REST API 서버 구축축|
|  | Gradle | Java 빌드 및 의존성 관리 |
| **API 연동** | Together.ai | GPT 기반 무료 AI API |
|  | Kakao | 카카오맵과 연동, 장소 검색 + 장소 기반 추천 |
| **HTTP 통신** | OkHttp, Gson | 외부 API 요청 및 JSON 파싱 |
| **패키지 매니저** | npm | 프론트엔드 의존성 관리 |
| **IDE** | VSCode | 전체 개발 환경 |
| **형상 관리** | GitHub | 프로젝트 버전 관리 및 협업 |
|  | Notion | 문서화 작업 및 의사소통 |

---

## 🚀 실행 방법

1. 백엔드 실행
```bash
- cd backend
- ./gradlew build   # 의존성 설치 + 빌드
- ./gradlew bootRun # 실행
```

2. 프론트엔드 실행
```bash
- cd frontend
- npm install       # 의존성 설치 (최초 1회)
- npm run dev       # 실행
```

---

## 🧪 사용 예시

- 💬 **연애 상담 예시**  
  > "고백하고 싶은데 타이밍을 못 잡겠어요."  
  → `그 사람의 관심사를 자연스럽게 이야기하다가 타이밍을 잡아보세요!`

- 📍 **데이트 코스 예시**  
  > '이태원 맛집'
  → 추천 장소: 카카오맵과 연동되어 추천 장소 표시

---

## 📂 프로젝트 구조

```bash
📁 frontend/
  └── src/
      ├── api/            # 백엔드 API 통신
      ├── pages/          # 주요 페이지 (Chat, Recommend)
      ├── App.jsx, main.jsx

📁 backend/
  ├── src/main/java/
      └── controller/     # REST 컨트롤러
      └── service/        # 비즈니스 로직
```

---

## 📌 설치 필요 요소

| 도구 | 용도 | 설치 링크 |
|------|------|-----------|
| Java 17+ | 백엔드 실행 |
| Gradle | 빌드 도구 |
| Node.js & npm | 프론트 실행 |
| VSCode | 에디터 | 

---

## 🧑‍💻 오픈소스 활용

- React, Vite, Spring Boot, Gradle 등 오픈소스 프레임워크 사용
- OkHttp, Gson (오픈소스 HTTP/JSON 라이브러리)
- 무료 AI API
- 카카오맵 API

---

## 🤝 기여 방법

1. 이슈 확인 후 Fork
2. 기능 개발 후 PR 요청
3. README 및 문서화 개선도 환영합니다!

---

## 📘 프로젝트 문서

- Notion 개발 문서: [https://www.notion.so1c77bda011fc8077b798d3d1e670c45e?v=1c87bda011fc80f39b96000c9f89c35d&source=copy_link]

---

## 🎥 시연 영상

- YouTube: []

---

## 📄 라이선스

> 본 프로젝트는 [MIT License](./LICENSE)를 따릅니다.

