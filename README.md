# YouTube 트렌드 분석 툴

국가별 · 카테고리별 유튜브 급상승 영상 분석 대시보드

## 주요 기능

| 메뉴 | 상태 | 설명 |
|------|------|------|
| **급상승 TOP 100** | ✅ 구현 | 국가·카테고리 필터, KPI 요약, 조회수·좋아요율 차트, 50개씩 페이지네이션 |
| **트렌드 키워드** | ✅ 구현 | 최대 100개 영상 기반 제목 키워드·태그·채널 빈도 분석, 키워드 클릭 시 관련 영상 필터 |
| **카테고리 비교** | ✅ 구현 | 카테고리별 영상 수 분포 차트 + KPI 비교 테이블 (평균 조회수·좋아요율) |
| **키워드 분석** | 🚧 준비 중 | 키워드 입력 UI 제공, 검색 분석 기능 개발 예정 |
| **채널 분석** | 🚧 준비 중 | 특정 채널 분석 기능 개발 예정 |
| **경쟁 채널 비교** | 🚧 준비 중 | 채널 간 비교 기능 개발 예정 |
| **영상 상세** | ✅ 구현 | 통계·태그·설명, 댓글 목록 + 댓글 반응 분석 (감정·키워드·좋아요 TOP 3) |
| **API 키 관리** | ✅ 구현 | localStorage 저장, 사이드바에서 언제든 변경 |

## 화면 구성

### 레이아웃
- **좌측 사이드바** — 6개 메뉴 항목, 활성 메뉴 강조, 모바일에서는 햄버거 버튼 → 슬라이드 드로어
- **메인 콘텐츠** — 스크롤 가능한 분석 화면

### 급상승 TOP 100 (`/`)
- 국가(20개국) + 카테고리 필터
- **KPI 대시보드** — 총 조회수, 평균 조회수, 평균 좋아요율, 평균 댓글율, 평균 업로드 경과일, 출연 채널 수
- **차트** — 조회수 TOP 10, 좋아요율 TOP 10 (CSS 순수 가로 막대 그래프, 외부 라이브러리 없음)
- 영상 카드 그리드 + 페이지네이션

### 트렌드 키워드 (`/trends`)
- 최대 100개 영상(2페이지) 자동 로드, 분석 기준 영상 수 표시
- **제목 키워드 TOP 20** — 불용어 제거 후 단어 빈도 분석
- **태그 TOP 20** — 태그 없는 영상도 안전하게 처리
- **자주 등장한 채널 TOP 10** — 빈도 기반 채널 순위
- **키워드 클릭** — 해당 키워드가 제목 또는 태그에 포함된 영상을 하단에 즉시 표시

### 카테고리 비교 (`/categories`)
- 국가 필터 (항상 전체 카테고리 기준 분석)
- 카테고리별 영상 수 가로 막대 차트
- 카테고리별 KPI 비교 테이블 (영상 수 · 평균 조회수 · 평균 좋아요율)

### 영상 상세 (`/video/[id]`)
- 썸네일, 조회수·좋아요·댓글 통계, 태그, 영상 설명
- **댓글 반응 분석** — 감정 분포(긍정/부정/중립), 좋아요 TOP 3 댓글, 질문형 댓글 비율, 반복 키워드
- 댓글 목록 + 더 보기 (페이지 토큰 기반 무한 로드)

## 시작하기

### 1. YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 → **APIs & Services → Library**
3. **YouTube Data API v3** 검색 후 활성화
4. **Credentials → Create Credentials → API Key** 생성

### 2. 설치 및 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속 후 사이드바 하단 **API 키 설정** 버튼을 눌러 키를 입력하면 바로 사용 가능합니다.  
API 키는 브라우저 localStorage에 저장되며 `.env` 파일이 필요하지 않습니다.

