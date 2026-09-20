"use client";

import React, { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useLaporanNeraca } from "@/hooks/use-laporan-keuangan";
import type { NeracaRow } from "@/lib/services/jurnal-keuangan.service";

function formatRupiah(val: number) {
  return `Rp${val.toLocaleString("id-ID")}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function NeracaRows({ rows }: { rows: NeracaRow[] }) {
  return rows && rows.length > 0
    ? rows.map((r) => {
        return (
          <tr key={r.akun.id} className="border-b border-zinc-50">
            <td className="pl-8 pr-4 py-1.5 text-xs text-zinc-600">
              {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
            </td>
            <td className="px-4 py-1.5 text-xs text-zinc-700 text-right">{formatRupiah(r.saldo)}</td>
          </tr>
        );
      })
    : null;
}

function NeracaSubtotal({ label, total }: { label: string; total: number }) {
  return (
    <tr className="bg-zinc-50/60 border-b border-zinc-100">
      <td className="pl-5 pr-4 py-1.5 text-xs font-semibold text-zinc-700">{label}</td>
      <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right">{formatRupiah(total)}</td>
    </tr>
  );
}

export default function NeracaBaruPage() {
  const [tanggal, setTanggal] = useState(todayIso());
  const { data, loading, fetchData } = useLaporanNeraca();

  useEffect(() => {
    fetchData(tanggal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData(tanggal);
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Neraca" },
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Scale className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">Neraca</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <button
                onClick={onFilter}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
              >
                Tampilkan
              </button>
            </div>

            {data ? (
              <span
                className={`ml-auto inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                  data.isBalance ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                }`}
              >
                {data.isBalance ? "Balance" : `Selisih ${formatRupiah(data.selisih)}`}
              </span>
            ) : null}
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-xs text-zinc-400">Memuat data...</p>
        ) : data ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* AKTIVA */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden self-start">
              <div className="px-5 py-2.5 bg-zinc-800 border-b border-zinc-100">
                <p className="text-[11px] font-bold text-white tracking-wide">AKTIVA</p>
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="bg-zinc-50/60">
                    <td colSpan={2} className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase">
                      Aktiva Lancar
                    </td>
                  </tr>
                  {data.aktivaLancar && data.aktivaLancar.length > 0 ? (
                    <NeracaRows rows={data.aktivaLancar} />
                  ) : (
                    <tr>
                      <td colSpan={2} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  <NeracaSubtotal label="Total Aktiva Lancar" total={data.totalAktivaLancar} />

                  <tr className="bg-zinc-50/60">
                    <td colSpan={2} className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase">
                      Aktiva Tetap
                    </td>
                  </tr>
                  {data.aktivaTetap && data.aktivaTetap.length > 0 ? (
                    <NeracaRows rows={data.aktivaTetap} />
                  ) : (
                    <tr>
                      <td colSpan={2} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  <NeracaSubtotal label="Total Aktiva Tetap" total={data.totalAktivaTetap} />

                  <tr className="border-t-2 border-zinc-200">
                    <td className="px-4 py-2.5 text-xs font-bold text-zinc-800">TOTAL AKTIVA</td>
                    <td className="px-4 py-2.5 text-xs font-bold text-zinc-800 text-right">
                      {formatRupiah(data.totalAset)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PASIVA */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden self-start">
              <div className="px-5 py-2.5 bg-zinc-800 border-b border-zinc-100">
                <p className="text-[11px] font-bold text-white tracking-wide">PASIVA</p>
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="bg-zinc-50/60">
                    <td colSpan={2} className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase">
                      Hutang Lancar
                    </td>
                  </tr>
                  {data.hutangLancar && data.hutangLancar.length > 0 ? (
                    <NeracaRows rows={data.hutangLancar} />
                  ) : (
                    <tr>
                      <td colSpan={2} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  <NeracaSubtotal label="Total Hutang Lancar" total={data.totalHutangLancar} />

                  <tr className="bg-zinc-50/60">
                    <td colSpan={2} className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase">
                      Hutang Jangka Panjang
                    </td>
                  </tr>
                  {data.hutangJangkaPanjang && data.hutangJangkaPanjang.length > 0 ? (
                    <NeracaRows rows={data.hutangJangkaPanjang} />
                  ) : (
                    <tr>
                      <td colSpan={2} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  <NeracaSubtotal label="Total Hutang Jangka Panjang" total={data.totalHutangJangkaPanjang} />

                  <tr className="bg-zinc-50/60">
                    <td colSpan={2} className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase">
                      Modal
                    </td>
                  </tr>
                  {data.modal && data.modal.length > 0 ? (
                    <NeracaRows rows={data.modal} />
                  ) : (
                    <tr>
                      <td colSpan={2} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                  <NeracaSubtotal label="Total Modal" total={data.totalModal} />

                  <tr className="border-t-2 border-zinc-200">
                    <td className="px-4 py-2.5 text-xs font-bold text-zinc-800">TOTAL KEWAJIBAN &amp; EKUITAS</td>
                    <td className="px-4 py-2.5 text-xs font-bold text-zinc-800 text-right">
                      {formatRupiah(data.totalLiabilitas + data.totalModal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
