import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { TrendingUp, Sparkles, Youtube } from "lucide-react";
import ApiKeyButton from "@/components/ApiKeyButton";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";

export const metadata: Metadata = {
  title: "YouTube 트렌드 분석",
  description: "국가별 · 카테고리별 유튜브 급상승 영상 분석 툴",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <ApiKeyProvider>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-red-600">
              <Youtube size={22} />
              <span className="hidden sm:block">트렌드 분석</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <TrendingUp size={15} />
                급상승 TOP 100
              </Link>
              <Link
                href="/education"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <Sparkles size={15} />
                뷰티 TOP 30
              </Link>
            </nav>
            <div className="ml-auto">
              <ApiKeyButton />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </ApiKeyProvider>
      </body>
    </html>
  );
}
