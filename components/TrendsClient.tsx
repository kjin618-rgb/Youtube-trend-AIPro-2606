"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { RefreshCw, Hash, Tag, Tv2, X } from "lucide-react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyModal from "@/components/ApiKeyModal";
import CountrySelector from "@/components/CountrySelector";
import CategoryFilter from "@/components/CategoryFilter";
import VideoCard from "@/components/VideoCard";
import { extractKeywords, countFrequencies, normalizeText } from "@/lib/textAnalysis";
import type { YouTubeVideo } from "@/types/youtube";

function Panel({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-3">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function KeyChip({
  label,
  count,
  selected,
  baseClass,
  activeClass,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  baseClass: string;
  activeClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
        selected ? activeClass : baseClass
      }`}
    >
      {label}
      <span className="font-semibold opacity-60">{count}</span>
    </button>
  );
}

export default function TrendsClient() {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [region, setRegion] = useState("KR");
  const [category, setCategory] = useState("0");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedKw, setSelectedKw] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError("");
    setSelectedKw(null);
    try {
      const p1 = new URLSearchParams({ region, category, maxResults: "50" });
      const r1 = await fetch(`/api/trending?${p1}`, { headers: { "X-API-Key": apiKey } });
      const d1 = await r1.json();
      if (!r1.ok) throw new Error(d1.error);

      let all: YouTubeVideo[] = d1.videos ?? [];

      if (d1.nextPageToken) {
        const p2 = new URLSearchParams({
          region,
          category,
          maxResults: "50",
          pageToken: d1.nextPageToken,
        });
        const r2 = await fetch(`/api/trending?${p2}`, { headers: { "X-API-Key": apiKey } });
        if (r2.ok) {
          const d2 = await r2.json();
          all = [...all, ...(d2.videos ?? [])];
        }
      }

      setVideos(all);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  }, [apiKey, region, category]);

  useEffect(() => {
    if (apiKey) loadData();
  }, [loadData, apiKey]);

  const titleKeywords = useMemo(
    () => extractKeywords(videos.map((v) => v.title), { limit: 20 }),
    [videos]
  );

  const tagFreqs = useMemo(
    () => countFrequencies(videos.flatMap((v) => v.tags ?? []), 20),
    [videos]
  );

  const channelFreqs = useMemo(
    () => countFrequencies(videos.map((v) => v.channelTitle), 10),
    [videos]
  );

  const relatedVideos = useMemo(() => {
    if (!selectedKw) return [];
    const kw = selectedKw.toLowerCase();
    return videos.filter(
      (v) =>
        normalizeText(v.title).includes(kw) ||
        (v.tags ?? []).some((t) => normalizeText(t).includes(kw))
    );
  }, [selectedKw, videos]);

  const toggleKw = (word: string) => setSelectedKw((prev) => (prev === word ? null : word));

  if (!loaded) return null;
  if (!apiKey) return <ApiKeyModal onSave={setApiKey} />;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
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

      {/* 분석 기준 */}
      {!loading && videos.length > 0 && (
        <p className="text-xs text-gray-400 mb-5">
          분석 기준: 불러온{" "}
          <span className="font-medium text-gray-600">{videos.length}개</span> 영상
        </p>
      )}

      {/* Error */}
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

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="animate-spin w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full" />
        </div>
      ) : videos.length === 0 ? null : (
        <>
          {/* 3-panel analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* 제목 키워드 */}
            <Panel
              icon={<Hash size={13} className="text-red-500" />}
              title="제목 키워드 TOP 20"
            >
              {titleKeywords.length === 0 ? (
                <p className="text-xs text-gray-400">데이터 없음</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {titleKeywords.map(({ word, count }) => (
                    <KeyChip
                      key={word}
                      label={word}
                      count={count}
                      selected={selectedKw === word}
                      baseClass="bg-red-50 text-red-700 border-red-100 hover:bg-red-100 cursor-pointer"
                      activeClass="bg-red-600 text-white border-red-600"
                      onClick={() => toggleKw(word)}
                    />
                  ))}
                </div>
              )}
            </Panel>

            {/* 태그 */}
            <Panel
              icon={<Tag size={13} className="text-blue-500" />}
              title="태그 TOP 20"
            >
              {tagFreqs.length === 0 ? (
                <p className="text-xs text-gray-400">태그 데이터 없음</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tagFreqs.map(({ item, count }) => (
                    <KeyChip
                      key={item}
                      label={item}
                      count={count}
                      selected={selectedKw === item}
                      baseClass="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 cursor-pointer"
                      activeClass="bg-blue-600 text-white border-blue-600"
                      onClick={() => toggleKw(item)}
                    />
                  ))}
                </div>
              )}
            </Panel>

            {/* 자주 등장한 채널 */}
            <Panel
              icon={<Tv2 size={13} className="text-purple-500" />}
              title="자주 등장한 채널 TOP 10"
            >
              {channelFreqs.length === 0 ? (
                <p className="text-xs text-gray-400">데이터 없음</p>
              ) : (
                <div className="space-y-1.5">
                  {channelFreqs.map(({ item, count }, i) => (
                    <div key={item} className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-gray-400 w-4 flex-shrink-0 text-right">{i + 1}</span>
                        <span className="text-gray-800 truncate">{item}</span>
                      </div>
                      <span className="text-gray-400 flex-shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">
                        {count}개
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          {/* 키워드별 관련 영상 */}
          {selectedKw && (
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {`'${selectedKw}'`} 관련 영상
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {relatedVideos.length}개
                  </span>
                </div>
                <button
                  onClick={() => setSelectedKw(null)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={13} />
                  선택 해제
                </button>
              </div>

              {relatedVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {relatedVideos.map((v) => (
                    <VideoCard key={v.id} video={v} showRank />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-10">
                  제목 또는 태그에 해당 키워드가 포함된 영상이 없습니다.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
