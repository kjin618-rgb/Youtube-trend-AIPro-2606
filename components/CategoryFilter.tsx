"use client";

import { YOUTUBE_CATEGORIES } from "@/types/youtube";
import clsx from "clsx";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

const FEATURED = ["0", "10", "17", "20", "24", "25", "27", "28", "22"];

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FEATURED.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={clsx(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            selected === id
              ? "bg-red-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {YOUTUBE_CATEGORIES[id]}
        </button>
      ))}
    </div>
  );
}
