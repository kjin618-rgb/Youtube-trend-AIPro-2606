import { NextRequest, NextResponse } from "next/server";
import { fetchBeautyVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key") || "";
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get("region") || "KR";
  const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "30"), 50);

  try {
    const data = await fetchBeautyVideos(apiKey, regionCode, maxResults);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
