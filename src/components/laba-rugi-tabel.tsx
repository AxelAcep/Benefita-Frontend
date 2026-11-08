"use client";

// Tabel Laporan Laba Rugi dengan layout lengkap seperti sheet "IS":
//
//   Pendapatan Usaha → Harga Pokok Usaha → Laba Kotor → Beban Usaha →
//   Laba Usaha → Pendapatan/Beban Lain-Lain → Laba Sebelum Pajak →
//   Pajak Penghasilan → Laba Bersih
//
// Dipakai dua halaman: "Laporan Laba Rugi" (baris per akun) dan "Laporan
// Laba Rugi Rinci" (beban digabung per grupBeban). Bedanya cuma baris mana
// yang dikirim, makanya tabelnya satu komponen saja.
import React from "react";
import { formatPersen, formatRupiah } from "@/components/laporan-shell";
import type {
  LabaRugiResponse,
  LabaRugiRinciRow,
  LabaRugiRow,
} from "@/lib/services/jurnal-keuangan.service";

export interface BarisLaporan {
  key: string;
  label: string;
  saldo: number;
  /** Kode akun yang digabung — hanya terisi di layout rinci. */
  detail?: string;
}

export function dariAkun(rows: LabaRugiRow[]): BarisLaporan[] {
  return (rows ?? []).map((r) => ({
    key: String(r.akun.id),
    label: r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama,
    saldo: r.saldo,
  }));
}

export function dariGrup(rows: LabaRugiRinciRow[]): BarisLaporan[] {
  return (rows ?? []).map((r) => ({
    key: r.label,
    label: r.label,
    saldo: r.saldo,
    detail: r.akun.length > 1 ? r.akun.map((a) => a.kode).filter(Boolean).join(" + ") : undefined,
  }));
}

function Baris({ rows, basis, adaBanding }: { rows: BarisLaporan[]; basis: number; adaBanding: boolean }) {
  if (!rows.length) {
    return (
      <tr>
        <td colSpan={adaBanding ? 4 : 3} className="pl-8 pr-4 py-2 text-xs text-zinc-400">
          Tidak ada data.
        </td>
      </tr>
    );
  }
  return (
    <>
      {rows.map((r) => (
        <tr key={r.key} className="border-b border-zinc-50">
          <td className="pl-8 pr-4 py-1.5 text-xs text-zinc-600">
            {r.label}
            {r.detail ? <span className="ml-2 text-[10px] text-zinc-300">{r.detail}</span> : null}
          </td>
          <td className="px-4 py-1.5 text-xs text-zinc-700 text-right tabular-nums">{formatRupiah(r.saldo)}</td>
          <td className="px-4 py-1.5 text-xs text-zinc-400 text-right w-20">{formatPersen(r.saldo, basis)}</td>
          {adaBanding ? <td /> : null}
        </tr>
      ))}
    </>
  );
}

function Subtotal({
  label,
  nilai,
  basis,
  banding,
}: {
  label: string;
  nilai: number;
  basis: number;
  banding?: number;
}) {
  return (
    <tr className="bg-zinc-50/60">
      <td className="pl-5 pr-4 py-1.5 text-xs font-semibold text-zinc-700">{label}</td>
      <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right tabular-nums">
        {formatRupiah(nilai)}
      </td>
      <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right">{formatPersen(nilai, basis)}</td>
      {banding !== undefined ? (
        <td className="px-4 py-1.5 text-xs font-semibold text-zinc-500 text-right tabular-nums">
          {formatRupiah(banding)}
        </td>
      ) : null}
    </tr>
  );
}

function Total({
  label,
  nilai,
  basis,
  banding,
}: {
  label: string;
  nilai: number;
  basis: number;
  banding?: number;
}) {
  return (
    <tr className="bg-zinc-100 font-bold border-y border-zinc-200">
      <td className="px-4 py-2 text-xs text-zinc-800 uppercase">{label}</td>
      <td className="px-4 py-2 text-xs text-zinc-800 text-right tabular-nums">{formatRupiah(nilai)}</td>
      <td className="px-4 py-2 text-xs text-zinc-800 text-right">{formatPersen(nilai, basis)}</td>
      {banding !== undefined ? (
        <td className="px-4 py-2 text-xs text-zinc-600 text-right tabular-nums">{formatRupiah(banding)}</td>
      ) : null}
    </tr>
  );
}

function Judul({ teks, labelBanding }: { teks: string; labelBanding?: string }) {
  return (
    <thead>
      <tr className="bg-zinc-50/60 border-b border-zinc-100">
        <th className="px-4 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">{teks}</th>
        <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400">Nominal</th>
        <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400 w-20">% Pendapatan</th>
        {labelBanding ? (
          <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400 w-40">{labelBanding}</th>
        ) : null}
      </tr>
    </thead>
  );
}

