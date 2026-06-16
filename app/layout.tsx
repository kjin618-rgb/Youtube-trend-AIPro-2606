import type { Metadata } from "next";
import "./globals.css";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "YouTube 트렌드 분석",
  description: "국가별 · 카테고리별 유튜브 급상승 영상 분석 툴",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <ApiKeyProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
              <main className="px-4 pt-14 pb-6 md:p-6">{children}</main>
            </div>
          </div>
        </ApiKeyProvider>
      </body>
    </html>
  );
}
