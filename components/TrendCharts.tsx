"use client";

import type { ReactNode } from "react";
import { Eye, ThumbsUp } from "lucide-react";
import type { YouTubeVideo } from "@/types/youtube";

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

interface BarItem {
  label: string;
  value: number;
  display: string;
}

function HBarChart({
  title,
  icon,
  items,
  barColor,
}: {
  title: string;
  icon: ReactNode;
  items: BarItem[];
  barColor: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-3">
        {icon}
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">데이터 없음</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-gray-400 flex-shrink-0 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gray-700 truncate mb-0.5 leading-tight" title={item.label}>
                  {item.label}
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all`}
                    style={{ width: `${(item.value / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-gray-500 flex-shrink-0 w-12 text-right">{item.display}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrendCharts({ videos }: { videos: YouTubeVideo[] }) {
  if (!videos.length) return null;

  const viewTop10 = [...videos]
    .sort((a, b) => safeInt(b.statistics.viewCount) - safeInt(a.statistics.viewCount))
    .slice(0, 10)
    .map((v) => ({
      label: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title,
      value: safeInt(v.statistics.viewCount),
      display: fmtCount(safeInt(v.statistics.viewCount)),
    }));

  const likeRateTop10 = [...videos]
    .map((v) => {
      const views = safeInt(v.statistics.viewCount);
      const likes = safeInt(v.statistics.likeCount);
      const rate = views > 0 ? (likes / views) * 100 : 0;
      return {
        label: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title,
        value: rate,
        display: `${rate.toFixed(2)}%`,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <HBarChart
        title="조회수 TOP 10"
        icon={<Eye size={14} className="text-red-500" />}
        items={viewTop10}
        barColor="bg-red-400"
      />
      <HBarChart
        title="좋아요율 TOP 10"
        icon={<ThumbsUp size={14} className="text-amber-500" />}
        items={likeRateTop10}
        barColor="bg-amber-400"
      />
    </div>
  );
}
