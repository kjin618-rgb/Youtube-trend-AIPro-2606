import { NextRequest, NextResponse } from "next/server";
import { fetchVideoDetail } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key") || "";
  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "videoId가 필요합니다." }, { status: 400 });
  }

  try {
    const video = await fetchVideoDetail(apiKey, videoId);
    if (!video) return NextResponse.json({ error: "영상을 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json(video);
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
