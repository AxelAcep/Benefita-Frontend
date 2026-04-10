"use client";

import { useState } from "react";
import { Search, Filter, Plus, MapPin, Monitor, ArrowRight } from "lucide-react";
import { Icons } from "@/assets";

type WeekPage = "Minggu 1" | "Minggu 2" | "Minggu 3" | "Minggu 4" | "Minggu 5";
type StatusType = "Run" | "RUN" | "Pending";
type CategoryType = "WM" | "CSR" | "TSM" | "EPM";

interface ScheduleDay {
  day: "senin" | "selasa" | "rabu" | "kamis" | "jumat";
  code: string;
  category: CategoryType;
}

interface TrainingRow {
  judul: string;
  ten: number;
  fix: number;
  status: StatusType;
  isHot?: boolean;
  jenis: string;
  peserta: number;
  lokasi: string;
  lokasiType: "hybrid" | "online" | "hotel";
  lokasiDetail: string;
  noJadwal: string;
  days: ScheduleDay[];
}

const categoryColor: Record<CategoryType, string> = {
  WM:  "bg-emerald-100 text-emerald-700",
  CSR: "bg-blue-100 text-blue-700",
  TSM: "bg-purple-100 text-purple-700",
  EPM: "bg-yellow-100 text-yellow-700",
};

const trainingData: TrainingRow[] = [
  {
    judul: "PCUA (AIR) - Sertifikasi BNSP",
    ten: 2, fix: 4, status: "Run", jenis: "REG", peserta: 10,
    lokasi: "Hybrid - Cikarang", lokasiType: "hybrid", lokasiDetail: "Cikarang",
    noJadwal: "262902",
    days: [
      { day: "senin",  code: "WM-08", category: "WM" },
      { day: "selasa", code: "WM-08", category: "WM" },
      { day: "rabu",   code: "WM-08", category: "WM" },
    ],
  },
  {
    judul: "Ahli K3 Umum",
    ten: 5, fix: 12, status: "Run", jenis: "UJI", peserta: 15,
    lokasi: "Online Zoom", lokasiType: "online", lokasiDetail: "Online Zoom",
    noJadwal: "262903",
    days: [
      { day: "selasa", code: "WM-08", category: "WM" },
    ],
  },
  {
    judul: "Manajemen CSR",
    ten: 8, fix: 20, status: "RUN", isHot: true, jenis: "REG", peserta: 28,
    lokasi: "Online Zoom", lokasiType: "online", lokasiDetail: "Online Zoom",
    noJadwal: "262984",
    days: [
      { day: "rabu",   code: "CSR-01", category: "CSR" },
      { day: "kamis",  code: "CSR-01", category: "CSR" },
    ],
  },
  {
    judul: "Training Sales Mastery",
    ten: 3, fix: 6, status: "Run", jenis: "REG", peserta: 9,
    lokasi: "Hotel Sahid", lokasiType: "hotel", lokasiDetail: "Hotel Sahid",
    noJadwal: "262985",
    days: [
      { day: "senin", code: "TSM-02", category: "TSM" },
    ],
  },
  {
    judul: "Training Sales Mastery",
    ten: 3, fix: 6, status: "Run", jenis: "REG", peserta: 9,
    lokasi: "Hotel Sahid", lokasiType: "hotel", lokasiDetail: "Hotel Sahid",
    noJadwal: "262985",
    days: [
      { day: "senin", code: "TSM-02", category: "TSM" },
    ],
  },
];

const weekPages: WeekPage[] = ["Minggu 1","Minggu 2","Minggu 3","Minggu 4","Minggu 5"];
const weekDays = [
  { key: "senin",  label: "Senin",  date: "02 Feb" },
  { key: "selasa", label: "Selasa", date: "03 Feb" },
  { key: "rabu",   label: "Rabu",   date: "04 Feb" },
  { key: "kamis",  label: "Kamis",  date: "05 Feb" },
  { key: "jumat",  label: "Jumat",  date: "06 Feb" },
];

function LokasiIcon({ type }: { type: "hybrid" | "online" | "hotel" }) {
  if (type === "online") return <Monitor className="w-3 h-3 inline mr-1 text-zinc-400" />;
  return <MapPin className="w-3 h-3 inline mr-1 text-zinc-400" />;
}

