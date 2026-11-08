"use client";

// Import Jurnal Keuangan dari file Excel "DATA KEUANGAN".
//
// Alurnya: pilih file → preview (belum masuk database) → benerin baris yang
// kuning → Import. Baris kuning = sistem tidak menemukan akun lawannya dari
// keyword di kolom KETERANGAN, jadi harus dipilih manual.
import React, { useEffect, useMemo, useState } from "react";
import { Upload, Loader2, AlertTriangle, Check } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { formatRupiah } from "@/components/laporan-shell";
import {
  previewImportJurnal,
  commitImportJurnal,
  type ImportJurnalRow,
  type ImportJurnalRingkasan,
} from "@/lib/services/jurnal-keuangan.service";
import { getAkunList, type AkunItem } from "@/lib/services/accounting.service";

type Filter = "SEMUA" | "PERLU_DILENGKAPI" | "SIAP";

function tanggalSingkat(v: string | null) {
  if (!v) return "-";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "-" : d.toISOString().slice(0, 10);
}

function PilihAkun({
  value,
  akunList,
  onChange,
  kosong,
}: {
  value: string | null;
  akunList: AkunItem[];
  onChange: (kode: string | null) => void;
  kosong: boolean;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={`w-full px-2 py-1 rounded-lg border text-[11px] outline-none transition-colors ${
        kosong
          ? "border-amber-300 bg-amber-50 text-amber-800 focus:border-amber-400"
          : "border-zinc-200 text-zinc-700 focus:border-emerald-300"
      }`}
    >
      <option value="">— pilih akun —</option>
      {akunList.map((a) => (
        <option key={a.id} value={a.kode ?? ""}>
          {a.kode} - {a.nama}
        </option>
      ))}
    </select>
  );
}

