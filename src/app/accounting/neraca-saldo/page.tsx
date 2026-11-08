"use client";

// Neraca Saldo — padanan sheet "TB" di file Laporan Keuangan.
// Satu baris per akun: Saldo Awal, mutasi Debit & Kredit selama periode,
// lalu Saldo Akhir yang dipecah ke kolom Debit/Kredit supaya totalnya sama.
import React from "react";
import { Scale } from "lucide-react";
import { useNeracaSaldo } from "@/hooks/use-laporan-keuangan";
import {
  BadgeBalance,
  LaporanShell,
  formatRupiah,
  usePeriodeAwal,
} from "@/components/laporan-shell";

const th = "px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase";
const td = "px-3 py-1.5 text-xs text-zinc-600";
const tdNum = "px-3 py-1.5 text-xs text-zinc-700 text-right tabular-nums";
const tdTotal = "px-3 py-2 text-xs font-bold text-zinc-800 text-right tabular-nums";

export default function NeracaSaldoPage() {
  const { data, loading, fetchData } = useNeracaSaldo();
  const { startDate, setStartDate, endDate, setEndDate } = usePeriodeAwal(fetchData);

  return (
    <LaporanShell
      judul="Neraca Saldo"
      icon={Scale}
      startDate={startDate}
      endDate={endDate}
      onStartDate={setStartDate}
      onEndDate={setEndDate}
      onFilter={() => fetchData(startDate, endDate)}
      loading={loading}
      badge={data ? <BadgeBalance isBalance={data.isBalance} selisih={data.selisihSaldo} /> : null}
    >
      {data ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-zinc-50/60 border-b border-zinc-100">
                <th className={`${th} text-left`}>Kode</th>
                <th className={`${th} text-left`}>Nama Akun</th>
                <th className={`${th} text-right`}>Saldo Awal</th>
                <th className={`${th} text-right`}>Mutasi Debit</th>
                <th className={`${th} text-right`}>Mutasi Kredit</th>
                <th className={`${th} text-right`}>Saldo Akhir Debit</th>
                <th className={`${th} text-right`}>Saldo Akhir Kredit</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.length > 0 ? (
                data.rows.map((r) => (
                  <tr key={r.akun.id} className="border-b border-zinc-50 hover:bg-zinc-50/40">
                    <td className={`${td} font-mono text-[11px] text-zinc-400`}>{r.akun.kode ?? "-"}</td>
                    <td className={td}>
                      {r.akun.nama}
                      {r.akun.kategoriLabel ? (
                        <span className="ml-2 text-[10px] text-zinc-300">{r.akun.kategoriLabel}</span>
                      ) : null}
                    </td>
                    <td className={tdNum}>{formatRupiah(r.saldoAwal)}</td>
                    <td className={tdNum}>{r.debit ? formatRupiah(r.debit) : "-"}</td>
                    <td className={tdNum}>{r.kredit ? formatRupiah(r.kredit) : "-"}</td>
                    <td className={tdNum}>{r.saldoAkhirDebit ? formatRupiah(r.saldoAkhirDebit) : "-"}</td>
                    <td className={tdNum}>{r.saldoAkhirKredit ? formatRupiah(r.saldoAkhirKredit) : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs text-zinc-400">
                    Belum ada akun dengan saldo atau mutasi di periode ini.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-100 border-t border-zinc-200">
                <td colSpan={2} className="px-3 py-2 text-xs font-bold text-zinc-800">
                  TOTAL
                </td>
                <td className={tdTotal}>{formatRupiah(data.total.saldoAwal)}</td>
                <td className={tdTotal}>{formatRupiah(data.total.debit)}</td>
                <td className={tdTotal}>{formatRupiah(data.total.kredit)}</td>
                <td className={tdTotal}>{formatRupiah(data.total.saldoAkhirDebit)}</td>
                <td className={tdTotal}>{formatRupiah(data.total.saldoAkhirKredit)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="px-5 py-3 border-t border-zinc-100 flex flex-wrap gap-x-8 gap-y-1 text-[11px] text-zinc-500">
            <span>
              Selisih mutasi Debit − Kredit:{" "}
              <strong className={data.selisihMutasi === 0 ? "text-emerald-600" : "text-red-500"}>
                {formatRupiah(data.selisihMutasi)}
              </strong>
            </span>
            <span>
              Selisih saldo akhir Debit − Kredit:{" "}
              <strong className={data.selisihSaldo === 0 ? "text-emerald-600" : "text-red-500"}>
                {formatRupiah(data.selisihSaldo)}
              </strong>
            </span>
          </div>
        </div>
      ) : null}
    </LaporanShell>
  );
}
