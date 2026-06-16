"use client";

import { useState } from "react";
import { Key, ExternalLink, Eye, EyeOff } from "lucide-react";

interface Props {
  onSave: (key: string) => void;
}

export default function ApiKeyModal({ onSave }: Props) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Key size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">YouTube API 키 설정</h2>
            <p className="text-xs text-gray-500">브라우저에 안전하게 저장됩니다</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 mb-4 text-xs text-blue-700 leading-relaxed">
          <strong>API 키 발급 방법</strong>
          <ol className="mt-1 space-y-0.5 list-decimal list-inside">
            <li>Google Cloud Console 접속</li>
            <li>YouTube Data API v3 활성화</li>
            <li>사용자 인증 정보 → API 키 만들기</li>
          </ol>
          <a
            href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1 text-blue-600 hover:underline font-medium"
          >
            <ExternalLink size={12} />
            Google Cloud Console 열기
          </a>
        </div>

        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="AIza..."
            className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            onKeyDown={(e) => e.key === "Enter" && value.trim() && onSave(value.trim())}
          />
          <button
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          onClick={() => value.trim() && onSave(value.trim())}
          disabled={!value.trim()}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          저장하고 시작하기
        </button>
      </div>
    </div>
  );
}