export default function ImportJurnalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportJurnalRow[]>([]);
  const [ringkasan, setRingkasan] = useState<ImportJurnalRingkasan | null>(null);
  const [akunList, setAkunList] = useState<AkunItem[]>([]);
  const [filter, setFilter] = useState<Filter>("SEMUA");
  const [halaman, setHalaman] = useState(1);
  const { value: memproses, onTrue: prosesMulai, onFalse: prosesSelesai } = useBoolean(false);
  const [progres, setProgres] = useState<{ terkirim: number; total: number } | null>(null);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  const PER_HALAMAN = 100;

  useEffect(() => {
    getAkunList({ page: 1, limit: 500, isActive: true })
      .then((r) => setAkunList(r.data))
      .catch(() => setNotif({ message: "Gagal memuat daftar akun", type: "error", key: Date.now() }));
  }, []);

  const perluDilengkapi = useMemo(() => rows.filter((r) => r.anomali).length, [rows]);
  const siap = rows.length - perluDilengkapi;

  const terfilter = useMemo(() => {
    if (filter === "PERLU_DILENGKAPI") return rows.filter((r) => r.anomali);
    if (filter === "SIAP") return rows.filter((r) => !r.anomali);
    return rows;
  }, [rows, filter]);

  const terlihat = terfilter.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);
  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / PER_HALAMAN));

  function ubahAkun(id: number, sisi: "akunDebit" | "akunKredit", kode: string | null) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, [sisi]: kode };
        next.anomali = !next.akunDebit || !next.akunKredit;
        return next;
      }),
    );
  }

  async function onPreview() {
    if (!file) return;
    prosesMulai();
    try {
      const res = await previewImportJurnal(file);
      setRows(res.data.rows);
      setRingkasan(res.data.ringkasan);
      setHalaman(1);
      setFilter(res.data.ringkasan.anomali > 0 ? "PERLU_DILENGKAPI" : "SEMUA");
    } catch (err) {
      setNotif({
        message: err instanceof Error ? err.message : "Gagal membaca file",
        type: "error",
        key: Date.now(),
      });
    } finally {
      prosesSelesai();
    }
  }

  async function onImport() {
    const siapKirim = rows.filter((r) => !r.anomali && !r.sudahDiimport);
    if (!siapKirim.length) return;
    prosesMulai();
    setProgres({ terkirim: 0, total: siapKirim.length });
    try {
      const res = await commitImportJurnal(siapKirim, (terkirim, total) =>
        setProgres({ terkirim, total }),
      );
      setNotif({
        message: `${res.message}. Dilewati: ${res.data.dilewati}.`,
        type: "success",
        key: Date.now(),
      });
      // Tandai yang sudah masuk supaya gak terkirim dua kali.
      const masuk = new Set(siapKirim.map((r) => r.noJurnal));
      setRows((prev) => prev.map((r) => (masuk.has(r.noJurnal) ? { ...r, sudahDiimport: true } : r)));
    } catch (err) {
      setNotif({
        message: err instanceof Error ? err.message : "Gagal menyimpan import",
        type: "error",
        key: Date.now(),
      });
    } finally {
      prosesSelesai();
      setProgres(null);
    }
  }

  const belumMasuk = rows.filter((r) => !r.anomali && !r.sudahDiimport).length;

  return (
    <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting" }, { label: "Import Jurnal Keuangan" }]}>
      {notif ? (
        <Notification key={notif.key} message={notif.message} type={notif.type} onClose={() => setNotif(null)} />
      ) : null}

      <div className="space-y-4">
        {/* Pilih file */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-5 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Import Jurnal Keuangan</span>
          </div>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-xs text-zinc-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
          />

          <button
            onClick={onPreview}
            disabled={!file || memproses}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-900 text-white transition-colors disabled:opacity-40"
          >
            {memproses ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Baca File
          </button>

          {rows.length > 0 ? (
            <button
              onClick={onImport}
              disabled={memproses || belumMasuk === 0}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-40"
            >
              {memproses ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {progres ? `Mengimport ${progres.terkirim}/${progres.total}` : `Import ${belumMasuk} Jurnal`}
            </button>
          ) : null}
        </div>

        {/* Ringkasan */}
        {ringkasan ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Transaksi", nilai: ringkasan.total, warna: "text-zinc-800" },
              { label: "Siap Diimport", nilai: siap, warna: "text-emerald-600" },
              { label: "Perlu Dilengkapi", nilai: perluDilengkapi, warna: "text-amber-600" },
              { label: "Sudah Pernah Masuk", nilai: ringkasan.sudahDiimport, warna: "text-zinc-400" },
            ].map((k) => (
              <div key={k.label} className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-4 py-3">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase">{k.label}</p>
                <p className={`text-lg font-bold ${k.warna}`}>{k.nilai.toLocaleString("id-ID")}</p>
              </div>
            ))}
          </div>
        ) : null}

        {perluDilengkapi > 0 ? (
          <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>{perluDilengkapi} baris</strong> akun lawannya tidak bisa ditebak dari kolom KETERANGAN —
              keyword-nya tidak dikenal. Baris kuning di bawah harus dipilih akunnya dulu. Baris yang sudah hijau
              tetap bisa diimport duluan, yang kuning menyusul.
            </p>
          </div>
        ) : null}

        {/* Tabel */}
        {rows.length > 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-5 py-2.5 border-b border-zinc-100 flex flex-wrap items-center gap-2">
              {(
                [
                  ["SEMUA", `Semua (${rows.length})`],
                  ["PERLU_DILENGKAPI", `Perlu Dilengkapi (${perluDilengkapi})`],
                  ["SIAP", `Siap (${siap})`],
                ] as [Filter, string][]
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => {
                    setFilter(k);
                    setHalaman(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    filter === k ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {label}
                </button>
              ))}

              {totalHalaman > 1 ? (
                <div className="ml-auto flex items-center gap-2 text-[11px] text-zinc-500">
                  <button
                    onClick={() => setHalaman((h) => Math.max(1, h - 1))}
                    disabled={halaman === 1}
                    className="px-2 py-1 rounded border border-zinc-200 disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>
                  <span>
                    {halaman} / {totalHalaman}
                  </span>
                  <button
                    onClick={() => setHalaman((h) => Math.min(totalHalaman, h + 1))}
                    disabled={halaman === totalHalaman}
                    className="px-2 py-1 rounded border border-zinc-200 disabled:opacity-40"
                  >
                    Berikutnya
                  </button>
                </div>
              ) : null}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px]">
                <thead>
                  <tr className="bg-zinc-50/60 border-b border-zinc-100">
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">Tanggal</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">Keterangan</th>
                    <th className="px-3 py-1.5 text-right text-[10px] font-semibold text-zinc-400 uppercase">Nominal</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase w-56">Debit</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase w-56">Kredit</th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">Aturan</th>
                  </tr>
                </thead>
                <tbody>
                  {terlihat.map((r) => (
                    <tr
                      key={r.noJurnal}
                      className={`border-b border-zinc-50 ${
                        r.sudahDiimport ? "opacity-40" : r.anomali ? "bg-amber-50/60" : ""
                      }`}
                    >
                      <td className="px-3 py-1.5 text-[11px] text-zinc-500 whitespace-nowrap">
                        {tanggalSingkat(r.tanggal)}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-zinc-700">
                        {r.keterangan}
                        <span className="ml-2 text-[10px] text-zinc-300">
                          {r.buku ?? r.sumber}
                          {r.noBukti ? ` · ${r.noBukti}` : ""}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-xs text-zinc-700 text-right tabular-nums whitespace-nowrap">
                        {formatRupiah(r.nominal)}
                      </td>
                      <td className="px-3 py-1.5">
                        <PilihAkun
                          value={r.akunDebit}
                          akunList={akunList}
                          kosong={!r.akunDebit}
                          onChange={(kode) => ubahAkun(r.id, "akunDebit", kode)}
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <PilihAkun
                          value={r.akunKredit}
                          akunList={akunList}
                          kosong={!r.akunKredit}
                          onChange={(kode) => ubahAkun(r.id, "akunKredit", kode)}
                        />
                      </td>
                      <td className="px-3 py-1.5 text-[11px] text-zinc-400">
                        {r.sudahDiimport ? (
                          <span className="text-emerald-600 font-semibold">Sudah diimport</span>
                        ) : r.transferInternal ? (
                          <span className="text-amber-600">Transfer antar kas — pilih buku tujuan</span>
                        ) : (
                          (r.aturan ?? "—")
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
