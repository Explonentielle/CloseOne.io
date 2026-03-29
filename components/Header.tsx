"use client";

import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[#2A2F35] bg-[#1A1F24]/70 backdrop-blur-xl flex items-center justify-end px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button className="relative text-[#A0A0A0] hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0D1117]" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">
              Julien De Bonnières
            </p>
            <p className="text-[11px] text-[#A0A0A0]">Senior Closer</p>
          </div>
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-[#0D1117]">
            JDB
          </div>
        </div>
      </div>
    </header>
  );
}