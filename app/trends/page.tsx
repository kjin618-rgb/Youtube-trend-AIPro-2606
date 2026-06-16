import ComingSoon from "@/components/ComingSoon";
import { Flame } from "lucide-react";

export default function TrendsPage() {
  return (
    <ComingSoon
      icon={Flame}
      title="트렌드 키워드"
      description="시간대별 급상승 키워드와 주제 클러스터를 파악합니다."
    />
  );
}
