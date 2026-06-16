import ComingSoon from "@/components/ComingSoon";
import { LayoutGrid } from "lucide-react";

export default function CategoriesPage() {
  return (
    <ComingSoon
      icon={LayoutGrid}
      title="카테고리 비교"
      description="카테고리별 조회수·좋아요율·업로드 패턴을 비교합니다."
    />
  );
}
