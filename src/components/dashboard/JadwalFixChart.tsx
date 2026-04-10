"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Icons } from "@/assets";
import StatusKehadiranCard from "./StatusKehadiran";

const attendanceData = [
  { initial: "R", name: "Raka",  divisi: "Marketing", status: "Masuk" as const },
  { initial: "L", name: "Lina",  divisi: "Marketing", status: "Masuk" as const },
  { initial: "Z", name: "Zahra", divisi: "Marketing", status: "Sakit" as const },
];

const pieData = [
  { name: "Masuk", value: 30, color: "#10b981" },
  { name: "Sakit", value: 3,  color: "#f87171" },
  { name: "Izin",  value: 2,  color: "#fbbf24" },
];

const generateLine = (base: number, variance: number) =>
  Array.from({ length: 31 }, (_, i) => base + Math.floor(Math.sin(i * 0.4) * variance + variance * 0.5));

const chartData = Array.from({ length: 31 }, (_, i) => ({
  hari: i + 1,
  januari:  generateLine(160, 20)[i],
  februari: generateLine(175, 18)[i],
  maret:    generateLine(185, 22)[i],
}));

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export default function JadwalFIXChart() {
  const [activeQ, setActiveQ] = useState<Quarter>("Q1");

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-4 pb-4">

      {/* Chart */}
      <div className="w-full lg:flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <img src={Icons.Jadwal.src} className="w-4 h-auto" />
            <span className="text-sm font-bold text-zinc-800">Jadwal FIX</span>
          </div>
          <div className="flex items-center gap-1">
            {(["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map((q) => (
              <button
                key={q}
                onClick={() => setActiveQ(q)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeQ === q
                    ? "bg-emerald-100 text-emerald-600"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis dataKey="hari" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} interval={4} />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="januari"  stroke="#134e4a" strokeWidth={2} dot={false} name="Januari"  />
            <Line type="monotone" dataKey="februari" stroke="#10b981" strokeWidth={2} dot={false} name="Februari" />
            <Line type="monotone" dataKey="maret"    stroke="#6ee7b7" strokeWidth={2} dot={false} name="Maret"    />
          </LineChart>
        </ResponsiveContainer>

        <div className="text-center mt-2">
          <p className="text-xs font-semibold text-emerald-500">
            5.2% bulan ini vs bulan Februari ↗
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Menampilkan data Jadwal FIX selama 3 bulan terakhir (Jan-Mar)
          </p>
        </div>
      </div>

      {/* Status Kehadiran */}
      <div className="w-full lg:w-72 shrink-0">
        <StatusKehadiranCard
          attendanceData={attendanceData}
          pieData={pieData}
          total={35}
        />
      </div>

    </div>
  );
}