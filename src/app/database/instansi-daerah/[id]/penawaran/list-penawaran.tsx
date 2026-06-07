"use client";

import { Search, Download, Pencil } from "lucide-react";
import { FileText } from "lucide-react";
import type { Penawaran } from "@/lib/services/perusahaan.service";
import { useState } from "react";
import { fetchWithAuth } from "@/lib/services/login.service";

interface Props {
  data: Penawaran[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearch: (v: string) => void;
  onEdit: (p: Penawaran) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string, file: File) => Promise<any>;
  onRetry: () => void;
}

export default function ListPenawaran({
  data,
  loading,
  error,
  search,
  onSearch,
  onEdit,
  onDelete,
  onUpload,
  onRetry,
}: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  const handleDownload = async (filePath: string) => {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/${filePath}`,
      {
        method: "GET",
      },
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop() ?? "file";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadClick = (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) await onUpload(id, file);
    };
    input.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <FileText className="w-4 h-4 text-emerald-500" />
          List Penawaran
        </span>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari informasi..."
            className="pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:ring-2 ring-emerald-500/20 w-48"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-xs text-red-600 flex items-center justify-between">
          {error}
          <button onClick={onRetry} className="underline font-medium">
            Coba lagi
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                No
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Tanggal
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                Kode
              </th>
              <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-xs text-zinc-400"
                >
                  Memuat...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-xs text-zinc-400"
                >
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {(page - 1) * pageSize + i + 1}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {new Date(row.tanggal).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                    {row.kodePelatihan.join(" | ")}
                  </td>
                  <td className="px-4 py-3 text-xs text-right">
                    <div className="flex items-center justify-end gap-3">
                      {row.filePath ? (
                        <button
                          onClick={() => handleDownload(row.filePath!)}
                          className="text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1"
                        >
                          <Download size={12} /> Download
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUploadClick(row.id)}
                          className="text-zinc-400 hover:text-emerald-500 font-semibold text-[11px]"
                        >
                          Upload File
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(row)}
                        className="text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100">
        <p className="text-[11px] text-zinc-400">
          Menampilkan {data.length === 0 ? 0 : (page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, data.length)} dari {data.length} data
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40"
          >
            ‹ Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-[11px] border rounded-lg ${p === page ? "bg-emerald-500 text-white border-emerald-500" : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>
  );
}
