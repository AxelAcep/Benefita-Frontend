"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { Icons } from "@/assets";
import Link from "next/link";
import { useKalenderTraining } from "@/hooks/use-dashboard";

type CategoryType = "WM" | "CSR" | "TSM" | "EPM";

const categoryColor: Record<CategoryType, string> = {
  WM: "bg-emerald-100 text-emerald-700",
  CSR: "bg-blue-100 text-blue-700",
  TSM: "bg-purple-100 text-purple-700",
  EPM: "bg-yellow-100 text-yellow-700",
};

const jenisRowColor: Record<string, string> = {
  REG: "",
  Regular: "",
  Refreshment: "",
  "In House": "bg-purple-100",
  "Uji Kompetensi": "bg-yellow-100",
  Konsultasi: "bg-blue-100",
};

const BULAN_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const TAHUN_OPTIONS = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() - 2 + i,
);

function LokasiIcon({ type }: { type: "hybrid" | "online" | "hotel" }) {
  if (type === "online")
    return <Monitor className="w-3 h-3 inline mr-1 text-zinc-400" />;
  return <MapPin className="w-3 h-3 inline mr-1 text-zinc-400" />;
}

// Generate 4 bulan mulai dari bulan aktif
function getMonthPages(startMonth: number, year: number) {
  return Array.from({ length: 4 }, (_, i) => {
    const m = ((startMonth - 1 + i) % 12) + 1;
    const y = year + Math.floor((startMonth - 1 + i) / 12);
    return { bulan: m, tahun: y, label: `${BULAN_NAMES[m - 1]} ${y}` };
  });
}

