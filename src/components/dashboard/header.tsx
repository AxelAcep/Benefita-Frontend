"use client";
import { LayoutList, BarChart2 } from "lucide-react";

type ViewMode = "table" | "chart";
interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function DashboardHeader({ viewMode, onViewModeChange }: Props) {
  const user = { nama: "Nanang", role: "Super Admin" };
  const initial = user.nama.charAt(0).toUpperCase();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-zinc-200 gap-3">

      {/* Kiri: Title */}
      <div className="min-w-0">
        <h1 className="text-black font-bold text-base leading-tight">Dashboard</h1>
        <p className="text-zinc-400 text-xs mt-0.5 truncate">{today}</p>
      </div>

      {/* Kanan: Switch + User */}
      <div className="flex items-center gap-2 sm:gap-16 shrink-0">

        {/* View Mode Switch */}
        <div className="flex items-center rounded-lg p-0.5 border border-zinc-200">
          <button
            onClick={() => onViewModeChange("table")}
            className={`flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "table"
                ? "bg-emerald-100 text-emerald-500 shadow-sm"
                : "text-zinc-400 hover:text-emerald-400"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Tabel</span>
          </button>
          <button
            onClick={() => onViewModeChange("chart")}
            className={`flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "chart"
                ? "bg-emerald-100 text-emerald-500 shadow-sm"
                : "text-zinc-400 hover:text-emerald-400"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Grafik</span>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-black text-xs font-semibold leading-tight">{user.nama}</p>
            <p className="text-zinc-400 text-[10px] leading-tight">{user.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initial}
          </div>
        </div>

      </div>
    </header>
  );
}