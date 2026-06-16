# YouTube 트렌드 분석 툴

국가별 · 카테고리별 유튜브 급상승 영상 분석 대시보드

## 기능

- **급상승 TOP 100**: 국가 · 카테고리 필터, 페이지네이션 (50개씩)
- **교육 TOP 30**: 교육 카테고리 전용 인기 영상
- **영상 상세**: 통계, 태그, 설명, 댓글 목록 (무한 로드)
- **국가 설정**: 한국, 미국, 일본 등 20개국 지원

## 시작하기

### 1. YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 → APIs & Services → Library
3. **YouTube Data API v3** 검색 후 활성화
4. Credentials → Create Credentials → API Key

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 API 키 입력:

```
YOUTUBE_API_KEY=여기에_API_키_입력
```

### 3. 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속

## 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **YouTube Data API v3**
