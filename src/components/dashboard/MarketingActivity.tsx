"use client";
import { Icons } from "@/assets";
import { useState } from "react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import StatusKehadiranCard from "./StatusKehadiran";
import { useMarketingActivity, useKehadiran } from "@/hooks/use-dashboard";

function totalDaily(row: {
  senin: number;
  selasa: number;
  rabu: number;
  kamis: number;
  jumat: number;
}) {
  return row.senin + row.selasa + row.rabu + row.kamis + row.jumat;
}

export default function MarketingActivityTable() {
  const { data: aeData, loading: loadingAE } = useMarketingActivity();
  const {
    attendanceData,
    pieData,
    total,
    loading: loadingKehadiran,
  } = useKehadiran();

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 p-4 pb-4">
      {/* ── Tabel Monitoring ── */}
      <div className="w-full lg:flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <img src={Icons.Monitor.src} alt="Monitor" className="w-4 h-4" />
            <span className="font-bold text-zinc-800 text-sm">
              Monitoring Aktivitas Marketing
            </span>
          </div>
          <span className="text-xs text-zinc-600 font-semibold bg-zinc-100 px-2 py-1 rounded-lg shrink-0">
            {new Date().toLocaleString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="text-xs"
            style={{ minWidth: "780px", width: "100%" }}
          >
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th
                  rowSpan={2}
                  className="text-left px-4 py-2 text-zinc-500 font-semibold sticky left-0 bg-zinc-50 z-10 border-r border-zinc-100 w-28"
                >
                  AE
                </th>
                <th
                  colSpan={5}
                  className="text-center py-2 text-zinc-400 font-semibold tracking-wide uppercase text-[10px] border-b border-zinc-100 border-l border-zinc-100"
                >
                  Aktivitas Harian
                </th>
                <th
                  rowSpan={2}
                  className="text-center px-3 py-2 text-zinc-500 font-semibold text-[10px] leading-tight border-l border-zinc-100"
                >
                  TOTAL
                  <br />
                  DAILY
                </th>
                <th
                  colSpan={2}
                  className="text-center py-2 text-zinc-400 font-semibold tracking-wide uppercase text-[10px] border-b border-zinc-100 border-l border-zinc-100"
                >
                  {new Date().toLocaleString("id-ID", { month: "long" })}
                </th>
                <th
                  colSpan={4}
                  className="text-center py-2 text-zinc-400 font-semibold tracking-wide uppercase text-[10px] border-b border-zinc-100 border-l border-zinc-100"
                >
                  Training Category
                </th>
                <th
                  rowSpan={2}
                  className="text-center px-2 py-2 text-emerald-600 font-semibold text-[10px] leading-tight border-l border-zinc-100 w-14"
                >
                  UPDATE
                  <br />
                  DATA
                </th>
              </tr>
              <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px] bg-zinc-50">
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((d) => (
                  <th
                    key={d}
                    className="text-center py-2 px-2 font-medium border-l border-zinc-100 first:border-l-0"
                  >
                    {d}
                  </th>
                ))}
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">
                  Fix
                </th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">
                  Ten
                </th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">
                  ENV
                </th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">
                  CSR
                </th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">
                  TSM
                </th>
                <th className="text-center py-2 px-2 font-medium border-l border-zinc-100">
                  EPM
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingAE ? (
                <tr>
                  <td
                    colSpan={14}
                    className="text-center py-8 text-zinc-400 text-xs"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : aeData.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="text-center py-8 text-zinc-400 text-xs"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                aeData.map((row) => {
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
                          <span className="font-medium text-zinc-700 whitespace-nowrap">
                            {row.name}
                          </span>
                        </div>
                      </td>

                      {/* Harian */}
                      {[
                        row.senin,
                        row.selasa,
                        row.rabu,
                        row.kamis,
                        row.jumat,
                      ].map((v, i) => (
                        <td
                          key={i}
                          className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums"
                        >
                          {v}
                        </td>
                      ))}

                      {/* Total Daily */}
                      <td className="text-center py-2.5 px-3 font-bold text-emerald-600 bg-emerald-50 border-l border-zinc-100 tabular-nums">
                        {total}
                      </td>

                      {/* FIX & TEN */}
                      <td className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums">
                        {row.fix}
                      </td>
                      <td className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums">
                        {row.ten}
                      </td>

                      {/* Training Category */}
                      {[row.env, row.csr, row.tsm, row.epm].map((v, i) => (
                        <td
                          key={i}
                          className="text-center py-2.5 px-2 text-zinc-600 border-l border-zinc-100 tabular-nums"
                        >
                          {v.toLocaleString("id-ID")}
                        </td>
                      ))}

                      {/* Update Data */}
                      <td className="text-center py-2.5 px-2 text-zinc-400 border-l border-zinc-100 tabular-nums">
                        {row.updateData}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Status Kehadiran ── */}
      <div className="w-full lg:w-72 shrink-0">
        {loadingKehadiran ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm h-full flex items-center justify-center text-xs text-zinc-400 p-8">
            Memuat data...
          </div>
        ) : (
          <StatusKehadiranCard
            attendanceData={attendanceData}
            pieData={pieData}
            total={total}
          />
        )}
      </div>
    </div>
  );
}
