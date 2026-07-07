"use client";

import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

export default function HalamanMenyusulPage() {
  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              <span className="font-semibold text-zinc-700">Halaman</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini: Selasa, 3 Februari 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: generatePastelBg("Nanang"),
                color: generatePastelText("Nanang"),
              }}
            >
              N
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <div>
              <p className="text-base font-bold text-zinc-800">
                Halaman Menyusul
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Halaman ini sedang dalam pengembangan dan akan segera tersedia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
