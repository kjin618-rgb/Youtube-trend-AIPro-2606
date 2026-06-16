"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp, Hash, LayoutGrid, Flame, Tv2, GitCompare,
  Youtube, Menu, X,
} from "lucide-react";
import ApiKeyButton from "./ApiKeyButton";

const NAV = [
  { href: "/", icon: TrendingUp, label: "급상승 TOP 100", ready: true },
  { href: "/keyword", icon: Hash, label: "키워드 분석", ready: false },
  { href: "/categories", icon: LayoutGrid, label: "카테고리 비교", ready: true },
  { href: "/trends", icon: Flame, label: "트렌드 키워드", ready: true },
  { href: "/channel", icon: Tv2, label: "채널 분석", ready: false },
  { href: "/competitors", icon: GitCompare, label: "경쟁 채널 비교", ready: false },
];

function NavList({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
      {NAV.map(({ href, icon: Icon, label, ready }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-red-50 text-red-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon size={15} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
            {!ready && (
              <span className="ml-auto text-[10px] text-gray-300 flex-shrink-0">준비중</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 h-12 bg-white border-b border-gray-200">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          <Youtube size={16} className="text-red-600" />
          <span className="font-bold text-sm text-gray-900">트렌드 분석</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <Youtube size={17} className="text-red-600 flex-shrink-0" />
          <span className="font-bold text-sm text-gray-900">트렌드 분석</span>
        </div>
        <NavList pathname={pathname} />
        <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
          <ApiKeyButton />
        </div>
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-56 bg-white z-50 flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <Youtube size={16} className="text-red-600" />
                <span className="font-bold text-sm text-gray-900">트렌드 분석</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
            <NavList pathname={pathname} onClose={() => setMobileOpen(false)} />
            <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
              <ApiKeyButton />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
