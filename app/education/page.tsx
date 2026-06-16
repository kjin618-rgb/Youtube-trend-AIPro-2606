import EducationClient from "@/components/EducationClient";
import { Sparkles } from "lucide-react";

export default function EducationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles size={24} className="text-pink-500" />
          뷰티 TOP 30
        </h1>
        <p className="text-gray-500 text-sm mt-1">국가별 뷰티 · 노하우 & 스타일 인기 동영상</p>
      </div>
      <EducationClient />
    </div>
  );
}
