"use client";

import { Eye, ThumbsUp, MessageSquare, Clock, Tv2, BarChart2 } from "lucide-react";
import type { YouTubeVideo } from "@/types/youtube";

function safe(n: string): number {
  const v = parseInt(n || "0", 10);
  return isNaN(v) ? 0 : v;
}

function formatCount(num: number): string {
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
  return num.toLocaleString();
}

function formatAge(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  if (hours < 24) return `${hours}시간`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월`;
  return `${Math.floor(days / 365)}년`;
}

interface KpiItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function KpiDashboard({ videos }: { videos: YouTubeVideo[] }) {
  if (!videos.length) return null;

  const now = Date.now();
  const count = videos.length;

  const totalViews = videos.reduce((s, v) => s + safe(v.statistics.viewCount), 0);

  const likeRates = videos
    .map((v) => {
      const views = safe(v.statistics.viewCount);
      return views > 0 ? (safe(v.statistics.likeCount) / views) * 100 : null;
    })
    .filter((r): r is number => r !== null);

  const commentRates = videos
    .map((v) => {
      const views = safe(v.statistics.viewCount);
      return views > 0 ? (safe(v.statistics.commentCount) / views) * 100 : null;
    })
    .filter((r): r is number => r !== null);

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : 0;

  const avgAge = avg(
    videos.map((v) => now - new Date(v.publishedAt).getTime())
  );

  const kpis: KpiItem[] = [
    {
      icon: <Eye size={14} className="text-blue-500" />,
      label: "총 조회수",
      value: formatCount(totalViews),
    },
    {
      icon: <BarChart2 size={14} className="text-indigo-500" />,
      label: "평균 조회수",
      value: formatCount(Math.round(totalViews / count)),
    },
    {
      icon: <ThumbsUp size={14} className="text-red-500" />,
      label: "평균 좋아요율",
      value: `${avg(likeRates).toFixed(2)}%`,
    },
    {
      icon: <MessageSquare size={14} className="text-green-500" />,
      label: "평균 댓글률",
      value: `${avg(commentRates).toFixed(2)}%`,
    },
    {
      icon: <Clock size={14} className="text-orange-500" />,
      label: "평균 업로드 경과",
      value: `평균 ${formatAge(avgAge)}`,
    },
    {
      icon: <Tv2 size={14} className="text-purple-500" />,
      label: "고유 채널 수",
      value: `${new Set(videos.map((v) => v.channelId)).size}개`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1.5">
            {kpi.icon}
            <span>{kpi.label}</span>
          </div>
          <div className="font-bold text-gray-900 text-sm leading-tight">{kpi.value}</div>
        </div>
      ))}
    </div>
  );
}
