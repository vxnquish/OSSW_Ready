# 💘 LOVEMAP - RUREADYIMREADY

> 💑 연애에 어려움을 겪는 사람들을 위한 종합 연애 플랫폼  
> 🧠 연애 상담 AI 🗺️ 데이트 장소 추천 💬 익명게시판 기능을 제공합니다.

---

누구나 한 번쯤은  
💭 "고백하고 싶은데, 타이밍을 어떻게 잡지?"  
📍 "이번 주 데이트는 어디서 하지?"  
🫣 "나만 이런 고민을 하는 걸까?"  
이런 생각을 해본 적이 있지 않나요?

💘 **LOVEMAP**는 그런 고민을 가진 모두를 위해 만들어졌습니다.  
  🤖 AI에게 조언을 듣고  
  📍 좋은 장소를 추천받고  
  💬 다른 사람들과 고민을 나누는 
**연애 고민 종합 해결 플랫폼**입니다.

> **R U READY? I M READY!**  
> 연애에 한 걸음 더 다가가고 싶은 당신을 위한 올인원 서비스 💌


---

## 🧩 주요 기능

- 🤖 **연애 상담**: 사용자의 고민을 입력받아, API와 연동해 AI가 자연스러운 조언을 제공합니다. 
   
   🔗 API 경로: POST /api/ai/consult



- 🗺️ **데이트 장소 추천**: 원하는 지역을 입력하면, 카카오맵 API와 연동하여 연인과 가기 좋은 추천 장소 리스트를 제공합니다. 
   
   🔗 API 경로: GET /api/place/recommend?location=이태원

 - 📝 **익명 게시판**: 자유롭게 연애 고민을 공유하고, 검색 및 태그 기능을 통해 다른 사용자들의 이야기를 볼 수 있는 익명 커뮤니티 공간입니다. 익명 댓글을 통해 주제에 대해 소통할 수 있습니다.

---

## 🔄 기능 흐름도

Lovemap의 핵심 기능은 다음과 같은 흐름으로 작동합니다:

### 🏠 초기 화면 흐름도

   <img src="https://github.com/user-attachments/assets/81a431f3-675d-4466-bc12-6344a35ce28f" alt="홈화면" width="300"/>

#### 1. 🧍 **사용자**: `lovemap` 웹사이트 접속  
   

#### 2. 🎨 **프론트엔드**: 홈 화면 렌더링  
   
   └ 로고, 소개 문구:  
   _"연애에 어려움을 겪는 사람들을 위한 종합 연애 플랫폼"_  
   └ 주요 버튼 UI:  
   - 💬 연애 상담
   - 📍 데이트 코스 추천 
   - 📣 게시

#### 3. 🧭 **사용자 인터랙션**: 기능 버튼 클릭  
   → React Router를 통해 해당 기능 페이지로 이동

---

### 🤖 **연애 상담 기능 흐름도**

Lovemap의 연애 상담 기능은 다음과 같은 흐름으로 작동합니다:

---

<img src="https://github.com/user-attachments/assets/161cf5f9-1fb1-442f-82a3-08a57d78f723" alt="홈화면 ⮕ 연애상담 페이지" width="200"/>
⮕
<img src="https://github.com/user-attachments/assets/0694d2e4-f74c-4de5-a922-bc2f1b4d9eee" alt="연애 상담 페이지" width="300"/>

---

#### 1. 🧍 사용자: 고민 입력  
사용자가 연애 고민을 텍스트로 작성합니다.  
   └ 예: `"고백하고 싶은데 타이밍을 못 잡겠어요"`  
⮕ "상담하기" 버튼 클릭

<img src="https://github.com/user-attachments/assets/51b28e4e-7abb-4469-8c6c-0d5422018c1b" alt="연애 고민 입력 후 상담하기 버튼 클릭" width="200"/>

<img src="https://github.com/user-attachments/assets/88454c30-6222-4dc0-b8cf-6dacc556f848" alt="AI 답변 생성중" width="200"/>