> **WSL 환경 주의:** Windows 파일시스템(`/mnt/c/`)에서 `npm install`이 실패할 수 있습니다.  
> WSL 터미널에서 실행하거나, node_modules를 WSL 홈 디렉터리에 설치 후 심볼릭 링크를 사용하세요.

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx                  # 공통 레이아웃 (Sidebar + ApiKeyProvider)
│   ├── page.tsx                    # 급상승 TOP 100
│   ├── trends/page.tsx             # 트렌드 키워드 분석
│   ├── categories/page.tsx         # 카테고리 비교
│   ├── keyword/page.tsx            # 키워드 분석 (준비 중)
│   ├── channel/page.tsx            # 채널 분석 (준비 중)
│   ├── competitors/page.tsx        # 경쟁 채널 비교 (준비 중)
│   ├── education/page.tsx          # 뷰티 TOP 30 (내비게이션에서 제외, 페이지 유지)
│   ├── video/[id]/page.tsx         # 영상 상세
│   └── api/
│       ├── trending/route.ts       # GET /api/trending
│       ├── education/route.ts      # GET /api/education
│       ├── comments/route.ts       # GET /api/comments
│       └── video/route.ts          # GET /api/video
├── components/
│   ├── Sidebar.tsx                 # 사이드바 (데스크톱 고정 + 모바일 드로어)
│   ├── TrendingClient.tsx          # 급상승 TOP 100 클라이언트
│   ├── TrendsClient.tsx            # 트렌드 키워드 분석 클라이언트
│   ├── CategoriesClient.tsx        # 카테고리 비교 클라이언트
│   ├── KpiDashboard.tsx            # KPI 요약 카드 (6개 지표)
│   ├── TrendCharts.tsx             # 조회수·좋아요율 TOP 10 차트 (CSS 막대)
│   ├── KeywordAnalysis.tsx         # 키워드·태그·채널 빈도 분석 패널
│   ├── CommentAnalysis.tsx         # 댓글 반응 분석 (감정·키워드·좋아요)
│   ├── VideoDetailClient.tsx       # 영상 상세 클라이언트
│   ├── VideoCard.tsx               # 영상 카드 (썸네일, 통계)
│   ├── CommentList.tsx             # 댓글 목록 + 더 보기
│   ├── ComingSoon.tsx              # 준비 중 페이지 공통 컴포넌트
│   ├── CategoryFilter.tsx          # 카테고리 버튼 필터
│   ├── CountrySelector.tsx         # 국가 드롭다운
│   ├── ApiKeyModal.tsx             # API 키 입력 모달
│   └── ApiKeyButton.tsx            # API 키 변경 버튼 (사이드바 하단)
├── contexts/
│   └── ApiKeyContext.tsx           # 전역 API 키 상태 (Context + Provider)
├── lib/
│   ├── youtube.ts                  # YouTube Data API v3 클라이언트
│   └── textAnalysis.ts             # 텍스트 분석 유틸 (키워드 추출, 감정 분석 등)
└── types/
    └── youtube.ts                  # 타입 정의 + 카테고리/국가 상수
```

## API 설계

모든 API 라우트는 클라이언트에서 `X-API-Key` 헤더로 YouTube API 키를 전달받아 서버에서 호출합니다.

```
GET /api/trending?region=KR&category=0&maxResults=50&pageToken=...
GET /api/education?region=KR&maxResults=30
GET /api/comments?videoId=xxx&maxResults=20&pageToken=...
GET /api/video?videoId=xxx
```

## 텍스트 분석 (`lib/textAnalysis.ts`)

외부 NLP 라이브러리 없이 순수 JavaScript로 구현한 분석 유틸리티입니다.

| 함수 | 설명 |
|------|------|
| `normalizeText` | HTML 제거, URL 제거, 특수문자 정규화, 소문자 변환 |
| `extractKeywords` | 불용어(한국어·영어) 제거 후 단어 빈도 TOP N 반환 |
| `countFrequencies` | 문자열 배열 빈도 집계 TOP N 반환 |
| `analyzeSentiment` | 사전 기반 긍정/부정/중립 추정 |
| `analyzeQuestions` | 질문형 댓글 감지 |
| `getTopLikedComments` | 좋아요 많은 댓글 TOP N 반환 |

## 기술 스택

- **Next.js 15** (App Router, Server + Client Components)
- **TypeScript**
- **Tailwind CSS**
- **YouTube Data API v3**
- **Vercel** (배포, GitHub `main` 브랜치 자동 배포)
