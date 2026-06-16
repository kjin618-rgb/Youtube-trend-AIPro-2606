import TrendingClient from "@/components/TrendingClient";
import { TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={24} className="text-red-600" />
          급상승 동영상 TOP 100
        </h1>
        <p className="text-gray-500 text-sm mt-1">국가 및 카테고리별 실시간 인기 동영상</p>
      </div>
      <TrendingClient />
    </div>
  );
}