export default function KalenderTraining() {
  const [activePage, setActivePage] = useState<WeekPage>("Minggu 1");
  const [search, setSearch] = useState("");

  const filtered = trainingData.filter(t =>
    t.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-4 mb-20 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100">
        {/* Row 1: judul + search */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <img src={Icons.Kalender.src} className="w-4 h-auto" alt="kalender" />
            <span className="font-semibold text-zinc-800 text-xs whitespace-nowrap">Kalender Training Benefita</span>
          </div>
          <div className="relative shrink-0">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari jadwal..."
              className="pl-7 pr-2.5 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 w-32"
            />
          </div>
        </div>
        {/* Row 2: tombol filter + tambah rata kiri */}
        <div className="flex items-center justify-start gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-zinc-100 overflow-x-auto">
        <span className="text-xs text-zinc-500 font-medium shrink-0">Ket warna kategori:</span>
        {[
          { label: "ENV (Hijau)",      color: "bg-emerald-400" },
          { label: "CSR (Biru)",       color: "bg-blue-400" },
          { label: "TSM (Ungu)",       color: "bg-purple-400" },
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
                <th key={d.key} className="text-left px-3 py-2.5 font-medium w-24">
                  <div className="text-zinc-600 font-semibold text-xs whitespace-nowrap">{d.label}</div>
                  <div className="text-zinc-400 font-normal whitespace-nowrap">{d.date}</div>
                </th>
              ))}
              <th className="text-left px-3 py-2.5 font-medium whitespace-nowrap">Judul Training</th>
              <th className="text-center px-3 py-2.5 font-medium">Ten</th>
              <th className="text-center px-3 py-2.5 font-medium">Fix</th>
              <th className="text-center px-3 py-2.5 font-medium">Status</th>
              <th className="text-center px-3 py-2.5 font-medium">Jenis</th>
              <th className="text-center px-3 py-2.5 font-medium">Peserta</th>
              <th className="text-left px-3 py-2.5 font-medium">Lokasi</th>
              <th className="text-center px-3 py-2.5 font-medium whitespace-nowrap">No Jadwal</th>
              <th className="text-center px-3 py-2.5 font-medium">Trainer</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, ri) => (
              <tr key={ri} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                {weekDays.map((d) => {
                  const match = row.days.find(rd => rd.day === d.key);
                  return (
                    <td key={d.key} className="px-3 py-3 align-top">
                      {match && (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${categoryColor[match.category]}`}>
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
                <td className="text-center px-3 py-3 text-zinc-600">{row.ten}</td>
                <td className="text-center px-3 py-3 text-zinc-600">{row.fix}</td>
                <td className="text-center px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {row.isHot && <span className="text-yellow-400">★</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                      row.status === "RUN"
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-100 text-emerald-600"
                    }`}>
                      {row.status}
                    </span>
                  </div>
                </td>
                <td className="text-center px-3 py-3 text-zinc-500">{row.jenis}</td>
                <td className="text-center px-3 py-3 text-zinc-600">{row.peserta}</td>
                <td className="px-3 py-3 text-zinc-500 whitespace-nowrap">
                  <LokasiIcon type={row.lokasiType} />
                  {row.lokasiDetail}
                </td>
                <td className="text-center px-3 py-3">
                  <span className="text-emerald-500 hover:text-emerald-600 cursor-pointer whitespace-nowrap">
                    {row.noJadwal}
                  </span>
                </td>
                <td className="text-center px-3 py-3">
                  <span className="text-emerald-500 hover:text-emerald-600 cursor-pointer flex items-center justify-center gap-0.5 text-xs whitespace-nowrap">
                    Lihat Detail <ArrowRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-t border-zinc-100">
        <span className="text-xs text-zinc-400">
          Menampilkan <span className="font-medium text-zinc-600">{filtered.length}</span> dari{" "}
          <span className="font-medium text-zinc-600">{trainingData.length}</span> jadwal
        </span>
        <div className="overflow-x-auto pb-0.5">
          <div className="flex items-center gap-1 w-max">
            {weekPages.map((w) => (
              <button
                key={w}
                onClick={() => setActivePage(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  activePage === w
                    ? "bg-emerald-500 text-white"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}