export default function KalenderTraining() {
  const now = new Date();

  const [activeBulan, setActiveBulan] = useState(now.getMonth() + 1);
  const [activeTahun, setActiveTahun] = useState(now.getFullYear());
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const monthPages = useMemo(
    () => getMonthPages(activeBulan, activeTahun),
    [activeBulan, activeTahun],
  );

  const [activePage, setActivePage] = useState(0); // index 0-3

  const selectedBulan = monthPages[activePage].bulan;
  const selectedTahun = monthPages[activePage].tahun;

  const {
    data: trainingData,
    total,
    loading,
  } = useKalenderTraining({
    bulan: selectedBulan,
    tahun: selectedTahun,
    search: search || undefined,
  });

  // Hari-hari di bulan yang dipilih
  const weekDays = useMemo(() => {
    const days = ["senin", "selasa", "rabu", "kamis", "jumat"];
    const dayLabels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    return days.map((key, i) => ({
      key,
      label: dayLabels[i],
    }));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div className="mx-4 mb-20 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <img
              src={Icons.Kalender.src}
              className="w-4 h-auto"
              alt="kalender"
            />
            <span className="font-semibold text-zinc-800 text-xs whitespace-nowrap">
              Kalender Training Benefita
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Filter bulan & tahun */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5" />
                {BULAN_NAMES[activeBulan - 1]} {activeTahun}
              </button>
              {showFilter && (
                <div className="absolute right-0 top-8 z-20 bg-white border border-zinc-200 rounded-xl shadow-lg p-3 flex gap-3 min-w-[220px]">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Bulan
                    </span>
                    <select
                      value={activeBulan}
                      onChange={(e) => {
                        setActiveBulan(Number(e.target.value));
                        setActivePage(0);
                        setShowFilter(false);
                      }}
                      className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none"
                    >
                      {BULAN_NAMES.map((b, i) => (
                        <option key={b} value={i + 1}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Tahun
                    </span>
                    <select
                      value={activeTahun}
                      onChange={(e) => {
                        setActiveTahun(Number(e.target.value));
                        setActivePage(0);
                        setShowFilter(false);
                      }}
                      className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none"
                    >
                      {TAHUN_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari jadwal..."
                className="pl-7 pr-2.5 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 w-32"
              />
            </form>
            <Link
              href="/training/jadwal/tambah"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Jadwal
            </Link>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 border-b border-zinc-100">
        <span className="text-xs text-zinc-500 font-medium shrink-0">
          Ket warna kategori:
        </span>
        {[
          { label: "ENV (Hijau)", color: "bg-emerald-400" },
          { label: "CSR (Biru)", color: "bg-blue-400" },
          { label: "TSM (Ungu)", color: "bg-purple-400" },
          { label: "EPM (Kuning Tua)", color: "bg-yellow-400" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-xs text-zinc-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: "900px" }}>
          <thead>
            <tr className="border-b border-zinc-100 text-zinc-400">
              {weekDays.map((d) => (
                <th
                  key={d.key}
                  className="text-left px-3 py-2.5 font-medium w-24"
                >
                  <div className="text-zinc-600 font-semibold text-xs whitespace-nowrap">
                    {d.label}
                  </div>
                </th>
              ))}
              <th className="text-left px-3 py-2.5 font-medium whitespace-nowrap">
                Judul Training
              </th>
              <th className="text-center px-3 py-2.5 font-medium">Ten</th>
              <th className="text-center px-3 py-2.5 font-medium">Fix</th>
              <th className="text-center px-3 py-2.5 font-medium">Status</th>
              <th className="text-center px-3 py-2.5 font-medium">Jenis</th>
              <th className="text-center px-3 py-2.5 font-medium">Peserta</th>
              <th className="text-left px-3 py-2.5 font-medium">Lokasi</th>
              <th className="text-center px-3 py-2.5 font-medium whitespace-nowrap">
                No Jadwal
              </th>
              <th className="text-center px-3 py-2.5 font-medium">Trainer</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={14}
                  className="text-center py-8 text-zinc-400 text-xs"
                >
                  Memuat data...
                </td>
              </tr>
            ) : trainingData.length === 0 ? (
              <tr>
                <td
                  colSpan={14}
                  className="text-center py-8 text-zinc-400 text-xs"
                >
                  Tidak ada jadwal
                </td>
              </tr>
            ) : (
              trainingData.map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-b border-zinc-100 transition-colors hover:brightness-95 ${jenisRowColor[row.jenis] ?? ""}`}
                >
                  {weekDays.map((d) => {
                    const match = row.days.find((rd) => rd.day === d.key);
                    return (
                      <td key={d.key} className="px-3 py-3 align-top">
                        {match && (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${categoryColor[match.category as CategoryType] ?? ""}`}
                          >
                            {match.code}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 min-w-[160px]">
                    <span className="text-emerald-500 hover:text-emerald-600 cursor-pointer font-medium">
                      {row.judul}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3 text-zinc-600">
                    {row.ten}
                  </td>
                  <td className="text-center px-3 py-3 text-zinc-600">
                    {row.fix}
                  </td>
                  <td className="text-center px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {row.isHot && (
                        <span className="text-yellow-400 text-sm leading-none">
                          ★
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                          row.isHot
                            ? "bg-orange-100 text-orange-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-center px-3 py-3 text-zinc-500">
                    {row.jenis}
                  </td>
                  <td className="text-center px-3 py-3 text-zinc-600">
                    {row.peserta}
                  </td>
                  <td className="px-3 py-3 text-zinc-500 whitespace-nowrap">
                    <LokasiIcon type={row.lokasiType} />
                    {row.lokasiDetail}
                  </td>
                  <td className="text-center px-3 py-3">
                    <Link
                      href={`/training/jadwal/${row.noJadwal}`}
                      className="text-emerald-500 hover:text-emerald-600 cursor-pointer whitespace-nowrap"
                    >
                      {row.noJadwal}
                    </Link>
                  </td>
                  <td className="text-center px-3 py-3">
                    <Link
                      href={`/input/${row.noJadwal}`}
                      className="text-emerald-500 hover:text-emerald-600 flex items-center justify-center gap-0.5 text-xs whitespace-nowrap"
                    >
                      Lihat Detail <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-t border-zinc-100">
        <span className="text-xs text-zinc-400">
          Menampilkan{" "}
          <span className="font-medium text-zinc-600">
            {trainingData.length}
          </span>{" "}
          dari <span className="font-medium text-zinc-600">{total}</span> jadwal
        </span>
        <div className="overflow-x-auto pb-0.5">
          <div className="flex items-center gap-1 w-max">
            {monthPages.map((mp, i) => (
              <button
                key={mp.label}
                onClick={() => setActivePage(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  activePage === i
                    ? "bg-emerald-500 text-white"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {mp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
