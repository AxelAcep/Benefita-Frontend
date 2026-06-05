"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DetailKegiatan {
  noJadwal: string;
  tglUpdate: string;
  judul: string;
  kode: string;
  lokasi: string;
  kota: string;
  biayaPelatihan: string;
}

interface PesertaItem {
  id: number;
  nama: string;
  perusahaanInstansi: string;
  ae: string;
  status: string;
  noTelepon: string;
  noHpWa: string;
  catatan: string;
}

interface PindahFormData {
  nama: string;
  noHpWa: string;
  instansi: string;
  jabatan: string;
  email: string;
  noTelepon: string;
  noInduk: string;
  noFax: string;
  alamat: string;
  accExecutive: string;
  updateOleh: string;
  tanggalUpdate: string;
  catatan: string;
  status: string;
  pilihJadwal: string;
}

// ─── Dummy Data (replace with API fetch) ──────────────────────────────────────
const detailKegiatan: DetailKegiatan = {
  noJadwal: "2026274",
  tglUpdate: "27 April 2026",
  judul: "Penanggung Jawab Pengendalian Pencemaran Udara (PPPU)",
  kode: "EM-05",
  lokasi: "Jakarta",
  kota: "Jakarta",
  biayaPelatihan: "Rp5.900.000",
};

const pesertaData: PesertaItem[] = [
  {
    id: 1,
    nama: "Muhammad Habibie Musy",
    perusahaanInstansi: "PT ABC",
    ae: "EE",
    status: "Cancel",
    noTelepon: "-",
    noHpWa: "-",
    catatan: "-",
  },
  {
    id: 2,
    nama: "Arief Khairul Djaelani",
    perusahaanInstansi: "PT BCAA",
    ae: "SB",
    status: "Cancel",
    noTelepon: "-",
    noHpWa: "-",
    catatan: "-",
  },
  {
    id: 3,
    nama: "Setiyo Rishandoko",
    perusahaanInstansi: "PT ABCCC",
    ae: "SL",
    status: "Cancel",
    noTelepon: "–",
    noHpWa: "-",
    catatan: "-",
  },
  {
    id: 4,
    nama: "Ahmad Sarminto",
    perusahaanInstansi: "PT BCASD",
    ae: "RQ",
    status: "Tentatif",
    noTelepon: "082133238473",
    noHpWa: "-",
    catatan: "-",
  },
];

const statusOptions = [
  "Cancel",
  "Tentatif",
  "Konfirmasi",
  "Hadir",
  "Tidak Hadir",
];
const jadwalOptions = [
  "2026274 - PPPU Jakarta",
  "2026275 - PPPU Surabaya",
  "2026276 - PPPU Bandung",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SortIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 15l5 5 5-5" />
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10b981"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  );
}

const statusBadgeStyle: Record<string, string> = {
  Cancel: "bg-red-50 text-red-500",
  Tentatif: "bg-yellow-50 text-yellow-600",
  Konfirmasi: "bg-blue-50 text-blue-500",
  Hadir: "bg-emerald-50 text-emerald-600",
  "Tidak Hadir": "bg-zinc-100 text-zinc-500",
};

