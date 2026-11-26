"use client";

import type { AERow } from "@/lib/types/peserta-rekap-ae";
import React from "react";
import AppLayout from "@/components/app-layout";
import { usePesertaRekapAeManage } from "./manage";

function calcTotal(rows: AERow[]): AERow {
  const sum = (vals: (number | null)[]) => {
    const s = vals.reduce<number>((a, v) => a + (v ?? 0), 0);
    return s === 0 ? null : s;
  };
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ] as const;
  const result: AERow = {
    id: 0,
    ae: "Total",
    jan: { p: null, r: null },
    feb: { p: null, r: null },
    mar: { p: null, r: null },
    apr: { p: null, r: null },
    mei: { p: null, r: null },
    jun: { p: null, r: null },
    jul: { p: null, r: null },
    aug: { p: null, r: null },
    sep: { p: null, r: null },
    okt: { p: null, r: null },
    nov: { p: null, r: null },
    dec: { p: null, r: null },
    total: { p: null, r: null },
  };
  for (const m of months) {
    result[m].p = sum(rows.map((r) => r[m].p));
    result[m].r = sum(rows.map((r) => r[m].r));
  }
  result.total.p = sum(rows.map((r) => r.total.p));
  result.total.r = sum(rows.map((r) => r.total.r));
  return result;
}

function C({ val }: { val: number | null }) {
  if (val === null)
    return (
      <td className="px-1.5 py-2.5 text-center text-[10px] text-zinc-300 select-none w-7">
        –
      </td>
    );
  return (
    <td className="px-1.5 py-2.5 text-center text-[10px] text-zinc-600 font-medium w-7">
      {val}
    </td>
  );
}

const MONTHS = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "mei", label: "Mei" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "okt", label: "Okt" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
] as const;

interface RekapTableProps {
  title: string;
  rows: AERow[];
}

function RekapTable({ title, rows }: RekapTableProps) {
  const totalRow = calcTotal(rows);

  return (
    <div className="mb-6">
      {/* Section title */}
      <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100">
        <span className="text-[11px] font-semibold text-zinc-600">{title}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 1100 }}>
          <thead>
            {/* Month row */}
            <tr className="border-b border-zinc-100 bg-zinc-50/40">
              <th className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 text-left w-8">
                No ↕
              </th>
              <th className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 text-left w-24">
                AE
              </th>
              {MONTHS.map((m) => (
                <th
                  key={m.key}
                  colSpan={2}
                  className="text-[10px] font-semibold text-zinc-500 text-center border-l border-zinc-100"
                >
                  {m.label}
                </th>
              ))}
              <th
                colSpan={2}
                className="text-[10px] font-semibold text-zinc-500 text-center border-l border-zinc-100"
              >
                Total
              </th>
            </tr>
            {/* P/R row */}
            <tr className="border-b border-zinc-100 bg-zinc-50/20">
              <th className="px-3 py-1"></th>
              <th className="px-3 py-1"></th>
              {MONTHS.map((m) => (
                <React.Fragment key={m.key}>
                  <th className="px-1.5 py-1 text-[9px] font-semibold text-zinc-400 text-center border-l border-zinc-100 w-7">
                    P
                  </th>
                  <th className="px-1.5 py-1 text-[9px] font-semibold text-zinc-400 text-center w-7">
                    R
                  </th>
                </React.Fragment>
              ))}
              <th className="px-1.5 py-1 text-[9px] font-semibold text-zinc-400 text-center border-l border-zinc-100 w-7">
                P
              </th>
              <th className="px-1.5 py-1 text-[9px] font-semibold text-zinc-400 text-center w-7">
                R
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
              >
                <td className="px-3 py-2.5 text-[10px] text-zinc-400">
                  {i + 1}
                </td>
                <td className="px-3 py-2.5 text-[10px] text-zinc-700 font-medium">
                  {row.ae}
                </td>
                {MONTHS.map((m) => (
                  <React.Fragment key={m.key}>
                    <C val={row[m.key].p} />
                    <C val={row[m.key].r} />
                  </React.Fragment>
                ))}
                <C val={row.total.p} />
                <C val={row.total.r} />
              </tr>
            ))}

            {/* Total row */}
            <tr className="border-t border-zinc-200 bg-zinc-50/60 font-semibold">
              <td className="px-3 py-2.5 text-[10px] text-zinc-400"></td>
              <td className="px-3 py-2.5 text-[10px] text-zinc-700 font-bold">
                Total
              </td>
              {MONTHS.map((m) => (
                <React.Fragment key={m.key}>
                  <C val={totalRow[m.key].p} />
                  <C val={totalRow[m.key].r} />
                </React.Fragment>
              ))}
              <C val={totalRow.total.p} />
              <C val={totalRow.total.r} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PesertaRekapAeContainer() {
  const {
    activeTab,
    setActiveTab,
    selectedTahun,
    setSelectedTahun,
    search,
    setSearch,
    data,
  } = usePesertaRekapAeManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta" },
        { label: "Rekap Peserta per AE" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-zinc-100 px-4 pt-3 gap-1">
          <button
            onClick={() => setActiveTab("non-affiliate")}
            className={`px-4 py-2 text-[11px] font-semibold rounded-t-lg transition-colors ${
              activeTab === "non-affiliate"
                ? "bg-white border border-b-white border-zinc-200 text-emerald-600 -mb-px"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            List Rekap (Non-Affiliate)
          </button>
          <button
            onClick={() => setActiveTab("affiliate")}
            className={`px-4 py-2 text-[11px] font-semibold rounded-t-lg transition-colors ${
              activeTab === "affiliate"
                ? "bg-white border border-b-white border-zinc-200 text-emerald-600 -mb-px"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            List Rekap (Affiliate)
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-2">
          {/* Filter Tahun */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Tahun</span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Pilih Tahun"
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className="pl-2.5 pr-7 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all w-24 placeholder:text-zinc-400"
              />
              <svg
                className="absolute right-2 text-zinc-400 pointer-events-none"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>

          <button className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors">
            Terapkan
          </button>

          {/* Search */}
          <div className="relative ml-auto">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari informasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Tables */}
        <div className="p-4 flex flex-col gap-2">
          <RekapTable
            title={`Rekap Peserta Training REGULAR per Tahun (FIX)`}
            rows={data.regular}
          />
          <RekapTable title="Peserta Tentatif" rows={data.tentatif} />
          <RekapTable title="Peserta Cancel" rows={data.cancel} />
        </div>
      </div>
    </AppLayout>
  );
}
