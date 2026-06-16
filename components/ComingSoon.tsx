import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ComingSoon({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={22} className="text-gray-400" />
      </div>
      <h2 className="text-base font-semibold text-gray-700 mb-1.5">{title}</h2>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      <span className="mt-5 text-xs text-gray-300 border border-gray-200 rounded-full px-3 py-1">
        준비 중
      </span>
    </div>
  );
}