export function LabaRugiTabel({
  data,
  pendapatanUsaha,
  hargaPokok,
  bebanPenjualan,
  bebanAdministrasi,
  pendapatanLain,
  bebanLain,
  pajakPenghasilan,
}: {
  data: LabaRugiResponse;
  pendapatanUsaha: BarisLaporan[];
  hargaPokok: BarisLaporan[];
  bebanPenjualan: BarisLaporan[];
  bebanAdministrasi: BarisLaporan[];
  pendapatanLain: BarisLaporan[];
  bebanLain: BarisLaporan[];
  pajakPenghasilan: BarisLaporan[];
}) {
  // Semua persentase dihitung terhadap Pendapatan Usaha, sama seperti
  // kolom "% Pdptn" di sheet IS.
  const basis = data.totalPendapatanUsaha;
  const b = data.pembanding;
  const labelBanding = b ? `${b.startDate} s/d ${b.endDate}` : undefined;
  const adaBanding = Boolean(b);

  return (
    <div>
      <table className="w-full">
        <Judul labelBanding={labelBanding} teks="Pendapatan Usaha" />
        <tbody>
          <Baris rows={pendapatanUsaha} basis={basis} adaBanding={adaBanding} />
          <Subtotal label="Total Pendapatan Usaha" nilai={data.totalPendapatanUsaha} basis={basis} banding={b?.totalPendapatanUsaha} />
        </tbody>
      </table>

      <table className="w-full border-t border-zinc-100">
        <Judul labelBanding={labelBanding} teks="Harga Pokok Usaha" />
        <tbody>
          <Baris rows={hargaPokok} basis={basis} adaBanding={adaBanding} />
          <Subtotal label="Total Harga Pokok Usaha" nilai={data.totalHargaPokok} basis={basis} banding={b?.totalHargaPokok} />
          <Total label="Laba Kotor" nilai={data.labaKotor} basis={basis} banding={b?.labaKotor} />
        </tbody>
      </table>

      <table className="w-full border-t border-zinc-100">
        <Judul labelBanding={labelBanding} teks="Beban Usaha" />
        <tbody>
          <tr>
            <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold text-zinc-500">
              Beban Penjualan
            </td>
          </tr>
          <Baris rows={bebanPenjualan} basis={basis} adaBanding={adaBanding} />
          <Subtotal label="Total Beban Penjualan" nilai={data.totalBebanPenjualan} basis={basis} banding={b?.totalBebanPenjualan} />

          <tr>
            <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold text-zinc-500">
              Beban Umum dan Administrasi
            </td>
          </tr>
          <Baris rows={bebanAdministrasi} basis={basis} adaBanding={adaBanding} />
          <Subtotal label="Total Beban Umum dan Administrasi" nilai={data.totalBebanAdministrasi} basis={basis} banding={b?.totalBebanAdministrasi} />

          <Subtotal label="Total Beban Usaha" nilai={data.totalBebanUsaha} basis={basis} banding={b?.totalBebanUsaha} />
          <Total label="Laba Usaha" nilai={data.labaUsaha} basis={basis} banding={b?.labaUsaha} />
        </tbody>
      </table>

      <table className="w-full border-t border-zinc-100">
        <Judul labelBanding={labelBanding} teks="Pendapatan dan Beban Lain-Lain" />
        <tbody>
          <tr>
            <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold text-zinc-500">
              Pendapatan Lain-Lain
            </td>
          </tr>
          <Baris rows={pendapatanLain} basis={basis} adaBanding={adaBanding} />
          <tr>
            <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold text-zinc-500">
              Beban Lain-Lain
            </td>
          </tr>
          <Baris rows={bebanLain} basis={basis} adaBanding={adaBanding} />
          <Subtotal
            label="Total Pendapatan (Beban) Lain-Lain"
            nilai={data.totalPendapatanLainBersih}
            basis={basis}
          banding={b?.totalPendapatanLainBersih}
          />
          <Total label="Laba Sebelum Pajak" nilai={data.labaSebelumPajak} basis={basis} banding={b?.labaSebelumPajak} />
        </tbody>
      </table>

      <table className="w-full border-t border-zinc-100">
        <Judul labelBanding={labelBanding} teks="Pajak Penghasilan" />
        <tbody>
          <Baris rows={pajakPenghasilan} basis={basis} adaBanding={adaBanding} />
          <Subtotal label="Total Pajak Penghasilan" nilai={data.totalPajakPenghasilan} basis={basis} banding={b?.totalPajakPenghasilan} />
        </tbody>
      </table>

      <div
        className={`flex items-center justify-between px-5 py-4 text-sm font-bold border-t border-zinc-100 ${
          data.labaBersih >= 0 ? "text-emerald-600" : "text-red-500"
        }`}
      >
        <span>{data.labaBersih >= 0 ? "Laba Bersih" : "Rugi Bersih"}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-normal text-zinc-400">
            {formatPersen(Math.abs(data.labaBersih), basis)}
          </span>
          <span>{formatRupiah(Math.abs(data.labaBersih))}</span>
          {b ? (
            <span className="text-xs font-normal text-zinc-400 w-40 text-right">
              {formatRupiah(b.labaBersih)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