// ─── Pindah Modal ─────────────────────────────────────────────────────────────
function PindahModal({
  peserta,
  onClose,
}: {
  peserta: PesertaItem | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PindahFormData>({
    nama: peserta?.nama ?? "",
    noHpWa: "",
    instansi: peserta?.perusahaanInstansi ?? "",
    jabatan: "",
    email: "",
    noTelepon:
      peserta?.noTelepon !== "-" && peserta?.noTelepon !== "–"
        ? (peserta?.noTelepon ?? "")
        : "",
    noInduk: "",
    noFax: "",
    alamat: "",
    accExecutive: peserta?.ae ?? "",
    updateOleh: "",
    tanggalUpdate: "",
    catatan: peserta?.catatan !== "-" ? (peserta?.catatan ?? "") : "",
    status: "",
    pilihJadwal: "",
  });

  if (!peserta) return null;

  const set =
    (key: keyof PindahFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputCls =
    "w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none focus:border-emerald-300 placeholder:text-zinc-300 transition-colors";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
          <div>
            <p className="text-base font-bold text-zinc-800">Pindah Jadwal</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk memindahkan jadwal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg transition-colors mt-0.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Bagian 1 */}
          <div>
            <p className="text-sm font-bold text-zinc-800 mb-4">Bagian 1</p>
            <div className="space-y-3">
              {/* Row: Nama + No HP/WA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nama</label>
                  <input
                    className={inputCls}
                    value={form.nama}
                    onChange={set("nama")}
                    placeholder="Masukkan nama"
                  />
                </div>
                <div>
                  <label className={labelCls}>No. HP/WA</label>
                  <input
                    className={inputCls}
                    value={form.noHpWa}
                    onChange={set("noHpWa")}
                    placeholder="Masukkan jabatan"
                  />
                </div>
              </div>
              {/* Row: Instansi + Jabatan + Email */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Instansi</label>
                  <input
                    className={inputCls}
                    value={form.instansi}
                    onChange={set("instansi")}
                    placeholder="Masukkan instansi"
                  />
                </div>
                <div>
                  <label className={labelCls}>Jabatan</label>
                  <input
                    className={inputCls}
                    value={form.jabatan}
                    onChange={set("jabatan")}
                    placeholder="Masukkan jabatan"
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    className={inputCls}
                    value={form.email}
                    onChange={set("email")}
                    placeholder="user@gmail.com"
                  />
                </div>
              </div>
              {/* Row: No Telepon + No Induk + No Fax */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>No. Telepon</label>
                  <input
                    className={inputCls}
                    value={form.noTelepon}
                    onChange={set("noTelepon")}
                    placeholder="Masukkan no. telepon"
                  />
                </div>
                <div>
                  <label className={labelCls}>No. Induk</label>
                  <input
                    className={inputCls}
                    value={form.noInduk}
                    onChange={set("noInduk")}
                    placeholder="Masukkan no. induk"
                  />
                </div>
                <div>
                  <label className={labelCls}>No. Fax</label>
                  <input
                    className={inputCls}
                    value={form.noFax}
                    onChange={set("noFax")}
                    placeholder="Masukkan no. fax"
                  />
                </div>
              </div>
              {/* Alamat */}
              <div>
                <label className={labelCls}>Alamat</label>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  value={form.alamat}
                  onChange={set("alamat")}
                  placeholder="Masukkan alamat"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100" />

          {/* Bagian 2 */}
          <div>
            <p className="text-sm font-bold text-zinc-800 mb-4">Bagian 2</p>
            <div className="space-y-3">
              {/* Row: AE + Update Oleh + Tanggal Update */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Acc.Executive (AE)</label>
                  <input
                    className={inputCls}
                    value={form.accExecutive}
                    onChange={set("accExecutive")}
                    placeholder="Masukkan AE"
                  />
                </div>
                <div>
                  <label className={labelCls}>Update Oleh</label>
                  <input
                    className={inputCls}
                    value={form.updateOleh}
                    onChange={set("updateOleh")}
                    placeholder="Masukkan nama"
                  />
                </div>
                <div>
                  <label className={labelCls}>Tanggal Update</label>
                  <div className="relative">
                    <input
                      type="date"
                      className={`${inputCls} pr-8`}
                      value={form.tanggalUpdate}
                      onChange={set("tanggalUpdate")}
                      placeholder="Pilih Tanggal"
                    />
                  </div>
                </div>
              </div>
              {/* Catatan */}
              <div>
                <label className={labelCls}>Catatan</label>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  value={form.catatan}
                  onChange={set("catatan")}
                  placeholder="Masukkan catatan"
                />
              </div>
              {/* Status + Pilih Jadwal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    className={`${inputCls} appearance-none bg-white`}
                    value={form.status}
                    onChange={set("status")}
                  >
                    <option value="">Pilih Status</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Pilih Jadwal</label>
                  <select
                    className={`${inputCls} appearance-none bg-white`}
                    value={form.pilihJadwal}
                    onChange={set("pilihJadwal")}
                  >
                    <option value="">Pilih Status</option>
                    {jadwalOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PindahJadwalPesertaPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaItem | null>(
    null,
  );
  const router = useRouter();
  const perPage = 10;

  // Data sudah ditarik — tinggal ganti dengan hasil fetch API
  const kegiatan = detailKegiatan;
  const rawData = pesertaData;

  const filtered = rawData.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaanInstansi.toLowerCase().includes(search.toLowerCase()) ||
      d.status.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const cols = [
    "No",
    "Nama",
    "Perusahaan/Instansi",
    "AE",
    "Status",
    "No. Telepon",
    "No. HP/WA",
    "Catatan",
    "Aksi",
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">
        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Perusahaan &rsaquo;{" "}
              <span className="font-semibold text-zinc-700">Input Data</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hari ini: Selasa, 3 Februari 2026
            </p>
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
        <div className="p-6 space-y-4">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors font-medium"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>

          {/* Detail Kegiatan Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center">
                <CardIcon />
              </div>
              <p className="text-sm font-bold text-zinc-800">Detail Kegiatan</p>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-3">
                {[
                  { label: "No. Jadwal", value: kegiatan.noJadwal },
                  {
                    label: "Tgl. Update",
                    value: kegiatan.tglUpdate,
                    hasIcon: true,
                  },
                  { label: "Judul", value: kegiatan.judul },
                  { label: "Kode", value: kegiatan.kode },
                ].map(({ label, value, hasIcon }) => (
                  <div key={label} className="flex items-center gap-4">
                    <p className="text-xs text-zinc-500 w-28 shrink-0">
                      {label}
                    </p>
                    <div className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 flex items-center justify-between">
                      <p className="text-xs text-zinc-700">{value}</p>
                      {hasIcon && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a1a1aa"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Right column */}
              <div className="space-y-3">
                {[
                  { label: "Lokasi", value: kegiatan.lokasi },
                  { label: "Kota", value: kegiatan.kota },
                  { label: "Biaya Pelatihan", value: kegiatan.biayaPelatihan },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <p className="text-xs text-zinc-500 w-28 shrink-0">
                      {label}
                    </p>
                    <div className="flex-1 border border-zinc-200 rounded-lg px-3 py-2">
                      <p className="text-xs text-zinc-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informasi Sertifikat Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center">
                  <CardIcon />
                </div>
                <p className="text-sm font-bold text-zinc-800">
                  Informasi Sertifikat (Training)
                </p>
              </div>
              <div className="relative">
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
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 w-48"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {cols.map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-[11px] font-semibold text-zinc-400 whitespace-nowrap ${h === "Aksi" ? "text-right" : "text-left"}`}
                      >
                        <span
                          className={`flex items-center gap-1 ${h === "Aksi" ? "justify-end" : ""}`}
                        >
                          {h}
                          {h !== "Aksi" && <SortIcon />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row, i) => (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {(page - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-700 font-medium whitespace-nowrap">
                        {row.nama}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.perusahaanInstansi}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">
                        {row.ae}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeStyle[row.status] ?? "bg-zinc-100 text-zinc-500"}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.noTelepon}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.noHpWa}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {row.catatan}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedPeserta(row)}
                          className="text-[11px] text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
                        >
                          Pindah
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-xs text-zinc-400"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-400">
                Menampilkan{" "}
                <span className="font-semibold text-zinc-600">
                  {(page - 1) * perPage + 1}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-zinc-600">
                  {filtered.length}
                </span>{" "}
                data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  ‹ Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Selanjutnya ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pindah Jadwal Modal */}
      <PindahModal
        peserta={selectedPeserta}
        onClose={() => setSelectedPeserta(null)}
      />
    </div>
  );
}
