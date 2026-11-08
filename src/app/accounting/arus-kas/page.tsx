"use client";

// Arus Kas — padanan sheet "CF", metode langsung.
// Tiap baris dikelompokkan dari LAWAN akun transaksi yang menyentuh Kas &
// Bank, jadi Saldo Akhir di sini selalu sama dengan saldo Kas & Bank di
// Neraca pada tanggal yang sama.
import React from "react";
import { Waves } from "lucide-react";
import { useArusKas } from "@/hooks/use-laporan-keuangan";
import {
  BadgeBalance,
  LaporanShell,
  formatRupiah,
  usePeriodeAwal,
} from "@/components/laporan-shell";
import type { ArusKasRow } from "@/lib/services/jurnal-keuangan.service";

function Bagian({
  judul,
  rows,
  total,
  labelTotal,
  warna,
}: {
  judul: string;
  rows: ArusKasRow[];
  total: number;
  labelTotal: string;
  warna: string;
}) {
  return (
    <table className="w-full border-t border-zinc-100">
      <thead>
        <tr className="bg-zinc-50/60 border-b border-zinc-100">
          <th className="px-4 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">{judul}</th>
          <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400 w-56">Nominal</th>
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((r) => (
            <tr key={r.label} className="border-b border-zinc-50">
              <td className="pl-8 pr-4 py-1.5 text-xs text-zinc-600">{r.label}</td>
              <td className={`px-4 py-1.5 text-xs text-right tabular-nums ${warna}`}>{formatRupiah(r.nilai)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="pl-8 pr-4 py-3 text-xs text-zinc-400">
              Tidak ada data.
            </td>
          </tr>
        )}
        <tr className="bg-zinc-50/60 font-semibold">
          <td className="px-4 py-2 text-xs text-zinc-700">{labelTotal}</td>
          <td className="px-4 py-2 text-xs text-zinc-700 text-right tabular-nums">{formatRupiah(total)}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function ArusKasPage() {
  const { data, loading, fetchData } = useArusKas();
  const { startDate, setStartDate, endDate, setEndDate } = usePeriodeAwal(fetchData);

  return (
    <LaporanShell
      judul="Laporan Arus Kas"
      icon={Waves}
      startDate={startDate}
      endDate={endDate}
      onStartDate={setStartDate}
      onEndDate={setEndDate}
      onFilter={() => fetchData(startDate, endDate)}
      loading={loading}
      badge={data ? <BadgeBalance isBalance={data.isBalance} selisih={data.selisih} /> : null}
    >
      {data ? (
        <div>
          <table className="w-full">
            <tbody>
              <tr className="bg-zinc-100 font-bold border-b border-zinc-200">
                <td className="px-4 py-2 text-xs text-zinc-800">Saldo Awal Kas dan Bank</td>
                <td className="px-4 py-2 text-xs text-zinc-800 text-right tabular-nums w-56">
                  {formatRupiah(data.saldoAwal)}
                </td>
              </tr>
            </tbody>
          </table>

          <Bagian
            judul="Penerimaan"
            rows={data.penerimaan}
            total={data.totalPenerimaan}
            labelTotal="Total Penerimaan"
            warna="text-emerald-600"
          />
          <Bagian
            judul="Pengeluaran"
            rows={data.pengeluaran}
            total={data.totalPengeluaran}
            labelTotal="Total Pengeluaran"
            warna="text-red-500"
          />

          <table className="w-full border-t border-zinc-100">
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="px-4 py-2 text-xs font-semibold text-zinc-700">
                  {data.kenaikanBersih >= 0 ? "Penambahan Kas" : "Pengurangan Kas"}
                </td>
                <td
                  className={`px-4 py-2 text-xs font-semibold text-right tabular-nums w-56 ${
                    data.kenaikanBersih >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {formatRupiah(data.kenaikanBersih)}
                </td>
              </tr>
              <tr className="bg-zinc-100 font-bold">
                <td className="px-4 py-3 text-sm text-zinc-800">Saldo Akhir Kas dan Bank</td>
                <td className="px-4 py-3 text-sm text-zinc-800 text-right tabular-nums w-56">
                  {formatRupiah(data.saldoAkhir)}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="px-5 py-3 border-t border-zinc-100 text-[11px] text-zinc-400">
            Saldo Akhir di atas dicocokkan dengan saldo akun Kas dan Bank di Neraca pada tanggal yang sama.
            Selisih saat ini: <strong className={data.isBalance ? "text-emerald-600" : "text-red-500"}>
              {formatRupiah(data.selisih)}
            </strong>
            .
          </p>
        </div>
      ) : null}
    </LaporanShell>
  );
}
