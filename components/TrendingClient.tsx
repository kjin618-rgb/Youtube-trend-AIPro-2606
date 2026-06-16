"use client";

import { useState, useEffect, useCallback } from "react";
import VideoCard from "@/components/VideoCard";
import CategoryFilter from "@/components/CategoryFilter";
import CountrySelector from "@/components/CountrySelector";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { RefreshCw, TrendingUp, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import type { YouTubeVideo } from "@/types/youtube";

interface PageData {
  videos: YouTubeVideo[];
  nextPageToken?: string;
}

export default function TrendingClient() {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [region, setRegion] = useState("KR");
  const [category, setCategory] = useState("0");
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = useCallback(
    async (pageToken?: string, reset = false) => {
      if (!apiKey) return;
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ region, category, maxResults: "50" });
        if (pageToken) params.set("pageToken", pageToken);

        const res = await fetch(`/api/trending?${params}`, {
          headers: { "X-API-Key": apiKey },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const newPage: PageData = { videos: data.videos, nextPageToken: data.nextPageToken };
        if (reset) {
          setPages([newPage]);
          setCurrentPage(0);
        } else {
          setPages((prev) => [...prev, newPage]);
          setCurrentPage((prev) => prev + 1);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, region, category]
  );

  useEffect(() => {
    if (apiKey) fetchPage(undefined, true);
  }, [fetchPage, apiKey]);

  if (!loaded) return null;
  if (!apiKey) return <ApiKeyModal onSave={setApiKey} />;

  const current = pages[currentPage];
  const allVideos = current?.videos || [];
  const rankOffset = currentPage * 50;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <CountrySelector selected={region} onChange={setRegion} />
        <div className="flex-1 min-w-0">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchPage(undefined, true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 transition disabled:opacity-50"
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

      {loading && !allVideos.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-video animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp size={16} className="text-red-500" />
              <span>
                {rankOffset + 1}~{rankOffset + allVideos.length}위 표시 중
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0 || loading}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {currentPage + 1} / {Math.max(pages.length, currentPage + 1)} 페이지
              </span>
              <button
                onClick={() => {
                  if (currentPage < pages.length - 1) {
                    setCurrentPage((p) => p + 1);
                  } else if (current?.nextPageToken) {
                    fetchPage(current.nextPageToken);
                  }
                }}
                disabled={loading || (currentPage >= pages.length - 1 && !current?.nextPageToken)}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allVideos.map((video, i) => (
              <VideoCard key={video.id} video={{ ...video, rank: rankOffset + i + 1 }} showRank />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