#### 2. 💻 프론트엔드: 입력값을 백엔드로 전송
 
   └ `POST /api/ai/consult`

   ⮕ 입력 내용을 JSON 형태로 직렬화

#### 3. 🧠 백엔드: Spring Boot 서버에서  API 호출
  
   └ 외부 연동: Together.ai (Groq 기반)

   ⮕ 사용자 입력을 자연어 형태로 AI에 전달

#### 4. 🤖 AI 응답 수신
 
   └ 예: "상대의 반응을 보며 자연스럽게 대화를 시작해보세요."

   ⮕ 텍스트 기반 조언을 수신하여 정제  

#### 5. 📱 프론트엔드: 사용자 화면에 응답 출력
   
   └ 대화 형태로 시각화

   ⮕ 기존 채팅 인터페이스에 새로운 응답 추가

   <img src="https://github.com/user-attachments/assets/1b321119-8246-4a0f-a979-5fdc66650768" alt="AI 상담 결과" width="300"/>



#### 6. 📤 **상담 공유 기능**  
   └ 사용자는 상담 결과를 **익명 게시판**에 공유 가능  
   ⮕ 다른 사용자들과 고민을 나눌 수 있도록 연결됨

   <img src="https://github.com/user-attachments/assets/7183dd0b-abb9-4b5c-a118-5204ef460dc6" alt="상담 공유하기 버튼 클릭" width="300"/>

   <img src="https://github.com/user-attachments/assets/5f7a9064-1a31-4643-a06c-8a06348d7ddf" alt="상담 공유 게시글 작성 페이지" width="300"/>

   <img src="https://github.com/user-attachments/assets/1b32f4d5-5764-439d-bc52-e948b7514d52" alt="게시판으로 이동되어 업로드 된 것을 확인" width="400"/>

---

### 🗺️ **데이트 장소 추천 기능 흐름도**

Lovemap의 장소 추천 기능은 다음 두 가지 흐름으로 작동합니다:  

#### ① Kakao Map 기반 장소 검색, ② AI 블로그 검색 장소 추천
---
<img src="https://github.com/user-attachments/assets/1b505c5b-e146-4e80-a987-7718622a31d2" alt="홈화면 ⮕ 데이트 코스 추천 페이지" width="200"/>

<img src="https://github.com/user-attachments/assets/25b1bddd-12bd-48e2-b148-98bad19ea039" alt="데이트 코스 추천 페이지" width="200"/>

---

#### 1. 🧍 사용자: 지역 키워드 및 카테고리 입력
   └ 예: "중앙대 데이트", "전체"
   ⮕ "검색하기" 버튼 클릭

   <img src="https://github.com/user-attachments/assets/858101fb-f629-459d-9ada-ac908a0d014c" alt="데이트 장소 검색하기" width="200"/>

#### 2. 💻 프론트엔드: Kakao Map API 직접 호출
   └ `GET /api/place/recommend?location=중앙대데이트`

#### 3. 💻 프론트엔드: 장소 데이터 가공
   └ Kakao API 응답(JSON)을 클라이언트에서 파싱 및 필터링
   ⮕ 필요한 항목 추출:
   - 장소명 (place_name)
   - 주소 (address_name)
   - 전화번호 (phone)
  
#### 4. 💻 프론트엔드: 추천 장소 리스트 출력
   └ React 기반 카드 UI로 사용자에게 장소 리스트 표시
   ⮕ 각 카드에는 장소명, 주소, 전화번호 등이 포함됨
   ⮕ 지도와 연동되어 마커 표시 및 클릭 시 상세 위치 확인 가능

   <img src="https://github.com/user-attachments/assets/3a9736d9-c8ec-45c1-a499-29b9761da0eb" alt="카카오맵 결과 표시" width="300"/>

