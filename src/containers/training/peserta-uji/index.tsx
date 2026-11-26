"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useCan } from "@/hooks/use-can";
import Notification from "@/components/base/notifications";
import SearchInput from "@/components/base/search-input";
import { TablePagination } from "@/components/base/table-pagination";
import {
  CHECKLIST_FIELDS,
  type ChecklistField,
} from "@/lib/types/peserta-uji";
import { usePesertaUjiManage } from "./manage";

/** Label pendek untuk header kolom, label lengkap untuk tooltip. */
const LABEL_CHECKLIST: Record<ChecklistField, { pendek: string; lengkap: string }> = {
  suratKetKerja: { pendek: "Surat Kerja", lengkap: "Surat Keterangan Kerja" },
  suratRekom: { pendek: "Surat Rekom", lengkap: "Surat Rekomendasi" },
  sertPel: { pendek: "Sert Pel", lengkap: "Sertifikat Pelatihan" },
  cv: { pendek: "CV", lengkap: "Curriculum Vitae" },
  ktp: { pendek: "KTP", lengkap: "Kartu Tanda Penduduk" },
  ijazah: { pendek: "Ijazah", lengkap: "Ijazah" },
  pasFoto: { pendek: "Pas Foto", lengkap: "Pas Foto" },
  verTUK: { pendek: "Ver TUK", lengkap: "Verifikasi TUK" },
  ksediaTUK: { pendek: "Ksedia TUK", lengkap: "Kesediaan TUK" },
  apl01: { pendek: "APL01", lengkap: "Formulir APL-01" },
  apl02: { pendek: "APL02", lengkap: "Formulir APL-02" },
};

const STATUS: Record<string, { label: string; kelas: string }> = {
  SIAP_UJI: { label: "Siap Uji", kelas: "bg-emerald-50 text-emerald-600" },
  SUDAH_UJI: { label: "Sudah Uji", kelas: "bg-blue-50 text-blue-600" },
};
const STATUS_DEFAULT = { label: "Calon", kelas: "bg-zinc-100 text-zinc-500" };

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS_DEFAULT;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${s.kelas}`}
    >
      {s.label}
    </span>
  );
}

function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">-</span>;
  return <>{children}</>;
}

function tanggal(iso: string | null) {
  if (!iso) return <span className="text-zinc-300">-</span>;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const TH = "px-3 py-2 text-[10px] font-semibold text-zinc-400";
const TD = "px-3 py-3 text-zinc-600 align-top";

export default function PesertaUjiContainer() {
  const m = usePesertaUjiManage();
  const canUpdate = useCan("training", "update");
  const jumlahKolom = 10 + CHECKLIST_FIELDS.length;

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Peserta Uji" },
      ]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Peserta Uji (Calon &amp; Siap Uji)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">Tgl Uji</span>
            <input
              type="date"
              value={m.tanggal}
              onChange={(e) => m.handleTanggal(e.target.value)}
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
            {m.tanggal && (
              <button
                onClick={() => m.handleTanggal("")}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="ml-auto w-full sm:w-56">
            <SearchInput
              value={m.search}
              onChange={m.handleSearch}
              placeholder="Cari nama atau instansi..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: "2100px" }}>
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className={`${TH} text-left w-10`}>No</th>
                <th className={`${TH} text-left w-40`}>Nama</th>
                <th className={`${TH} text-left w-40`}>Instansi</th>
                <th className={`${TH} text-left w-28`}>WA</th>
                <th className={`${TH} text-left w-40`}>Email</th>
                <th className={`${TH} text-left w-32`}>Skema</th>
                <th className={`${TH} text-left w-32`}>TUK</th>
                <th className={`${TH} text-left w-24`}>Tgl Uji</th>
                <th className={`${TH} text-center w-20`}>Status</th>
                <th className={`${TH} text-center w-20`}>Detail</th>
                {CHECKLIST_FIELDS.map((f) => (
                  <th
                    key={f}
                    title={LABEL_CHECKLIST[f].lengkap}
                    className={`${TH} text-center w-16`}
                  >
                    {LABEL_CHECKLIST[f].pendek}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {m.loading ? (
                <tr>
                  <td colSpan={jumlahKolom} className="px-4 py-12 text-center text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : m.error ? (
                // Dulu galat tidak pernah ditampilkan, jadi gangguan jaringan
                // terlihat sama persis dengan daftar kosong.
                <tr>
                  <td colSpan={jumlahKolom} className="px-4 py-12 text-center text-red-500">
                    {m.error}
                  </td>
                </tr>
              ) : m.data.length === 0 ? (
                <tr>
                  <td colSpan={jumlahKolom} className="px-4 py-12 text-center text-zinc-400">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                m.data.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-3 py-3 text-zinc-400 align-top">
                      {(m.page - 1) * m.pagination.limit + i + 1}
                    </td>
                    <td className="px-3 py-3 text-zinc-700 font-medium align-top whitespace-nowrap">
                      {row.nama}
                    </td>
                    <td className={`${TD} max-w-[160px] truncate`}>
                      <Dash>{row.instansi}</Dash>
                    </td>
                    <td className={`${TD} whitespace-nowrap`}>
                      <Dash>{row.wa}</Dash>
                    </td>
                    <td className={`${TD} max-w-[160px] truncate`}>
                      <Dash>{row.email}</Dash>
                    </td>
                    <td className={`${TD} whitespace-nowrap`}>{row.skema.kode}</td>
                    <td className={TD}>
                      <Dash>{row.tuk?.nama}</Dash>
                    </td>
                    <td className={`${TD} whitespace-nowrap`}>{tanggal(row.tglUji)}</td>
                    <td className="px-3 py-3 text-center align-top">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <Link
                        href={`/training/peserta-uji/${row.id}`}
                        className="inline-flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-semibold whitespace-nowrap"
                      >
                        Detail <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                    {CHECKLIST_FIELDS.map((f) => (
                      <td key={f} className="px-2 py-3 text-center align-top">
                        <input
                          type="checkbox"
                          checked={row[f]}
                          disabled={!canUpdate}
                          onChange={() => m.toggle(row, f)}
                          aria-label={`${LABEL_CHECKLIST[f].lengkap} — ${row.nama}`}
                          className="w-3.5 h-3.5 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-200 cursor-pointer disabled:cursor-default"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={m.page}
          limit={m.pagination.limit}
          total={m.pagination.total}
          totalPages={m.pagination.totalPages}
          onPageChange={m.setPage}
        />
      </div>
    </AppLayout>
  );
}
