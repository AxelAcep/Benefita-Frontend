"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Icons } from "@/assets";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import DetailKehadiranModal from "./kehadiranModal";

interface AttendanceItem {
  name: string;
  initial: string;
  divisi: string;
  status: "Masuk" | "Sakit" | "Izin";
}

interface PieItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  attendanceData: AttendanceItem[];
  pieData: PieItem[];
  total: number;
}

const statusStyle: Record<string, string> = {
  Masuk: "bg-emerald-100 text-emerald-600",
  Sakit: "bg-red-100 text-red-500",
  Izin:  "bg-yellow-100 text-yellow-600",
};

export default function StatusKehadiranCard({ attendanceData, pieData, total }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full shrink-0 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100">
          <img src={Icons.Kehadiran.src} className="w-5 h-auto" />
          <span className="font-bold text-zinc-800 text-sm">Status Kehadiran</span>
        </div>

        {/* Donut Chart */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} orang`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-zinc-400">Total</span>
              <span className="text-2xl font-bold text-zinc-800">{total}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-1 mb-3">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] text-zinc-500">{d.value} {d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Karyawan */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-3 text-[10px] text-zinc-400 font-medium mb-2 uppercase tracking-wide">
            <span>Karyawan</span>
            <span className="text-center">Divisi</span>
            <span className="text-right">Status</span>
          </div>
          <div className="space-y-2">
            {attendanceData.map((a, index) => (
              <div key={index} className="grid grid-cols-3 items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: generatePastelBg(a.name), color: generatePastelText(a.name) }}
                  >
                    {a.initial}
                  </div>
                  <span className="text-xs text-zinc-700 font-medium">{a.name}</span>
                </div>
                <span className="text-[11px] text-zinc-400 text-center">{a.divisi}</span>
                <div className="flex justify-end">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lihat Detail */}
        <div className="px-4 py-3 border-t border-zinc-100 mt-2">
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-xs text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
          >
            Lihat Detail
          </button>
        </div>
      </div>

      <DetailKehadiranModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        attendanceData={attendanceData}
        pieData={pieData}
        total={total}
      />
    </>
  );
}