#### 5. 🧍 사용자: 데이트 코스 선택
   └ 검색 결과 스크롤 및 페이지 넘기기로 희망하는 데이트 장소 선택
   ⮕ 가운데 지도에서 선택한 장소들 위치 확인 가능
   ⮕ 게시판 공유 희망 시 **게시판에 공유하기** 버튼 클릭
   ⮕ 선택 초기화 희망 시 **모든 선택 초기화** 버튼 클릭

   <img src="https://github.com/user-attachments/assets/6601273b-0a2e-4936-a3e0-9126a0a879e4" alt="검색 결과 리스트에서 희망 장소 선택" width="200"/>

   <img src="https://github.com/user-attachments/assets/b17815c2-4f48-4c5c-a5e8-d07294e8d21a" alt="지도에서 위치 확인 및 코스 공유, 선택 초기화 가능" width="400"/>

#### 6. 데이트 코스 공유하기 클릭 시
   └ 게시글 작성 칸 생성 
   ⮕ 제목 및 내용 수정 후 태그 선택 & 공유하기 버튼 클릭

   <img src="https://github.com/user-attachments/assets/f9c8ee2d-03e2-4785-9be0-98fa8e0dd31b" alt="게시판에 공유하기 클릭시 뜨는 작성 창" width="200"/>

   <img src="https://github.com/user-attachments/assets/8cfb1801-0bdc-4b3f-b88c-87b4f295d3cf" alt="수정 후 태그 선택, 공유하기 버튼 클릭" width="200"/>

   <img src="https://github.com/user-attachments/assets/ae41ccd7-6aa7-4bbf-b6d9-c2b7f741c854" alt="클릭 후 뜨는 알림" width="300"/>

   <img src="https://github.com/user-attachments/assets/7301a5b7-87d0-481b-a86b-2722cfcd73c5" alt="게시찬에서 게시글 확인 가능" width="300"/>

#### 7. AI 장소 추천하기 클릭 시
   └ AI 검색 결과 화면에 표시
   
   <img src="https://github.com/user-attachments/assets/1fcd6d90-89b7-4ff2-8ea2-d0ebd1df0e9d" alt="ai 장소 추천 결과" width="300"/>

---

### 🤖 **게시판 기능 흐름도**

Lovemap의 게시판 기능은 다음 두 가지 흐름으로 작동합니다:  

#### ① 게시글 작성, ② 키워드 & 태그 기반 게시글 검색, ③ 익명 댓글 작성

---

<img src="https://github.com/user-attachments/assets/9956d0ae-7db0-44fa-8d7e-661cc39158f8" alt="홈화면 ⮕ 게시판 페이지" width="200"/>

<img src="https://github.com/user-attachments/assets/806740ab-034f-4b34-922c-05da0c70fcb8" alt="게시판 페이지" width="400"/>

---

#### ① 게시글 작성
#### 🧍 사용자: **작성** 버튼 클릭
   └ 작성 페이지로 이동

#### 🖊️ 제목 및 내용 입력 + 태그 선택
   - 제목과 본문 작성  
   - 하단의 태그 선택 영역에서 원하는 태그 클릭 (다중 선택 가능)

   <img src="https://github.com/user-attachments/assets/63eaacbb-f203-42bb-80e7-640ade4197ea" alt="게시글 작성 페이지" width="300"/>

#### 📤 작성 완료 후 등록 버튼 클릭
   - 작성한 게시글을 등록하면 게시판 메인 화면으로 자동 이동  
   - 최신 순으로 작성한 게시글 확인 가능 

   <img src="https://github.com/user-attachments/assets/71d44a3d-90a4-4c70-b829-b9faf3ecde97" alt="게시판" width="400"/>


#### 💻 프론트엔드 (React + fetch API)
   - 사용자가 작성한 제목, 본문, 태그를 JSON 형식으로 백엔드에 전송  

#### 🛠️ 백엔드 (Spring Boot + Spring Data JPA + MySQL)
   - POST /api/posts 요청 처리
   - ForumContent 엔티티에 게시글 저장
   - 연결된 태그는 ForumTags 중간 테이블에 함께 저장


---

