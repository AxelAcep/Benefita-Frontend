"use client";

import { useState, useMemo, Fragment } from "react";
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
import TrainerHariModal from "./trainer-hari-modal";

type CategoryType = "ENV" | "CSR" | "TSM" | "EPM" | "publik" | "inhouse";

const categoryColor: Record<CategoryType, string> = {
  ENV: "bg-emerald-100 text-emerald-700",
  CSR: "bg-blue-100 text-blue-700",
  TSM: "bg-purple-100 text-purple-700",
  EPM: "bg-yellow-100 text-yellow-700",
  publik: "bg-red-100 text-red-700",
  inhouse: "bg-red-100 text-red-700",
};

const jenisRowColor: Record<string, string> = {
  // Value baru (kode) — dipakai jadwal yang dibuat setelah JENIS_OPTIONS
  // di form tambah/edit diringkas jadi kode singkat.
  REG: "",
  RFM: "bg-emerald-50",
  INH: "bg-purple-100",
  UJI: "bg-yellow-100",
  KON: "bg-blue-100",
  // Backward-compat — jadwal lama masih nyimpen label penuh di DB.
  Regular: "",
  Refreshment: "bg-emerald-50",
  "In House": "bg-purple-100",
  "Uji Kompetensi": "bg-yellow-100",
  Konsultasi: "bg-blue-100",
};

// Sticky header — nempel di atas pas tabelnya di-scroll vertikal (lihat
// wrapper `overflow-auto max-h-[65vh]` di bawah). Perlu bg-white eksplisit
// biar baris di bawahnya gak keliatan numpuk pas header lagi nempel.
const stickyThCls = "sticky top-0 z-10 bg-white";

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

// Ambil tanggal Senin dari minggu yang berisi `dateStr` — dipakai buat
// ngelompokin baris training per minggu (biar baris tanggal cuma tampil
// sekali per minggu, gak diulang di tiap training).
function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = minggu, 1 = senin, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
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

  // Modal assign trainer per hari
  const [trainerModalNoJadwal, setTrainerModalNoJadwal] = useState<
    string | null
  >(null);
  const [trainerModalJudul, setTrainerModalJudul] = useState<string>("");
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);

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
    const days = [
      "senin",
      "selasa",
      "rabu",
      "kamis",
      "jumat",
      "sabtu",
      "minggu",
    ];
    const dayLabels = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
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
      <div className="overflow-auto max-h-[65vh]">
        <table className="w-full text-xs" style={{ minWidth: "900px" }}>
          <thead>
            <tr className="border-b border-zinc-100 text-zinc-400">
              {weekDays.map((d) => (
                <th
                  key={d.key}
                  className={`${stickyThCls} text-left px-3 py-2.5 font-medium w-24`}
                >
                  <div className="text-zinc-600 font-semibold text-xs whitespace-nowrap">
                    {d.label}
                  </div>
                </th>
              ))}
              <th
                className={`${stickyThCls} text-left px-3 py-2.5 font-medium whitespace-nowrap`}
              >
                Judul Training
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium`}
              >
                Ten
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium`}
              >
                Fix
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium`}
              >
                Status
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium`}
              >
                Jenis
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium`}
              >
                Peserta
              </th>
              <th
                className={`${stickyThCls} text-left px-3 py-2.5 font-medium`}
              >
                Lokasi
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium whitespace-nowrap`}
              >
                Trainer
              </th>
              <th
                className={`${stickyThCls} text-center px-3 py-2.5 font-medium`}
              >
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={16}
                  className="text-center py-8 text-zinc-400 text-xs"
                >
                  Memuat data...
                </td>
              </tr>
            ) : trainingData.length === 0 ? (
              <tr>
                <td
                  colSpan={16}
                  className="text-center py-8 text-zinc-400 text-xs"
                >
                  Tidak ada jadwal
                </td>
              </tr>
            ) : (
              trainingData.map((row, ri) => {
                // Tampilin baris tanggal (Senin-Minggu) sekali tiap kali
                // minggu-nya beda dari baris sebelumnya — biar gak
                // redundan diulang di tiap training yang tanggalnya sama.
                const weekStart = row.tglMulai
                  ? getWeekStart(row.tglMulai)
                  : null;
                const prevWeekStart =
                  ri > 0 && trainingData[ri - 1].tglMulai
                    ? getWeekStart(trainingData[ri - 1].tglMulai as string)
                    : null;
                const showWeekHeader =
                  weekStart !== null && weekStart !== prevWeekStart;

                return (
                  <Fragment key={ri}>
                    {showWeekHeader && (
                      <tr className="bg-zinc-50/70 border-b border-zinc-100">
                        {weekDays.map((d, di) => {
                          const date = new Date(weekStart as string);
                          date.setDate(date.getDate() + di);
                          return (
                            <td
                              key={d.key}
                              className="px-3 py-1.5 text-center text-[10px] font-semibold text-zinc-400"
                            >
                              {date.getDate()}
                            </td>
                          );
                        })}
                        <td colSpan={9} />
                      </tr>
                    )}
                    <tr
                      className={`border-b border-zinc-100 transition-colors hover:brightness-95 ${jenisRowColor[row.jenis] ?? ""}`}
                    >
                      {weekDays.map((d) => {
                        const match = row.days.find((rd) => rd.day === d.key);
                        return (
                          <td key={d.key} className="px-3 py-3 align-top">
                            {match && (
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${categoryColor[match.tipe as CategoryType] ?? ""}`}
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
                        <button
                          type="button"
                          onClick={() => {
                            setTrainerModalNoJadwal(row.noJadwal);
                            setTrainerModalJudul(row.judul);
                            setTrainerModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                        >
                          Trainer
                        </button>
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
                  </Fragment>
                );
              })
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

      <TrainerHariModal
        noJadwal={trainerModalNoJadwal}
        judulFallback={trainerModalJudul}
        open={trainerModalOpen}
        onOpenChange={(next) => {
          setTrainerModalOpen(next);
          if (!next) setTrainerModalNoJadwal(null);
        }}
      />
    </div>
  );
}
