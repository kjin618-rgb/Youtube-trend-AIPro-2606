"use client";

import { useState, useCallback, useEffect } from "react";
import { RefreshCw, LayoutGrid } from "lucide-react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyModal from "@/components/ApiKeyModal";
import CountrySelector from "@/components/CountrySelector";
import type { YouTubeVideo } from "@/types/youtube";
import { YOUTUBE_CATEGORIES } from "@/types/youtube";

function safeInt(s: string): number {
  const n = parseInt(s || "0", 10);
  return isNaN(n) ? 0 : n;
}

function fmtCount(n: number): string {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toLocaleString();
}

interface CatStat {
  name: string;
  count: number;
  avgViews: number;
  avgLikeRate: number;
}

function buildStats(videos: YouTubeVideo[]): CatStat[] {
  const groups: Record<string, YouTubeVideo[]> = {};
  for (const v of videos) {
    const name = YOUTUBE_CATEGORIES[v.categoryId] ?? "기타";
    if (!groups[name]) groups[name] = [];
    groups[name].push(v);
  }
  return Object.entries(groups)
    .map(([name, vids]) => {
      const avgViews =
        vids.reduce((s, v) => s + safeInt(v.statistics.viewCount), 0) / vids.length;
      const avgLikeRate =
        vids.reduce((s, v) => {
          const views = safeInt(v.statistics.viewCount);
          return s + (views > 0 ? (safeInt(v.statistics.likeCount) / views) * 100 : 0);
        }, 0) / vids.length;
      return { name, count: vids.length, avgViews, avgLikeRate };
    })
    .sort((a, b) => b.count - a.count);
}

export default function CategoriesClient() {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [region, setRegion] = useState("KR");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/trending?region=${region}&category=0&maxResults=50`,
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
  }, [apiKey, region]);

  useEffect(() => {
    if (apiKey) loadData();
  }, [loadData, apiKey]);

  if (!loaded) return null;
  if (!apiKey) return <ApiKeyModal onSave={setApiKey} />;

  const stats = buildStats(videos);
  const maxCount = Math.max(...stats.map((s) => s.count), 1);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <CountrySelector selected={region} onChange={setRegion} />
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
      ) : stats.length > 0 ? (
        <div className="space-y-4">
          {/* 카테고리별 영상 수 bar chart */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-4">
              <LayoutGrid size={14} className="text-blue-500" />
              카테고리별 영상 수
            </h3>
            <div className="space-y-2">
              {stats.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-gray-400 flex-shrink-0 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-700 truncate mb-0.5">{s.name}</div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all"
                        style={{ width: `${(s.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-500 flex-shrink-0 w-6 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 카테고리별 KPI 비교 테이블 */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">카테고리별 KPI 비교</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-2.5 font-medium text-gray-500">카테고리</th>
                    <th className="text-right px-4 py-2.5 font-medium text-gray-500">영상 수</th>
                    <th className="text-right px-4 py-2.5 font-medium text-gray-500">평균 조회수</th>
                    <th className="text-right px-4 py-2.5 font-medium text-gray-500">평균 좋아요율</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s, i) => (
                    <tr
                      key={s.name}
                      className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
                    >
                      <td className="px-4 py-2.5 text-gray-800 font-medium">{s.name}</td>
                      <td className="px-4 py-2.5 text-gray-600 text-right">{s.count}개</td>
                      <td className="px-4 py-2.5 text-gray-600 text-right">
                        {fmtCount(Math.round(s.avgViews))}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 text-right">
                        {s.avgLikeRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
