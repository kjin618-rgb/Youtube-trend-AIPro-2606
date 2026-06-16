"use client";

import type { ReactNode } from "react";
import { Hash, Tag, Tv2 } from "lucide-react";
import { extractKeywords, countFrequencies } from "@/lib/textAnalysis";
import type { YouTubeVideo } from "@/types/youtube";
import type { FreqItem, StrFreqItem } from "@/lib/textAnalysis";

const CHIP_COLORS = [
  "bg-red-50 text-red-700 border-red-100",
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-purple-50 text-purple-700 border-purple-100",
  "bg-green-50 text-green-700 border-green-100",
  "bg-orange-50 text-orange-700 border-orange-100",
];

function Panel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function KeywordChips({ items }: { items: FreqItem[] }) {
  if (!items.length) return <p className="text-xs text-gray-400">데이터 없음</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(({ word, count }, i) => (
        <span
          key={word}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
        >
          {word}
          <span className="opacity-50 font-semibold">{count}</span>
        </span>
      ))}
    </div>
  );
}

function TagChips({ items }: { items: StrFreqItem[] }) {
  if (!items.length) return <p className="text-xs text-gray-400">태그 데이터 없음</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(({ item, count }, i) => (
        <span
          key={item}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
        >
          {item}
          <span className="opacity-50 font-semibold">{count}</span>
        </span>
      ))}
    </div>
  );
}

export default function KeywordAnalysis({ videos }: { videos: YouTubeVideo[] }) {
  if (!videos.length) return null;

  const titleKeywords = extractKeywords(videos.map((v) => v.title), { limit: 10 });
  const tagFreqs = countFrequencies(videos.flatMap((v) => v.tags ?? []), 10);
  const channelFreqs = countFrequencies(videos.map((v) => v.channelTitle), 5);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
        <Hash size={14} className="text-red-500" />
        트렌드 키워드 분석
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panel icon={<Hash size={12} />} title="제목 키워드 TOP 10">
          <KeywordChips items={titleKeywords} />
        </Panel>

        <Panel icon={<Tag size={12} />} title="태그 TOP 10">
          <TagChips items={tagFreqs} />
        </Panel>

        <Panel icon={<Tv2 size={12} />} title="자주 등장한 채널 TOP 5">
          {channelFreqs.length ? (
            <div className="space-y-1.5">
              {channelFreqs.map(({ item, count }, i) => (
                <div key={item} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-gray-400 w-3 flex-shrink-0">{i + 1}</span>
                    <span className="text-gray-800 truncate">{item}</span>
                  </div>
                  <span className="text-gray-400 flex-shrink-0">{count}개</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">데이터 없음</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
