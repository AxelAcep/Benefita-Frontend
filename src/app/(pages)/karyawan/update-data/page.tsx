"use client";
import { useLogPerubahan } from "@/hooks/use-perubahan-instansi";
import Sidebar from "@/components/sidebar";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { Icons } from "@/assets";

function Avatar({ name }: { name: string }) {
  const initial = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{
          backgroundColor: generatePastelBg(name),
          color: generatePastelText(name),
        }}
      >
        {initial}
      </div>
      <span className="text-xs text-zinc-700">{name}</span>
    </div>
  );
}

export default function PerubahanDataPage() {
  const { data, meta, isLoading, search, page, setPage, handleSearch } =
    useLogPerubahan();

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400 truncate">
              Karyawan & Aktivitas &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">
                Perubahan Data Perusahaan
              </span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini: Selasa, 3 Februari 2026
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: generatePastelBg("Nanang"),
                color: generatePastelText("Nanang"),
              }}
            >
              N
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-1.5 shrink-0">
                <img
                  src={Icons.Perubahan.src}
                  className="w-4 h-auto"
                  alt="Perubahan"
                />
                <span className="font-semibold text-zinc-800 text-xs">
                  Log Perubahan Data Perusahaan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 flex-1 sm:flex-none">
                  <Search size={11} className="text-zinc-400 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Cari perusahaan atau pegawai..."
                    className="text-xs bg-transparent outline-none text-zinc-600 w-full sm:w-40 placeholder:text-zinc-300"
                  />
                </div>
                <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0">
                  <Filter size={11} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: "500px" }}>
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px]">
                    {[
                      "No",
                      "Instansi",
                      "Field Diubah",
                      "User Update",
                      "Tgl. Update",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 font-medium whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {h}
                          {["Instansi", "User Update", "Tgl. Update"].includes(
                            h,
                          ) && <span className="text-zinc-300">⇅</span>}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-zinc-400"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-zinc-400"
                      >
                        Tidak ada data.
                      </td>
                    </tr>
                  ) : (
                    data.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${
                          index % 2 !== 0 ? "bg-zinc-50/50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-2.5 text-zinc-400 w-10">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-zinc-700 whitespace-nowrap">
                          {row.perusahaan.company}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">
                          {row.field}
                        </td>
                        <td className="px-4 py-2.5">
                          <Avatar name={row.diubahOleh} />
                        </td>
                        <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">
                          {new Date(row.tanggal).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-t border-zinc-100">
              <span className="text-[11px] text-zinc-400">
                Menampilkan{" "}
                <span className="font-semibold text-zinc-600">
                  {data.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-zinc-600">
                  {meta?.total ?? 0}
                </span>{" "}
                data
              </span>
              <div className="overflow-x-auto">
                <div className="flex items-center gap-1 w-max">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5 disabled:opacity-40"
                  >
                    <ChevronLeft size={12} /> Prev
                  </button>
                  {Array.from(
                    { length: Math.min(3, totalPages) },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                        page === p
                          ? "bg-emerald-500 text-white"
                          : "text-zinc-400 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {totalPages > 3 && (
                    <>
                      <span className="text-zinc-300 text-xs px-1">...</span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                          page === totalPages
                            ? "bg-emerald-500 text-white"
                            : "text-zinc-400 hover:bg-zinc-100"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded-md text-xs text-zinc-400 hover:bg-zinc-100 transition-colors flex items-center gap-0.5 disabled:opacity-40"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
