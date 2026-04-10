"use client";
import { X, Search } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Icons } from "@/assets";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

interface AttendanceItem {
  name: string;
  initial: string;
  divisi: string;
  status: "Masuk" | "Sakit" | "Izin";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  attendanceData: AttendanceItem[];
  pieData: { name: string; value: number; color: string }[];
  total: number;
}

const statusStyle: Record<string, string> = {
  Masuk: "bg-emerald-100 text-emerald-600",
  Sakit: "bg-red-100 text-red-500",
  Izin:  "bg-yellow-100 text-yellow-600",
};

export default function DetailKehadiranModal({ isOpen, onClose, attendanceData, pieData, total }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Side Panel */}
      <div className="relative z-10 bg-white w-80 h-full flex flex-col rounded-l-2xl shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-2">
            <img src={Icons.Kehadiran.src} className="w-4 h-auto" />
            <span className="font-semibold text-zinc-800 text-sm">Detail Kehadiran</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

          {/* Ringkasan */}
          <div>
            <p className="text-xs font-semibold text-zinc-700 mb-3">Ringkasan Hari Ini</p>
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wide">Total</span>
                  <span className="text-2xl font-bold text-zinc-800">{total}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] text-zinc-500">
                      {d.value} {d.name} ({Math.round(d.value / total * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100" />

          {/* Daftar Karyawan */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-700">Daftar Karyawan</p>
              <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
                <Search size={10} className="text-zinc-400" />
                <input
                  placeholder="Cari nama..."
                  className="text-[10px] bg-transparent outline-none text-zinc-600 w-20 placeholder:text-zinc-300"
                />
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 text-[10px] text-zinc-400 font-medium mb-1 uppercase tracking-wide border-b border-zinc-100 pb-1.5">
            <span>Nama</span>
            <span className="text-center">Divisi</span>
            <span className="text-right">Status</span>
            </div>

            {/* Rows */}
            <div>
            {attendanceData.map((a, index) => (
                <div
                key={index}
                className={`grid grid-cols-3 items-center py-2 px-1 ${
                    index % 2 === 0 ? "bg-zinc-100" : "bg-white"
                }`}
                >
                <div className="flex items-center gap-1.5">
                    <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: generatePastelBg(a.name), color: generatePastelText(a.name) }}
                    >
                    {a.initial}
                    </div>
                    <span className="text-xs text-zinc-700">{a.name}</span>
                </div>
                <span className="text-[11px] text-zinc-400 text-center">{a.divisi}</span>
                <div className="flex justify-end pr-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle[a.status]}`}>
                    {a.status}
                    </span>
                </div>
                </div>
            ))}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-3 border-t border-zinc-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  );
}