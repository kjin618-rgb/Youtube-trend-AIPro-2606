# YouTube 트렌드 분석 툴

국가별 · 카테고리별 유튜브 급상승 영상 분석 대시보드

## 주요 기능

| 기능 | 설명 |
|------|------|
| **급상승 TOP 100** | 국가 · 카테고리 필터, 50개씩 페이지네이션 |
| **뷰티 TOP 30** | 노하우 & 스타일(카테고리 26) 인기 영상, 미지원 국가 자동 폴백 |
| **영상 상세** | 조회수 · 좋아요 · 댓글 통계, 태그, 영상 설명 |
| **댓글 목록** | 상위 댓글 20개 + 더 보기 (무한 로드) |
| **국가 선택** | 한국 · 미국 · 일본 등 20개국 지원 |
| **API 키 관리** | 브라우저 localStorage 저장, 언제든 변경 가능 |

## 스크린샷

### 급상승 TOP 100
- 국가 드롭다운 + 카테고리 버튼 필터
- 이전/다음 페이지 버튼으로 최대 100개 탐색

### 뷰티 TOP 30
- 노하우 & 스타일 카테고리 전용
- 해당 국가에서 카테고리 미지원 시 전체 인기 영상으로 자동 대체 + 안내 메시지

### 영상 상세 페이지
- 썸네일 클릭 → YouTube 바로 이동
- 댓글 더 보기 (페이지 토큰 기반 무한 로드)

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

`http://localhost:3000` 접속 후 첫 화면에서 API 키를 입력하면 바로 사용 가능합니다.  
API 키는 브라우저 localStorage에 저장되며 `.env` 파일이 필요하지 않습니다.

> **WSL 환경 주의:** Windows 파일시스템(`/mnt/c/`)에서 `npm install`이 실패할 수 있습니다.  
> WSL 터미널에서 실행하거나, node_modules를 WSL 홈 디렉터리에 설치 후 심볼릭 링크를 사용하세요.

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx              # 공통 레이아웃 (헤더, ApiKeyProvider)
│   ├── page.tsx                # 급상승 TOP 100 페이지
│   ├── education/page.tsx      # 뷰티 TOP 30 페이지
│   ├── video/[id]/page.tsx     # 영상 상세 페이지
│   └── api/
│       ├── trending/route.ts   # GET /api/trending
│       ├── education/route.ts  # GET /api/education
│       ├── comments/route.ts   # GET /api/comments
│       └── video/route.ts      # GET /api/video
├── components/
│   ├── TrendingClient.tsx      # 급상승 필터 + 페이지네이션
│   ├── EducationClient.tsx     # 뷰티 영상 + 폴백 처리
│   ├── VideoDetailClient.tsx   # 영상 상세 클라이언트
│   ├── VideoCard.tsx           # 영상 카드 (썸네일, 통계)
│   ├── CommentList.tsx         # 댓글 목록 + 더 보기
│   ├── CategoryFilter.tsx      # 카테고리 버튼 필터
│   ├── CountrySelector.tsx     # 국가 드롭다운
│   ├── ApiKeyModal.tsx         # API 키 입력 모달
│   └── ApiKeyButton.tsx        # 헤더 API 키 변경 버튼
├── contexts/
│   └── ApiKeyContext.tsx       # 전역 API 키 상태 (Context + Provider)
├── lib/
│   ├── youtube.ts              # YouTube Data API v3 클라이언트
│   └── useApiKey.ts            # (레거시, Context로 대체됨)
└── types/
    └── youtube.ts              # 타입 정의 + 카테고리/국가 상수
```

## API 설계

모든 API 라우트는 클라이언트에서 `X-API-Key` 헤더로 YouTube API 키를 전달받아 서버에서 호출합니다.

```
GET /api/trending?region=KR&category=0&maxResults=50&pageToken=...
GET /api/education?region=KR&maxResults=30
GET /api/comments?videoId=xxx&maxResults=20&pageToken=...
GET /api/video?videoId=xxx
```

## 기술 스택

- **Next.js 15** (App Router, Server + Client Components)
- **TypeScript**
- **Tailwind CSS**
- **YouTube Data API v3**
- **Vercel** (배포)

## 배포

Vercel에 자동 배포됩니다. GitHub `main` 브랜치에 push하면 자동으로 재배포됩니다.
