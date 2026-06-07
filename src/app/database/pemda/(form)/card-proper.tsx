"use client";

import React, { useState, useEffect } from "react";
import { BarChart2, ChevronDown, Pencil } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface StatistikProperRow {
  tahun: number;
  emas: string;
  hijau: string;
  biru: string;
  merah: string;
  hitam: string;
}

export interface StatistikProperFormData {
  rows: StatistikProperRow[];
}

interface CardStatistikProperProps {
  initialData?: Partial<StatistikProperFormData>;
  onChange?: (data: StatistikProperFormData) => void;
  disabled?: boolean;
  isEdit?: boolean;
  onEdit?: () => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function toNum(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function calcTotal(row: StatistikProperRow) {
  return (
    toNum(row.emas) +
    toNum(row.hijau) +
    toNum(row.biru) +
    toNum(row.merah) +
    toNum(row.hitam)
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const COLUMNS: {
  key: keyof Omit<StatistikProperRow, "tahun">;
  label: string;
  color: string;
}[] = [
  { key: "emas", label: "Emas", color: "bg-yellow-400" },
  { key: "hijau", label: "Hijau", color: "bg-green-400" },
  { key: "biru", label: "Biru", color: "bg-blue-400" },
  { key: "merah", label: "Merah", color: "bg-red-400" },
  { key: "hitam", label: "Hitam", color: "bg-zinc-800" },
];

export default function CardStatistikProper({
  initialData = {},
  onChange,
  disabled = false,
  isEdit = false,
  onEdit,
}: CardStatistikProperProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState<StatistikProperFormData>({
    rows: initialData.rows ?? [],
  });

  useEffect(() => {
    setForm({ rows: initialData.rows ?? [] });
  }, [initialData]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <BarChart2 className="w-4 h-4 text-emerald-500" />
          Statistik PROPER (Jumlah Perusahaan PROPER)
        </span>

        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((p) => !p)}
            className="p-1 hover:bg-zinc-50 rounded-md transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 py-4 overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-0">
            {/* Column headers */}
            <thead>
              <tr>
                <th className="w-16 pb-3" />
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="pb-3 text-center font-medium text-zinc-500"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      {col.label}
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.color}`}
                      />
                    </span>
                  </th>
                ))}
                <th className="pb-3 text-center font-medium text-zinc-500">
                  Total
                </th>
              </tr>
            </thead>

            {/* Rows */}
            <tbody>
              {form.rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-zinc-300">
                    Belum ada data
                  </td>
                </tr>
              ) : (
                form.rows.map((row) => (
                  <tr
                    key={row.tahun}
                    className="border-b border-zinc-100 last:border-b-0"
                  >
                    {/* Tahun */}
                    <td className="py-2 pr-3 text-xs text-zinc-500 font-medium whitespace-nowrap">
                      {row.tahun}
                    </td>

                    {/* Nilai per kategori */}
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="py-2 px-1">
                        <div className="px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-700 min-w-[60px]">
                          {row[col.key] || (
                            <span className="text-zinc-300">0</span>
                          )}
                        </div>
                      </td>
                    ))}

                    {/* Total */}
                    <td className="py-2 pl-1">
                      <div className="px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-700 min-w-[60px]">
                        {calcTotal(row)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
