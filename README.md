# 💘 RUREADYIMREADY

> 연애에 어려움을 겪는 사람들을 위한 종합 연애 플랫폼  
> 연애 상담 AI와 데이트 장소 추천 기능을 제공합니다.

---

## 🧩 주요 기능

- 🤖 **연애 상담**: 사용자의 고민을 AI가 분석하고, 공감 어린 조언을 제공합니다.
- 🗺️ **데이트 장소 추천**: 원하는 지역을 입력하면, 연인과 가기 좋은 장소를 추천합니다.

---

## 🛠️ 사용된 기술 스택

| 구분 | 기술 | 설명 |
|------|------|------|
| **프론트엔드** | React + Vite | 빠른 개발과 HMR을 위한 환경 구성 |
|  | JavaScript (JSX), CSS | UI/UX 구성 |
| **백엔드** | Java + Spring Boot | REST API 서버 |
|  | Maven | Java 빌드 및 의존성 관리 |
| **API 연동** | Together.ai | GPT 기반 무료 AI API |
|  | Kakao | 카카오맵과 연동 |
| **HTTP 통신** | OkHttp, Gson | 외부 API 요청 및 JSON 파싱 |
| **패키지 매니저** | npm | 프론트엔드 의존성 관리 |
| **IDE** | VSCode | 전체 개발 환경 |
| **형상 관리** | GitHub | 프로젝트 버전 관리 및 협업 |
|  | Notion | 문서화 작업 및 의사소통 |

---

## 🚀 실행 방법

새로운 터미널에
```bash
- cd backend
- ./gradlew bootRun
```

새로운 터미널에
```bash
- cd frontend
- npm run dev
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
| Java 11+ | 백엔드 실행 |
| Maven | 빌드 도구 |
| Node.js & npm | 프론트 실행 |
| VSCode | 에디터 | 

---

## 🧑‍💻 오픈소스 활용

- React, Vite, Spring Boot, Maven 등 오픈소스 프레임워크 사용
- OkHttp, Gson (오픈소스 HTTP/JSON 라이브러리)
- 무료 AI API
- 카카오맵 API

---

## 🤝 기여 방법

1. 이슈 확인 후 Fork
2. 기능 개발 후 PR 요청
3. README 및 문서화 개선도 환영합니다!

---

## 📄 라이선스

> 본 프로젝트는 MIT 라이선스를 따릅니다.