"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  totalData?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  pageSize?: number;
  isLoading?: boolean;
  emptyMessage?: string;
}

function SortIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T = any>({
  columns,
  data,
  totalData = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  searchPlaceholder = "Cari Informasi...",
  searchValue = "",
  onSearchChange,
  filterSlot,
  actionSlot,
  pageSize = 10,
  isLoading = false,
  emptyMessage = "Tidak ada data tersedia.",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const startItem = totalData === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalData);

  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .dt-scale-outer {
            overflow: hidden;
            min-height: 100vh;
          }
          .dt-scale-inner {
            transform: scale(0.82);
            transform-origin: top left;
            width: calc(100% / 0.82);
          }
        }
      `}</style>

      <div className="dt-scale-outer">
        <div className="dt-scale-inner bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-zinc-100 gap-3">
            {filterSlot && (
              <div className="flex flex-wrap items-center gap-2">
                {filterSlot}
              </div>
            )}
            <div className={cn(
              "flex items-center gap-2",
              filterSlot ? "w-full sm:w-auto" : "w-full"
            )}>
              {onSearchChange && (
                <div className="relative flex-1 sm:flex-none">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
                    width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full sm:w-48 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
                  />
                </div>
              )}
              {actionSlot && (
                <div className="shrink-0 ml-auto sm:ml-0">
                  {actionSlot}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-100">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={cn(
                        "px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap text-left",
                        col.sortable && "cursor-pointer select-none hover:text-zinc-600",
                        col.headerClassName
                      )}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && (
                          <span className={sortKey === col.key ? "text-emerald-500" : ""}>
                            {sortKey === col.key
                              ? sortDir === "asc" ? "↑" : "↓"
                              : <SortIcon />}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-50">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          <div className="h-3.5 w-full animate-pulse rounded bg-zinc-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-xs text-zinc-400"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  data.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn("px-4 py-3 text-xs text-zinc-600 whitespace-nowrap", col.className)}
                        >
                          {col.render
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? col.render((row as any)[col.key], row, rowIndex)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : ((row as any)[col.key] as React.ReactNode) ?? (
                                <span className="text-zinc-300">-</span>
                              )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Menampilkan{" "}
              <span className="font-semibold text-zinc-600">{startItem}–{endItem}</span>{" "}
              dari{" "}
              <span className="font-semibold text-zinc-600">{totalData}</span> data
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ‹ Sebelumnya
              </button>
              {pages.map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="px-1 text-[11px] text-zinc-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange?.(p as number)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors",
                      p === currentPage
                        ? "bg-emerald-500 text-white"
                        : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Selanjutnya ›
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default DataTable; 