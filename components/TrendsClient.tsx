"use client";

import { useState, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyModal from "@/components/ApiKeyModal";
import CountrySelector from "@/components/CountrySelector";
import CategoryFilter from "@/components/CategoryFilter";
import KeywordAnalysis from "@/components/KeywordAnalysis";
import type { YouTubeVideo } from "@/types/youtube";

export default function TrendsClient() {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [region, setRegion] = useState("KR");
  const [category, setCategory] = useState("0");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/trending?region=${region}&category=${category}&maxResults=50`,
        { headers: { "X-API-Key": apiKey } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideos(data.videos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  }, [apiKey, region, category]);

  useEffect(() => {
    if (apiKey) loadData();
  }, [loadData, apiKey]);

  if (!loaded) return null;
  if (!apiKey) return <ApiKeyModal onSave={setApiKey} />;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <CountrySelector selected={region} onChange={setRegion} />
        <div className="flex-1 min-w-0">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-600 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          새로고침
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

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full" />
        </div>
      ) : (
        <KeywordAnalysis videos={videos} />
      )}
    </div>
  );
}