#### ② 키워드 & 태그 기반 게시글 검색
#### 1. 키워드 기반 검색
- **🧍 사용자: 검색어 입력**
   - 화면 상단의 검색창에 연애 관련 키워드를 입력  
      └ 예: `"고백"`  
   - 키워드 입력 시 실시간 결과 필터링 지원  
   - 관련된 게시글이 실시간으로 아래 리스트에 출력됨  

   <img src="https://github.com/user-attachments/assets/92858c17-3a64-47fd-a513-20300c0e2891" alt="고백 키워드 검색 결과" width="300"/>

- **💻프론트엔드 (React + fetch API)** 
   - 입력값을 `GET` 요청 파라미터로 전달하여 검색
   - 검색 결과를 카드 UI로 동적으로 렌더링
   - 키워드 포함 여부는 제목 및 본문 기준으로 판단됨
   
- **🛠️ 백엔드 (Spring Boot + Spring Data JPA + MySQL)**
   - Containing 키워드로 제목, 내용 중 키워드를 포함한 게시글 조회
   - 결과는 JSON 형태로 반환되어 프론트에 전달됨



#### 2. 🏷️ 태그 기반 검색

- **🧍 사용자: 태그 선택**
   - 화면 하단의 태그 버튼 중 원하는 항목 선택  
      └ 예: `#고민`  
   - 선택 시 해당 태그를 포함한 게시글 목록이 자동으로 갱신되어 출력됨

- **💻 프론트엔드: (React + fetch API)**
   - 사용자가 선택한 태그를 기반으로 `GET` 요청 전송 
   
   ⮕ 응답받은 게시글 리스트를 카드 형태 UI로 동적으로 렌더링

   ⮕ 선택된 태그는 highlight 처리하여 사용자 선택을 명확히 표시 

- **🛠️ 백엔드 (Spring Boot + Spring Data JPA + MySQL)**
   - forum_tags, tags, forum_content 테이블을 조인하여 해당 태그가 연결된 게시글을 조회
   - Spring Data JPA를 이용해 효율적으로 태그 기반 쿼리 실행
   
   ⮕ 결과를 JSON으로 변환하여 프론트엔드로 응답

   <img src="https://github.com/user-attachments/assets/75fb64bc-b537-43e9-b172-d140b05d5ae8" alt="고민 태그 설정 결과" width="300"/>

---

#### 🗨️ ③ 익명 댓글 작성

#### 1. 사용자: 게시글 클릭 및 댓글 작성 
   - 사용자는 관심 있는 게시글을 클릭한 후, 하단 댓글 입력창에 텍스트를 입력  
   - `Enter` 키 또는 "댓글 작성" 버튼을 클릭하여 전송  
   - 댓글은 작성자 이름 없이 **익명**으로 표시됨

   <img src="https://github.com/user-attachments/assets/865bcaa1-dabd-4cd3-90aa-ff723256ee39" alt="익명 댓글 입력" width="200"/>
   
   <img src="https://github.com/user-attachments/assets/77b06967-c1be-47b9-9335-7602bdd8a166" alt="댓글 생성 확인" width="200"/>

#### 2. 💻 프론트엔드 (React + fetch API)  
   - 사용자가 작성한 댓글을 `fetch()`를 사용하여 백엔드 API로 전송  

   ⮕ 응답 수신 후, 댓글 리스트를 자동 새로고침하여 최신 상태로 반영
 

#### 3. 🛠️ 백엔드 (Spring Boot + MySQL)
   - POST /api/comments 요청 처리:
      - 전달된 content, forumContentId 기반으로 새로운 댓글 레코드를 생성
      - 익명 닉네임은 서버에서 자동 생성 (예: 익명1, 익명2 ...)
      - 댓글은 comment 테이블에 저장되며, forum_content_id를 외래키로 참조함
   
   ⮕ 저장 후, 해당 게시글의 전체 댓글 리스트를 반환하여 프론트에 전달


---


## 🛠️ 사용된 기술 스택

