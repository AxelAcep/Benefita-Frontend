"use client";

import { Icons } from "@/assets";
import { useState } from "react";
import { useJadwalFix } from "@/hooks/use-dashboard";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

const days = ["Sen", "Sel", "Rab", "Kam", "Jun", "Sab", "Min"];
const weeks = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];
const weekDates = [
  ["01", "02", "03", "04", "05", "06", "07"],
  ["08", "09", "10", "11", "12", "13", "14"],
  ["15", "16", "17", "18", "19", "20", "21"],
  ["22", "23", "24", "25", "26", "27", "28"],
];

const now = new Date();
const todayDate = now.getDate();
const TODAY_COL = todayDate <= 28 ? todayDate - 1 : -1;
const todayWeek = Math.floor(TODAY_COL / 7);
const todayDay = TODAY_COL % 7;

export default function JadwalFix() {
  const [activeQ, setActiveQ] = useState<Quarter>("Q1");
  const { data: monthData, loading } = useJadwalFix(activeQ);

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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-4 py-2 text-zinc-500 font-medium w-20">
                Bulan
              </th>
              {weeks.map((w) => (
                <th
                  key={w}
                  colSpan={7}
                  className="text-center py-2 text-zinc-700 font-medium tracking-wide text-[10px] uppercase border-l border-zinc-100"
                >
                  {w}
                </th>
              ))}
              <th className="text-center px-3 py-2 text-zinc-500 font-medium text-[10px] leading-tight border-l border-zinc-100 w-20">
                Total FIX
                <br />
                Saat Ini
              </th>
            </tr>
            <tr className="border-b border-zinc-100">
              <th />
              {weeks.map((_, wi) =>
                days.map((d, di) => {
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
                }),
              )}
              <th className="border-l border-zinc-100" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={30}
                  className="text-center py-8 text-zinc-400 text-xs"
                >
                  Memuat data...
                </td>
              </tr>
            ) : monthData.length === 0 ? (
              <tr>
                <td
                  colSpan={30}
                  className="text-center py-8 text-zinc-400 text-xs"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              monthData.map((row) => (
                <tr
                  key={row.bulan}
                  className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-4 py-3 text-zinc-700 font-medium">
                    {row.bulan}
                  </td>
                  {row.values.map((v, i) => {
                    const isToday = i === TODAY_COL;
                    return (
                      <td
                        key={i}
                        className={`text-center py-3 px-1 border-l border-zinc-100 ${
                          isToday
                            ? "bg-emerald-50 font-bold text-emerald-600"
                            : "text-zinc-600"
                        }`}
                      >
                        {v === null ? "" : v === 0 ? "" : v}
                      </td>
                    );
                  })}
                  <td className="text-center py-3 px-3 font-bold text-emerald-500 border-l border-zinc-100">
                    {row.totalFix}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
