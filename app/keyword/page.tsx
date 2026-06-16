"use client";

import { useState } from "react";
import { Hash, Search } from "lucide-react";

export default function KeywordPage() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="max-w-lg mx-auto pt-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
          <Hash size={18} className="text-gray-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-700 mb-1">키워드 분석</h2>
        <p className="text-sm text-gray-400">분석할 키워드를 입력하세요</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 먹방, K-pop, 게임"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 bg-white"
        />
        <button
          disabled
          className="px-4 py-2.5 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed flex items-center gap-1.5"
        >
          <Search size={14} />
          분석
        </button>
      </div>
      <p className="text-xs text-gray-300 mt-3 text-center">키워드 검색 분석 기능 준비 중</p>
    </div>
  );
}