| 구분            | 기술                        | 설명                                                                 |
|-----------------|-----------------------------|----------------------------------------------------------------------|
| **프론트엔드**   | React + Vite                | 빠른 개발과 HMR을 위한 환경 구성                                     |
|                 | JavaScript (JSX), CSS       | UI/UX 구성                                                            |
| **백엔드**       | Java 17 + Spring Boot       | REST API 서버 구축                                                    |
|                 | Gradle                      | Java 빌드 및 의존성 관리                                              |
| **데이터베이스** | MySQL                       | 게시글/댓글/태그 정보 저장 및 조회                                     |
|                 | Spring Data JPA             | 객체-관계 매핑(O/R Mapping) 및 CRUD 처리 자동화                        |
| **API 연동**     | Together.ai (Groq 기반)     | GPT 기반 무료 연애 상담 AI API                                        |
|                 | Kakao REST API              | 장소 키워드 검색 API (지도, 장소 추천 기능에 활용)                    |
| **HTTP 통신**    | Fetch API                   | 프론트엔드에서 외부 API 요청                          |
|                 | OkHttp, Gson                | 백엔드에서 외부 API 요청 및 JSON 파싱                                 |
| **패키지 매니저**| npm                         | 프론트엔드 라이브러리 및 의존성 관리                                   |
| **개발 도구**    | VSCode                      | 전체 프론트엔드 개발 환경                                             |
|                 | IntelliJ IDEA               | 백엔드 개발 및 테스트 환경                                            |
| **형상 관리**    | GitHub                | 프로젝트 버전 관리 및 팀 협업                                          |
| **문서화**       | Notion                      | 기획, 기능 흐름 정리, 회의 기록 등의 협업 문서화 도구                   |


---

## ✅ 설치 및 사전 준비

Lovemap을 실행하기 위해서는 다음과 같은 프로그램 및 설정이 필요

---

### 🧩 1. 필수 설치 프로그램

| 항목             | 버전 권장 | 설치 링크 |
|------------------|-----------|-----------|
| **Java JDK**      | 17 이상   | https://adoptium.net/temurin/releases/ |
| **Node.js & npm** | v16 이상 | https://nodejs.org/en/download |
| **MySQL**         | 8.0 이상 | https://dev.mysql.com/downloads/installer/ |

---

### 🛠️ 2. MySQL 서버 설정

- 기본 포트: `3306`
- 사용자 계정 예시:
  - **username**: `root`
  - **password**: `your_password`
- 데이터베이스 생성:
```sql
CREATE DATABASE ossw_ready DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci; 
```

---

## 🚀 실행 방법

1. 백엔드 실행
```bash
- cd backend        # backend 폴더로 이동
- ./gradlew build   # 의존성 설치 + 빌드
- ./gradlew bootRun # 실행
```
>📌 실행 시 application.yml에서 설정한 MySQL 정보(username, password, DB name)가 정확히 입력되어 있어야 함. 
DB가 사전에 생성되어 있어야 하며, 기본 포트는 3306

2. 프론트엔드 실행
```bash
- cd frontend       # frontend 폴더로 이동
- npm install       # 의존성 설치 (최초 1회)
- npm run dev       # 실행
```
>🔗 기본 개발 서버 주소는 http://localhost:5173
프록시를 통해 백엔드(localhost:8080)와 연동

---

## 📂 주요 프로젝트 구조

```bash
📁 frontend/      # 프론트엔드 (React + Vite)
  └── src/
      ├── api/           
         └── flask.js                 # 백엔드 API 호출 함수 (Fetch 사용)
      ├── pages/          # 주요 페이지
         ├── Chat.jsx / .css         # 연애 상담 페이지
         ├── Comments.jsx / .css     # 댓글 컴포넌트
         ├── Forum.jsx / .css        # 게시판 메인 목록
         ├── ForumDetail.jsx / .css  # 게시글 상세 페이지
         ├── ForumWrite.jsx / .css   # 게시글 작성 페이지
         ├── Recommend.jsx / .css    # 데이트 장소 추천 페이지
         └── Home.jsx / .css         # 메인 홈 화면
      └── App.jsx, main.jsx

📁 backend/
  ├── src/main/java/
      ├── controller/     # REST 컨트롤러
      ├── domain/         # 엔티티 클래스
      ├── repository/     # JPA Repository 인터페이스
      ├── openfeign/      # 외부 API 통신 (e.g. Kakao, Together.ai)
      └── service/        # 비즈니스 로직
```

