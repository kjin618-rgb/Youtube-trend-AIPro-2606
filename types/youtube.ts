export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  categoryId: string;
  tags?: string[];
  duration: string;
  rank: number;
}

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  replyCount: number;
}

export interface TrendingResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
  regionCode: string;
  categoryId: string;
}

export interface CommentsResponse {
  comments: YouTubeComment[];
  nextPageToken?: string;
  totalResults: number;
}

export const YOUTUBE_CATEGORIES: Record<string, string> = {
  "0": "전체",
  "1": "영화 & 애니메이션",
  "2": "자동차",
  "10": "음악",
  "15": "동물",
  "17": "스포츠",
  "19": "여행",
  "20": "게임",
  "22": "블로그",
  "23": "코미디",
  "24": "엔터테인먼트",
  "25": "뉴스 & 정치",
  "26": "노하우 & 스타일",
  "27": "교육",
  "28": "과학 & 기술",
  "29": "비영리 & 사회운동",
};

export const YOUTUBE_COUNTRIES: Record<string, string> = {
  KR: "대한민국",
  US: "미국",
  JP: "일본",
  GB: "영국",
  DE: "독일",
  FR: "프랑스",
  IN: "인도",
  BR: "브라질",
  CA: "캐나다",
  AU: "호주",
  MX: "멕시코",
  ES: "스페인",
  IT: "이탈리아",
  RU: "러시아",
  CN: "중국",
  TW: "대만",
  SG: "싱가포르",
  TH: "태국",
  VN: "베트남",
  ID: "인도네시아",
};
