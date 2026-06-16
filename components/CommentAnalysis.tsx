"use client";

import { ThumbsUp, HelpCircle, Hash, Smile } from "lucide-react";
import {
  getTopLikedComments,
  analyzeQuestions,
  analyzeSentiment,
  extractKeywords,
  normalizeText,
} from "@/lib/textAnalysis";
import type { YouTubeComment } from "@/types/youtube";

function pct(n: number, total: number) {
  return total > 0 ? ((n / total) * 100).toFixed(1) : "0.0";
}

export default function CommentAnalysis({ comments }: { comments: YouTubeComment[] }) {
  if (!comments.length) return null;

  const topLiked = getTopLikedComments(comments, 3);
  const questionCount = analyzeQuestions(comments);
  const sentiment = analyzeSentiment(comments);
  const keywords = extractKeywords(
    comments.map((c) => normalizeText(c.textDisplay)),
    { limit: 10 }
  );

  const posW = sentiment.total > 0 ? (sentiment.positive / sentiment.total) * 100 : 0;
  const negW = sentiment.total > 0 ? (sentiment.negative / sentiment.total) * 100 : 0;
  const neuW = 100 - posW - negW;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-1.5">
        <Smile size={14} className="text-blue-500" />
        댓글 반응 요약
        <span className="text-xs font-normal text-gray-400">{comments.length}개 기준</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 좋아요 많은 댓글 TOP 3 */}
        {topLiked.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
              <ThumbsUp size={12} />
              좋아요 많은 댓글 TOP {topLiked.length}
            </div>
            <div className="space-y-2">
              {topLiked.map((c) => {
                const plain = normalizeText(c.textDisplay);
                return (
                  <div key={c.id} className="bg-white rounded-lg p-2.5 border border-gray-100">
                    <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                      {plain.length > 0 ? plain.slice(0, 130) : c.textDisplay.replace(/<[^>]*>/g, "").slice(0, 130)}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                      <ThumbsUp size={10} />
                      <span>{c.likeCount.toLocaleString()}</span>
                      <span className="ml-1.5 truncate">— {c.authorDisplayName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* 긍정/부정/중립 */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
              <Smile size={12} />
              긍정 / 부정 추정
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-200 mb-2">
              <div className="bg-green-400 transition-all" style={{ width: `${posW}%` }} />
              <div className="bg-red-400 transition-all" style={{ width: `${negW}%` }} />
              <div className="bg-gray-300 transition-all" style={{ width: `${neuW}%` }} />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                긍정 {sentiment.positive}
                <span className="text-gray-400">({pct(sentiment.positive, sentiment.total)}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                부정 {sentiment.negative}
                <span className="text-gray-400">({pct(sentiment.negative, sentiment.total)}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                중립 {sentiment.neutral}
                <span className="text-gray-400">({pct(sentiment.neutral, sentiment.total)}%)</span>
              </span>
            </div>
          </div>

          {/* 질문형 댓글 */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
              <HelpCircle size={12} />
              질문형 댓글
            </div>
            <p className="text-lg font-bold text-gray-900 leading-none">
              {questionCount}
              <span className="text-xs font-normal text-gray-400 ml-1.5">
                / {comments.length}개 ({pct(questionCount, comments.length)}%)
              </span>
            </p>
          </div>
        </div>

        {/* 반복 키워드 TOP 10 */}
        {keywords.length > 0 && (
          <div className="sm:col-span-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
              <Hash size={12} />
              반복 키워드 TOP 10
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map(({ word, count }, i) => (
                <span
                  key={word}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
                    i === 0
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : i < 3
                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                      : "bg-gray-50 text-gray-600 border-gray-100"
                  }`}
                >
                  {word}
                  <span className="opacity-50 font-semibold">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
