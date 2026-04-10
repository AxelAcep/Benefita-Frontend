"use client";
import { Icons } from "@/assets";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import DetailKehadiranModal from "./kehadiranModal";
import { useState } from "react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import StatusKehadiranCard from "./StatusKehadiran";

// ─── Types ───
interface AERow {
  initial: string;
  name: string;
  senin: number;
  selasa: number;
  rabu: number;
  kamis: number;
  jumat: number;
  fix: number;
  ten: number;
  env: number;
  csr: number;
  tsm: number;
  epm: number;
  updateData: number;
}

interface AttendanceItem {
  name: string;
  initial: string;
  color: string;
  divisi: string;
  status: "Masuk" | "Sakit" | "Izin";
}

// ─── Dummy Data ───
const aeData: AERow[] = [
  { initial: "E", name: "Eni",     senin: 5,  selasa: 0, rabu: 19, kamis: 5,  jumat: 1,  fix: 4,  ten: 2, env: 600,  csr: 532,   tsm: 341,   epm: 598,   updateData: 0 },
  { initial: "M", name: "Mulyadi", senin: 0,  selasa: 0, rabu: 0,  kamis: 0,  jumat: 0,  fix: 0,  ten: 0, env: 9101, csr: 14534, tsm: 13669, epm: 14105, updateData: 0 },
  { initial: "S", name: "Sylva",   senin: 0,  selasa: 10,rabu: 2,  kamis: 8,  jumat: 4,  fix: 10, ten: 5, env: 563,  csr: 498,   tsm: 370,   epm: 582,   updateData: 0 },
  { initial: "R", name: "Rifqi",   senin: 16, selasa: 0, rabu: 20, kamis: 19, jumat: 19, fix: 3,  ten: 0, env: 463,  csr: 122,   tsm: 121,   epm: 212,   updateData: 0 },
  { initial: "W", name: "Wulan",   senin: 0,  selasa: 0, rabu: 20, kamis: 17, jumat: 19, fix: 7,  ten: 1, env: 597,  csr: 583,   tsm: 313,   epm: 346,   updateData: 0 },
  { initial: "A", name: "Arista",  senin: 20, selasa: 0, rabu: 20, kamis: 11, jumat: 18, fix: 2,  ten: 0, env: 464,  csr: 145,   tsm: 63,    epm: 173,   updateData: 0 },
  { initial: "B", name: "Biyan",   senin: 20, selasa: 0, rabu: 20, kamis: 19, jumat: 18, fix: 5,  ten: 0, env: 210,  csr: 115,   tsm: 90,    epm: 302,   updateData: 0 },
  { initial: "J", name: "Jeane",   senin: 20, selasa: 0, rabu: 19, kamis: 20, jumat: 18, fix: 0,  ten: 1, env: 563,  csr: 156,   tsm: 85,    epm: 269,   updateData: 0 },
];

const attendanceData: AttendanceItem[] = [
  { initial: "R", name: "Raka",   color: "#ef4444", divisi: "Marketing", status: "Masuk" },
  { initial: "L", name: "Lina",   color: "#6366f1", divisi: "Marketing", status: "Masuk" },
  { initial: "Z", name: "Zahra",  color: "#8b5cf6", divisi: "Marketing", status: "Sakit" },
  { initial: "L", name: "Linas",  color: "#6366f1", divisi: "Marketing", status: "Masuk" },
  { initial: "Z", name: "Zahras", color: "#8b5cf6", divisi: "Marketing", status: "Sakit" },
];

const pieData = [
  { name: "Masuk", value: 30, color: "#10b981" },
  { name: "Sakit", value: 3,  color: "#f87171" },
  { name: "Izin",  value: 2,  color: "#fbbf24" },
];

function totalDaily(row: AERow) {
  return row.senin + row.selasa + row.rabu + row.kamis + row.jumat;
}