---

## 🧑‍💻 오픈소스 활용

| 분류         | 기술/서비스                | 설명                              |
| ---------- | --------------------- | ------------------------------- |
| **프론트엔드**  | React                 | UI 컴포넌트 기반의 오픈소스 자바스크립트 라이브러리   |
|            | Vite                  | 빠른 번들링과 개발 서버를 위한 빌드 도구         |
|            | JSX, CSS              | React 기반 UI 구성                  |
| **백엔드**    | Spring Boot           | 자바 기반의 경량 웹 프레임워크               |
|            | Gradle                | 자바 프로젝트 빌드 및 의존성 관리 도구          |
|            | Spring Data JPA       | ORM 기반 DB 연동을 위한 오픈소스 모듈        |
|            | OkHttp                | Java HTTP 클라이언트 라이브러리           |
|            | Gson                  | JSON 직렬화/역직렬화를 위한 Google의 라이브러리 |
| **데이터베이스** | MySQL                 | 오픈소스 관계형 데이터베이스                 |
| **외부 API** | Kakao REST API        | 장소 검색, 지도 데이터 제공 (카카오맵 연동)      |
|            | Together.ai (Groq 기반) | GPT-기반 연애 상담 API (무료)           |

---

## 🤝 기여 방법

1. ✅ 이슈 확인
   - 먼저 Issues 탭에서 오픈된 이슈 목록을 확인하세요.
   - 개선 아이디어, 버그 리포트, 기능 제안 등도 자유롭게 새로운 이슈로 등록 가능합니다.
2. 🔀 저장소 Fork & 브랜치 생성
3. 🛠️ 기능 개발 및 커밋
   - 기능을 구현하고 테스트까지 완료한 후 커밋해주세요.
   - 커밋 메시지는 명확하고 의미 있게 작성합니다.
4. 📬 Pull Request (PR) 요청
   - PR 제목과 설명에는 변경한 내용, 목적, 관련 이슈 번호를 포함해주세요.
   - 리뷰어의 피드백을 반영해 주시면 감사하겠습니다
3. README 및 문서화 개선도 환영합니다!

---

## 📘 프로젝트 문서

🔗 [RUREADYIMREADY Notion 대시보드](https://quasar-cupboard-f11.notion.site/RUREADYIMREADY-2067bda011fc806a99b7f3b1cd43688c?source=copy_link)

### 📁 문서 구성

| 구분             | 설명                                                              |
|------------------|-------------------------------------------------------------------|
| 🧭 **공통 외부 문서** | 프로젝트 소개, 서비스 기획, 팀 구성, 평가 기준, 교수 피드백 등 관리         |
| 🧾 **공통 내부 문서** | 회의록, 경비 사용 목록 등 팀 내부 협업 및 관리용 문서                     |
| 💡 **파트별 문서**   | 기능 구현 세부 내용 정리 (프론트엔드, 백엔드, 배포, Git 전략 등 포함)         |

---

## 🎥 시연 영상

| 구분         | 링크 |
|--------------|------|
| 🏁 MVP 발표   | [MVP 발표 영상 (YouTube)](https://youtu.be/94d2qzj6E8A?si=mdpAPyKHpAt2F5He) |
| 🧪 중간 데모 | [중간 데모 영상 (YouTube)](https://www.youtube.com/watch?v=KKeUBfGAjms)     |

---

## 📄 라이선스

> 본 프로젝트는 [MIT License](./LICENSE)를 따릅니다.

