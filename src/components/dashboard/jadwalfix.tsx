"use client";

import { Icons } from "@/assets";
import { useState } from "react";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

interface MonthRow {
  bulan: string;
  values: (number | null)[];
  totalFix: number;
}

// Minggu 1-4, masing2 7 hari (Sen-Min), kolom ke-7 (Min-07) = hari ini highlight
const days = ["Sen","Sel","Rab","Kam","Jun","Sab","Min"];
const weeks = ["Minggu 1","Minggu 2","Minggu 3","Minggu 4"];

// Nomor tanggal per minggu
const weekDates = [
  ["01","02","03","04","05","06","07"],
  ["08","09","10","11","12","13","14"],
  ["15","16","17","18","19","20","21"],
  ["22","23","24","25","26","27","28"],
];

const monthData: MonthRow[] = [
  { bulan: "Januari",  values: [12,15,20,25,30,35,42, 45,null,null,null,null,null,null, null,null,null,null,null,null,null, null,null,null,null,null,null,null], totalFix: 42 },
  { bulan: "Februari", values: [14,18,22,28,35,40,45, 83,null,null,null,null,null,null, null,null,null,null,null,null,null, null,null,null,null,null,null,null], totalFix: 45 },
  { bulan: "Maret",    values: [16,20,25,30,35,42,48, 23,null,null,null,null,null,null, null,null,null,null,null,null,null, null,null,null,null,null,null,null], totalFix: 48 },
];

// Today highlight = kolom index 6 (Min-07) di Minggu 1
const TODAY_COL = 7;
const todayWeek = Math.floor(TODAY_COL / 7); // = 1
const todayDay  = TODAY_COL % 7;             // = 0

export default function JadwalFix() {
  const [activeQ, setActiveQ] = useState<Quarter>("Q1");

  return (
    <div className="mx-4 mb-4 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
            <span className="text-base">
                <img src={Icons.Jadwal.src} className="w-5 h-auto" />
            </span>
          <span className="font-bold text-zinc-800 text-sm">Jadwal FIX</span>
        </div>
        <div className="flex items-center gap-1">
          {(["Q1","Q2","Q3","Q4"] as Quarter[]).map((q) => (
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            {/* Row 1: Minggu labels */}
            <tr className="border-b border-zinc-100">
              <th className="text-left px-4 py-2 text-zinc-500 font-medium w-20">Bulan</th>
              {weeks.map((w, wi) => (
                <th key={w} colSpan={7} className="text-center py-2 text-zinc-700 font-medium tracking-wide text-[10px] uppercase border-l border-zinc-100">
                  {w}
                </th>
              ))}
              <th className="text-center px-3 py-2 text-zinc-500 font-medium text-[10px] leading-tight border-l border-zinc-100 w-20">
                Total FIX<br />Saat Ini
              </th>
            </tr>
            {/* Row 2: Day + date labels */}
            <tr className="border-b border-zinc-100">
              <th />
              {weeks.map((_, wi) =>
                days.map((d, di) => {
                  const colIndex = wi * 7 + di;
                  const isToday = wi === todayWeek && di === todayDay;
                  return (
                    <th
                      key={`${wi}-${di}`}
                      className={`text-center py-1.5 px-1 font-medium text-[10px] border-l border-zinc-100 ${
                        isToday ? "bg-emerald-500 text-white" : "text-zinc-400"
                      }`}
                    >
                      <div>{d}</div>
                      <div>{weekDates[wi][di]}</div>
                    </th>
                  );
                })
              )}
              <th className="border-l border-zinc-100" />
            </tr>
          </thead>
          <tbody>
            {monthData.map((row) => (
              <tr key={row.bulan} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 text-zinc-700 font-medium">{row.bulan}</td>
                {row.values.map((v, i) => {
                  const isToday = i === TODAY_COL;
                  return (
                    <td
                      key={i}
                      className={`text-center py-3 px-1 border-l border-zinc-100 ${
                        isToday ? "bg-emerald-50 font-bold text-emerald-600" : "text-zinc-600"
                      }`}
                    >
                      {v ?? ""}
                    </td>
                  );
                })}
                <td className="text-center py-3 px-3 font-bold text-emerald-500 border-l border-zinc-100">
                  {row.totalFix}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}