// ─── Component ───
export default function MarketingActivityTable() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 p-4 pb-4">

      {/* ── Tabel Monitoring ── */}
      <div className="w-full lg:flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <img src={Icons.Monitor.src} alt="Monitor" className="w-4 h-4" />
            <span className="font-bold text-zinc-800 text-sm">Monitoring Aktivitas Marketing</span>
          </div>
          <span className="text-xs text-zinc-600 font-semibold bg-zinc-100 px-2 py-1 rounded-lg shrink-0">
            Februari 2026
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="text-xs" style={{ minWidth: "780px", width: "100%" }}>
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {/* AE */}
                <th
                  rowSpan={2}
                  className="text-left px-4 py-2 text-zinc-500 font-semibold sticky left-0 bg-zinc-50 z-10 border-r border-zinc-100 w-28"
                >
                  AE
                </th>
                {/* Aktivitas Harian */}
                <th
                  colSpan={5}
                  className="text-center py-2 text-zinc-400 font-semibold tracking-wide uppercase text-[10px] border-b border-zinc-100 border-l border-zinc-100"
                >
                  Aktivitas Harian
                </th>
                {/* Total Daily */}
                <th
                  rowSpan={2}
                  className="text-center px-3 py-2 text-zinc-500 font-semibold text-[10px] leading-tight border-l border-zinc-100"
                >
                  TOTAL<br />DAILY
                </th>
                {/* Februari */}
                <th
                  colSpan={2}
                  className="text-center py-2 text-zinc-400 font-semibold tracking-wide uppercase text-[10px] border-b border-zinc-100 border-l border-zinc-100"
                >
                  Februari
                </th>
                {/* Training Category */}
                <th
                  colSpan={4}
                  className="text-center py-2 text-zinc-400 font-semibold tracking-wide uppercase text-[10px] border-b border-zinc-100 border-l border-zinc-100"
                >
                  Training Category
                </th>
                {/* Update Data */}
                <th
                  rowSpan={2}
                  className="text-center px-2 py-2 text-emerald-600 font-semibold text-[10px] leading-tight border-l border-zinc-100 w-14"
                >
                  UPDATE<br />DATA
                </th>
              </tr>
              <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px] bg-zinc-50">
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((d) => (
                  <th key={d} className="text-center py-2 px-2 font-medium border-l border-zinc-100 first:border-l-0">
                    {d}
                  </th>
                ))}
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">Fix</th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">Ten</th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">ENV</th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">CSR</th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">TSM</th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">EPM</th>
              </tr>
            </thead>
            <tbody>
              {aeData.map((row, idx) => {
                const total = totalDaily(row);
                return (
                  <tr
                    key={row.name}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors even:bg-zinc-100"
                  >
                    {/* AE Name — sticky */}
                    <td className="px-4 py-2.5 sticky left-0 bg-white border-r border-zinc-100 z-10 even:bg-zinc-50/50">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{
                            backgroundColor: generatePastelBg(row.name),
                            color: generatePastelText(row.name),
                          }}
                        >
                          {row.initial}
                        </div>
                        <span className="font-medium text-zinc-700 whitespace-nowrap">{row.name}</span>
                      </div>
                    </td>

                    {/* Harian */}
                    {[row.senin, row.selasa, row.rabu, row.kamis, row.jumat].map((v, i) => (
                      <td key={i} className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums">
                        {v}
                      </td>
                    ))}

                    {/* Total Daily */}
                    <td className="text-center py-2.5 px-3 font-bold text-emerald-600 bg-emerald-50 border-l border-zinc-100 tabular-nums">
                      {total}
                    </td>

                    {/* FIX & TEN */}
                    <td className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums">{row.fix}</td>
                    <td className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums">{row.ten}</td>

                    {/* Training Category */}
                    {[row.env, row.csr, row.tsm, row.epm].map((v, i) => (
                      <td key={i} className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums">
                        {v.toLocaleString("id-ID")}
                      </td>
                    ))}

                    {/* Update Data */}
                    <td className="text-center py-2.5 px-2 text-zinc-400 border-l border-zinc-100 tabular-nums">
                      {row.updateData}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Status Kehadiran ── */}
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