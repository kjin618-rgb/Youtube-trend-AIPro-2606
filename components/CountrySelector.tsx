"use client";

import { YOUTUBE_COUNTRIES } from "@/types/youtube";

interface Props {
  selected: string;
  onChange: (code: string) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
    >
      {Object.entries(YOUTUBE_COUNTRIES).map(([code, name]) => (
        <option key={code} value={code}>
          {name} ({code})
        </option>
      ))}
    </select>
  );
}
