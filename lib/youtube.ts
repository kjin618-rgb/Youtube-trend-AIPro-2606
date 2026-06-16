import type { YouTubeVideo, YouTubeComment, TrendingResponse, CommentsResponse } from "@/types/youtube";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function fetchTrendingVideos(
  apiKey: string,
  regionCode: string = "KR",
  categoryId: string = "0",
  maxResults: number = 50,
  pageToken?: string
): Promise<TrendingResponse> {
  if (!apiKey) throw new Error("YouTube API 키가 설정되지 않았습니다.");

  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    chart: "mostPopular",
    regionCode,
    maxResults: String(maxResults),
    key: apiKey,
  });
  if (categoryId && categoryId !== "0") params.set("videoCategoryId", categoryId);
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(`${BASE_URL}/videos?${params}`, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json();
    const message: string = err.error?.message || "YouTube API 요청 실패";
    // 해당 국가에서 카테고리가 지원되지 않으면 카테고리 없이 재시도
    if (categoryId !== "0" && (message.includes("not found") || message.includes("notFound"))) {
      params.delete("videoCategoryId");
      const retry = await fetch(`${BASE_URL}/videos?${params}`, { cache: "no-store" });
      if (!retry.ok) throw new Error(message);
      const retryData = await retry.json();
      return buildResponse(retryData, regionCode, "0", true);
    }
    throw new Error(message);
  }
  const data = await res.json();
  return buildResponse(data, regionCode, categoryId, false);
}

function buildResponse(
  data: Record<string, unknown>,
  regionCode: string,
  categoryId: string,
  categoryFallback: boolean
): TrendingResponse {
  const videos: YouTubeVideo[] = ((data.items as Record<string, unknown>[]) || []).map(
    (item, index) => {
      const snippet = item.snippet as Record<string, unknown>;
      const statistics = item.statistics as Record<string, unknown>;
      const contentDetails = item.contentDetails as Record<string, unknown>;
      return {
        id: item.id as string,
        title: snippet.title as string,
        description: snippet.description as string,
        channelId: snippet.channelId as string,
        channelTitle: snippet.channelTitle as string,
        publishedAt: snippet.publishedAt as string,
        thumbnails: snippet.thumbnails as YouTubeVideo["thumbnails"],
        statistics: {
          viewCount: (statistics.viewCount as string) || "0",
          likeCount: (statistics.likeCount as string) || "0",
          commentCount: (statistics.commentCount as string) || "0",
        },
        categoryId: snippet.categoryId as string,
        tags: snippet.tags as string[] | undefined,
        duration: parseDuration(contentDetails.duration as string),
        rank: index + 1,
      };
    }
  );

  return {
    videos,
    nextPageToken: data.nextPageToken as string | undefined,
    totalResults: ((data.pageInfo as Record<string, unknown>)?.totalResults as number) || 0,
    regionCode,
    categoryId,
    categoryFallback,
  };
}

export async function fetchBeautyVideos(
  apiKey: string,
  regionCode: string = "KR",
  maxResults: number = 30
): Promise<TrendingResponse> {
  return fetchTrendingVideos(apiKey, regionCode, "26", maxResults);
}

export async function fetchVideoComments(
  apiKey: string,
  videoId: string,
  maxResults: number = 20,
  pageToken?: string
): Promise<CommentsResponse> {
  if (!apiKey) throw new Error("YouTube API 키가 설정되지 않았습니다.");

  const params = new URLSearchParams({
    part: "snippet",
    videoId,
    maxResults: String(maxResults),
    order: "relevance",
    key: apiKey,
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(`${BASE_URL}/commentThreads?${params}`, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "댓글 로드 실패");
  }
  const data = await res.json();

  const comments: YouTubeComment[] = (data.items || []).map((item: Record<string, unknown>) => {
    const top = (item.snippet as Record<string, unknown>).topLevelComment as Record<string, unknown>;
    const s = top.snippet as Record<string, unknown>;
    return {
      id: top.id as string,
      authorDisplayName: s.authorDisplayName as string,
      authorProfileImageUrl: s.authorProfileImageUrl as string,
      textDisplay: s.textDisplay as string,
      likeCount: (s.likeCount as number) || 0,
      publishedAt: s.publishedAt as string,
      replyCount: ((item.snippet as Record<string, unknown>).totalReplyCount as number) || 0,
    };
  });

  return {
    comments,
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo?.totalResults || 0,
  };
}

export async function fetchVideoDetail(
  apiKey: string,
  videoId: string
): Promise<YouTubeVideo | null> {
  if (!apiKey) throw new Error("YouTube API 키가 설정되지 않았습니다.");

  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: videoId,
    key: apiKey,
  });

  const res = await fetch(`${BASE_URL}/videos?${params}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.items?.length) return null;

  const item = data.items[0] as Record<string, unknown>;
  const snippet = item.snippet as Record<string, unknown>;
  const statistics = item.statistics as Record<string, unknown>;
  const contentDetails = item.contentDetails as Record<string, unknown>;

  return {
    id: item.id as string,
    title: snippet.title as string,
    description: snippet.description as string,
    channelId: snippet.channelId as string,
    channelTitle: snippet.channelTitle as string,
    publishedAt: snippet.publishedAt as string,
    thumbnails: snippet.thumbnails as YouTubeVideo["thumbnails"],
    statistics: {
      viewCount: (statistics.viewCount as string) || "0",
      likeCount: (statistics.likeCount as string) || "0",
      commentCount: (statistics.commentCount as string) || "0",
    },
    categoryId: snippet.categoryId as string,
    tags: snippet.tags as string[] | undefined,
    duration: parseDuration(contentDetails.duration as string),
    rank: 0,
  };
}
