"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ThumbsUp, MessageSquare, Clock, ArrowLeft, Calendar, Tag } from "lucide-react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { Settings } from "lucide-react";
import ApiKeyModal from "@/components/ApiKeyModal";
import CommentList from "@/components/CommentList";
import { YOUTUBE_CATEGORIES } from "@/types/youtube";
import type { YouTubeVideo, CommentsResponse } from "@/types/youtube";

function formatCount(n: string): string {
  const num = parseInt(n || "0");
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
  return num.toLocaleString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function VideoDetailClient({ videoId }: { videoId: string }) {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [comments, setComments] = useState<CommentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiKey) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/video?videoId=${videoId}`, { headers: { "X-API-Key": apiKey } }).then((r) =>
        r.json()
      ),
      fetch(`/api/comments?videoId=${videoId}&maxResults=20`, {
        headers: { "X-API-Key": apiKey },
      })
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([v, c]) => {
        if (v.error) throw new Error(v.error);
        setVideo(v);
        setComments(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [apiKey, videoId]);

  if (!loaded) return null;
  if (!apiKey) return <ApiKeyModal onSave={setApiKey} />;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-gray-100 rounded-2xl aspect-video animate-pulse" />
        <div className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <ArrowLeft size={16} /> 목록으로
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between gap-3">
          <span>{error || "영상을 찾을 수 없습니다."}</span>
          {error && (
            <button
              onClick={clearApiKey}
              className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Settings size={12} />
              API 키 재입력
            </button>
          )}
        </div>
      </div>
    );
  }

  const thumb =
    video.thumbnails.maxres?.url ||
    video.thumbnails.high?.url ||
    video.thumbnails.medium?.url ||
    "";

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition"
      >
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="relative aspect-video bg-gray-900">
          {thumb && (
            <Image
              src={thumb}
              alt={video.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          )}
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition group"
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[20px] border-transparent border-l-white ml-1" />
            </div>
          </a>
        </div>

        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{video.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-base">{video.channelTitle}</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(video.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {video.duration}
            </span>
            {video.categoryId && YOUTUBE_CATEGORIES[video.categoryId] && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {YOUTUBE_CATEGORIES[video.categoryId]}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                <Eye size={14} />조회수
              </div>
              <div className="font-bold text-gray-900">{formatCount(video.statistics.viewCount)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                <ThumbsUp size={14} />좋아요
              </div>
              <div className="font-bold text-gray-900">{formatCount(video.statistics.likeCount)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                <MessageSquare size={14} />댓글
              </div>
              <div className="font-bold text-gray-900">{formatCount(video.statistics.commentCount)}</div>
            </div>
          </div>

          {video.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">설명</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-[8] leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          {video.tags && video.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                <Tag size={14} />
                태그
              </div>
              <div className="flex flex-wrap gap-1.5">
                {video.tags.slice(0, 20).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            YouTube에서 보기
          </a>
        </div>
      </div>

      {comments && comments.comments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
          <CommentList
            videoId={video.id}
            apiKey={apiKey}
            initialComments={comments.comments}
            initialNextToken={comments.nextPageToken}
            totalCount={parseInt(video.statistics.commentCount || "0")}
          />
        </div>
      )}
    </div>
  );
}
