import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key") || "";
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get("region") || "KR";
  const categoryId = searchParams.get("category") || "0";
  const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "50"), 50);
  const pageToken = searchParams.get("pageToken") || undefined;

  try {
    const data = await fetchTrendingVideos(apiKey, regionCode, categoryId, maxResults, pageToken);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
