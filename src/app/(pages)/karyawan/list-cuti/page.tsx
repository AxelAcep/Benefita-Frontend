"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";
import { DetailModal } from "@/components/karyawan/DetailModal";


// ─── Types ────────────────────────────────────────────────────────────────────
interface PengajuanItem {
  id: number;
  tanggalPengajuan: string;
  nama: string;
  jabatan: string;
  divisi: string;
  jenisIzin: string;
  periodeAwal: string;
  periodeAkhir: string;
  alasan: string;
  lampiran: string | null;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const dummyData: PengajuanItem[] = [
  {
    id: 1,
    tanggalPengajuan: "03 Feb 2026, 14:30 WIB",
    nama: "Nanang",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan:
      "Sakit tenggorokan bisa disebabkan oleh infeksi virus atau bakteri, alergi, atau iritasi akibat asap rokok. Gejalanya termasuk rasa nyeri saat menelan dan suara serak.",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 2,
    tanggalPengajuan: "03 Feb 2026, 11:15 WIB",
    nama: "Eli",
    jabatan: "Staff",
    divisi: "Human Resource",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan:
      "Saya merasa tidak enak badan karena flu yang membuat tubuh lemas dan kepala pusing sehingga tidak dapat bekerja secara optimal.",
    lampiran: null,
  },
  {
    id: 3,
    tanggalPengajuan: "02 Feb 2026, 09:45 WIB",
    nama: "Raka",
    jabatan: "Developer",
    divisi: "Engineering",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 4,
    tanggalPengajuan: "01 Feb 2026, 16:20 WIB",
    nama: "Sulis",
    jabatan: "Finance",
    divisi: "Finance & Accounting",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Acara Keluarga",
    lampiran: null,
  },
  {
    id: 5,
    tanggalPengajuan: "31 Jan 2026, 10:05 WIB",
    nama: "Trisna Edi",
    jabatan: "Staff",
    divisi: "Operations",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 6,
    tanggalPengajuan: "30 Jan 2026, 15:45 WIB",
    nama: "Eka Firman",
    jabatan: "Manager",
    divisi: "Marketing & Sales",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Acara Keluarga",
    lampiran: null,
  },
  {
    id: 7,
    tanggalPengajuan: "28 Jan 2026, 08:30 WIB",
    nama: "Dian",
    jabatan: "Staff",
    divisi: "Finance & Accounting",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    lampiran: "Bukti surat dokter.png",
  },
  {
    id: 8,
    tanggalPengajuan: "25 Jan 2026, 13:20 WIB",
    nama: "Mutiara",
    jabatan: "Designer",
    divisi: "Product",
    jenisIzin: "Cuti",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Acara Keluarga",
    lampiran: null,
  },
  {
    id: 9,
    tanggalPengajuan: "28 Jan 2026, 08:30 WIB",
    nama: "Endah",
    jabatan: "Staff",
    divisi: "Human Resource",
    jenisIzin: "Sakit",
    periodeAwal: "03 Feb 2026",
    periodeAkhir: "04 Feb 2026",
    alasan: "Sakit Tenggorokan",
    lampiran: "Bukti surat dokter.png",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string): string {
  return name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}



// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KonfirmasiCutiSakitPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<PengajuanItem | null>(null);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const perPage = 9;

  const filtered = dummyData.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.jenisIzin.toLowerCase().includes(search.toLowerCase()) ||
      d.alasan.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">

        {/* Page Header — identik dengan FormCutiSakitPage */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Karyawan & Aktivitas &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">Konfirmasi Cuti/Sakit</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Hari ini: Selasa, 3 Februari 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: generatePastelBg("Nanang"),
                color: generatePastelText("Nanang"),
              }}
            >
              N
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

            {/* Table Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <p className="font-bold text-zinc-800 text-sm">Konfirmasi Pengajuan Cuti/Sakit</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari Informasi..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-44 sm:w-52"
                  />
                </div>
                <button
                  onClick={() => router.push("riwayat-cuti")}
                  className="flex items-center gap-1.5 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Riwayat
                </button>
              </div>
            </div>

            {/* Table – Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                <tr className="border-b border-zinc-100">
                {["No", "Tanggal Pengajuan", "Nama", "Jenis Izin", "Periode Pengajuan", "Alasan", "Detail"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${h === "Detail" ? "text-right" : "text-left"}`}>
                    <span className={`flex items-center gap-1 ${h === "Detail" ? "justify-center" : ""}`}>
                        {h}
                        {h !== "Detail" && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 15l5 5 5-5" /><path d="M7 9l5-5 5 5" />
                        </svg>
                        )}
                    </span>
                    </th>
                ))}
                </tr>
                </thead>
                <tbody>
                  {paginated.map((row, i) => (
                    <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-zinc-500">{(page - 1) * perPage + i + 1}</td>
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">{row.tanggalPengajuan}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                            style={{ backgroundColor: generatePastelBg(row.nama), color: generatePastelText(row.nama) }}
                          >
                            {initials(row.nama)}
                          </div>
                          <span className="text-xs text-zinc-700 font-medium">{row.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.jenisIzin === "Sakit" ? "bg-red-50 text-red-500"
                          : row.jenisIzin === "Cuti" ? "bg-blue-50 text-blue-500"
                          : "bg-amber-50 text-amber-500"
                        }`}>
                          {row.jenisIzin}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.periodeAwal} – {row.periodeAkhir}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 max-w-[240px]">
                        <span className="line-clamp-1">{row.alasan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end items-center gap-2">
                          <button title="Terima" className="w-6 h-6 flex items-center justify-center rounded-full border border-emerald-200 hover:bg-emerald-50 transition-colors text-emerald-500 bg-emerald-100">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                          <button title="Tolak" className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 hover:bg-red-50 transition-colors text-red-400 bg-red-100">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setSelectedItem(row)}
                            className="flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-600 font-medium whitespace-nowrap transition-colors"
                          >
                            Lihat Detail
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards – Mobile */}
            <div className="md:hidden divide-y divide-zinc-100">
              {paginated.map((row) => (
                <div key={row.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: generatePastelBg(row.nama), color: generatePastelText(row.nama) }}
                      >
                        {initials(row.nama)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">{row.nama}</p>
                        <p className="text-[10px] text-zinc-400">{row.tanggalPengajuan}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.jenisIzin === "Sakit" ? "bg-red-50 text-red-500"
                      : row.jenisIzin === "Cuti" ? "bg-blue-50 text-blue-500"
                      : "bg-amber-50 text-amber-500"
                    }`}>
                      {row.jenisIzin}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">{row.alasan}</p>
                  <p className="text-[11px] text-zinc-400">{row.periodeAwal} – {row.periodeAkhir}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded-full border border-emerald-200 hover:bg-emerald-50 transition-colors text-emerald-500">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 hover:bg-red-50 transition-colors text-red-400">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedItem(row)}
                      className="flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
                    >
                      Lihat Detail
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-400">
                Menampilkan <span className="font-semibold text-zinc-600">{paginated.length}</span> dari{" "}
                <span className="font-semibold text-zinc-600">{filtered.length}</span> data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  ‹ Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                      p === page ? "bg-emerald-500 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Selanjutnya ›
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}