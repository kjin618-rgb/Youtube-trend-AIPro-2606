"use client";

import { useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import CountrySelector from "@/components/CountrySelector";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { Sparkles, RefreshCw, Settings } from "lucide-react";
import type { YouTubeVideo } from "@/types/youtube";

export default function EducationClient() {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [region, setRegion] = useState("KR");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchVideos(r: string, key: string) {
    if (!key) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/education?region=${r}&maxResults=30`, {
        headers: { "X-API-Key": key },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideos(data.videos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (apiKey) fetchVideos(region, apiKey);
  }, [region, apiKey]);

  if (!loaded) return null;
  if (!apiKey) return <ApiKeyModal onSave={setApiKey} />;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <CountrySelector selected={region} onChange={setRegion} />
        <button
          onClick={() => fetchVideos(region, apiKey)}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          새로고침
        </button>
        <button
          onClick={clearApiKey}
          title="API 키 변경"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
        >
          <Settings size={16} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={clearApiKey}
            className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            API 키 재입력
          </button>
        </div>
      )}

      {loading && !videos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-video animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <Sparkles size={16} className="text-pink-500" />
            <span>뷰티 인기 영상 TOP {videos.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={{ ...video, rank: i + 1 }} showRank />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
