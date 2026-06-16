"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, MessageSquare, ChevronDown } from "lucide-react";
import type { YouTubeComment } from "@/types/youtube";
import CommentAnalysis from "@/components/CommentAnalysis";

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
  videoId: string;
  apiKey: string;
  initialComments: YouTubeComment[];
  initialNextToken?: string;
  totalCount: number;
}

export default function CommentList({
  videoId,
  apiKey,
  initialComments,
  initialNextToken,
  totalCount,
}: Props) {
  const [comments, setComments] = useState<YouTubeComment[]>(initialComments);
  const [nextToken, setNextToken] = useState(initialNextToken);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextToken || loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comments?videoId=${videoId}&pageToken=${nextToken}&maxResults=20`,
        { headers: { "X-API-Key": apiKey } }
      );
      const data = await res.json();
      setComments((prev) => [...prev, ...data.comments]);
      setNextToken(data.nextPageToken);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <CommentAnalysis comments={comments} />
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare size={20} className="text-red-500" />
        댓글 {totalCount.toLocaleString()}개
      </h2>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="flex-shrink-0">
              {c.authorProfileImageUrl ? (
                <Image
                  src={c.authorProfileImageUrl}
                  alt={c.authorDisplayName}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                  {c.authorDisplayName[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">{c.authorDisplayName}</span>
                <span className="text-xs text-gray-400">{timeAgo(c.publishedAt)}</span>
              </div>
              <p
                className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.textDisplay }}
              />
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                {c.likeCount > 0 && (
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={12} />
                    {c.likeCount.toLocaleString()}
                  </span>
                )}
                {c.replyCount > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    답글 {c.replyCount}개
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {nextToken && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-6 w-full py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
          ) : (
            <>
              <ChevronDown size={16} />
              댓글 더 보기
            </>
          )}
        </button>
      )}
    </div>
  );
}
