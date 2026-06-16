"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ThumbsUp, MessageSquare, Clock } from "lucide-react";
import type { YouTubeVideo } from "@/types/youtube";

function formatCount(n: string): string {
  const num = parseInt(n || "0");
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
  return num.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

interface Props {
  video: YouTubeVideo;
  showRank?: boolean;
}

export default function VideoCard({ video, showRank = true }: Props) {
  const thumb =
    video.thumbnails.high?.url ||
    video.thumbnails.medium?.url ||
    video.thumbnails.default?.url ||
    "";

  return (
    <Link href={`/video/${video.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-red-200">
        <div className="relative aspect-video bg-gray-100">
          {thumb && (
            <Image
              src={thumb}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {showRank && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              #{video.rank}
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            <Clock size={10} />
            {video.duration}
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2 truncate">{video.channelTitle}</p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {formatCount(video.statistics.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={12} />
              {formatCount(video.statistics.likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {formatCount(video.statistics.commentCount)}
            </span>
            <span className="ml-auto text-gray-300">{timeAgo(video.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
