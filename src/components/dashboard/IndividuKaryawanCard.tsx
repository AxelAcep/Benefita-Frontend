"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

interface KaryawanData {
  initial: string;
  name: string;
  jabatan: string;
  updateHariIni: number;
  target: number;
  env: number;
  csr: number;
  tsm: number;
  epm: number;
  harian: number[];
  bulanan: { ten: number[]; fix: number[] };
}

const hariLabels = ["Sen", "Sel", "Rab", "Kam", "Jum"];
const bulanLabels = ["Jan", "Feb", "Mar"];

const categoryColor: Record<string, string> = {
  env: "#10b981",
  csr: "#6366f1",
  tsm: "#f59e0b",
  epm: "#8b5cf6",
};

export default function IndividuKaryawanCard({ data }: { data: KaryawanData }) {
  const [aktMode, setAktMode] = useState<"harian" | "mingguan">("harian");

  const harianData = hariLabels.map((h, i) => ({ hari: h, val: data.harian[i] }));
  const bulananData = bulanLabels.map((b, i) => ({
    bulan: b,
    ten: data.bulanan.ten[i],
    fix: data.bulanan.fix[i],
  }));

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 shrink-0 w-64 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: generatePastelBg(data.name), color: generatePastelText(data.name) }}
          >
            {data.initial}
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-800 leading-tight">{data.name}</p>
            <p className="text-[10px] text-zinc-400">{data.jabatan}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-400 leading-tight">Update Hari Ini</p>
          <p className="text-xs font-bold text-emerald-500">{data.updateHariIni}</p>
        </div>
      </div>

      {/* Progress Target */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-zinc-500">Progres Target Harian</span>
          <span className="text-[10px] font-semibold text-zinc-700">{data.target}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
            style={{ width: `${data.target}%` }}
          />
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-4 gap-1">
        {(["env","csr","tsm","epm"] as const).map((key) => (
          <div
            key={key}
            className="flex flex-col items-center py-1.5 rounded-lg"
            style={{ backgroundColor: `${categoryColor[key]}18` }}
          >
            <span className="text-[9px] font-semibold uppercase" style={{ color: categoryColor[key] }}>{key}</span>
            <span className="text-xs font-bold text-zinc-700">{data[key]}</span>
          </div>
        ))}
      </div>

      {/* Aktivitas Sales Chart */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-zinc-700">Aktivitas Sales</span>
          <div className="flex gap-1">
            {(["harian","mingguan"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setAktMode(m)}
                className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                  aktMode === m ? "bg-emerald-100 text-emerald-600" : "text-zinc-400"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width={224} height={80}>
          <BarChart data={harianData} barSize={14}>
            <XAxis dataKey="hari" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
            <Bar dataKey="val" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Perolehan Bulanan */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-zinc-700">Perolehan Bulanan</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[9px] text-zinc-400">TEN</span></div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-300" /><span className="text-[9px] text-zinc-400">FIX</span></div>
          </div>
        </div>
        <ResponsiveContainer width={224} height={80}>
          <BarChart data={bulananData} barSize={8} barGap={2}>
            <XAxis dataKey="bulan" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
            <Bar dataKey="ten" fill="#10b981" radius={[3, 3, 0, 0]} name="TEN" />
            <Bar dataKey="fix" fill="#6ee7b7" radius={[3, 3, 0, 0]} name="FIX" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}