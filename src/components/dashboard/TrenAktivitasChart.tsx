"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data30 = [
  { tgl: "01 Feb", val: 120 }, { tgl: "02 Feb", val: 85  }, { tgl: "03 Feb", val: 140 },
  { tgl: "04 Feb", val: 160 }, { tgl: "05 Feb", val: 175 }, { tgl: "06 Feb", val: 90  },
  { tgl: "07 Feb", val: 110 }, { tgl: "08 Feb", val: 195 }, { tgl: "09 Feb", val: 150 },
  { tgl: "10 Feb", val: 130 }, { tgl: "11 Feb", val: 165 }, { tgl: "12 Feb", val: 200 },
  { tgl: "13 Feb", val: 145 }, { tgl: "14 Feb", val: 180 }, { tgl: "15 Feb", val: 155 },
  { tgl: "16 Feb", val: 210 }, { tgl: "17 Feb", val: 230 }, { tgl: "18 Feb", val: 175 },
  { tgl: "19 Feb", val: 190 }, { tgl: "20 Feb", val: 220 }, { tgl: "21 Feb", val: 160 },
  { tgl: "22 Feb", val: 240 }, { tgl: "23 Feb", val: 255 }, { tgl: "24 Feb", val: 200 },
  { tgl: "25 Feb", val: 270 }, { tgl: "26 Feb", val: 185 }, { tgl: "27 Feb", val: 140 },
  { tgl: "28 Feb", val: 95  },
];

const data7 = data30.slice(-7);

export default function TrenAktivitasChart() {
  const [range, setRange] = useState<"30" | "7">("30");
  const chartData = range === "30" ? data30 : data7;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-bold text-zinc-800">Tren Aktivitas Mingguan/Harian (Bulanan)</p>
          <p className="text-[11px] text-zinc-400 mb-4">Total Aktivitas Tim (1 Bulan Terakhir)</p>
        </div>
        <div className="flex items-center gap-1">
          {(["30", "7"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                range === r ? "bg-emerald-100 text-emerald-600" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {r} Hari
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={range === "30" ? 8 : 20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
          <XAxis dataKey="tgl" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }} />
          <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} name="Aktivitas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}