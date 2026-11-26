"use client";

import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import TableLoading from "@/components/base/table-loading";
import TablePagination from "@/components/base/table-pagination";
import { BIDANG_AKUN } from "@/lib/types/customer-training";
import { useKebutuhanTrainingManage } from "./manage";

const TH = "px-4 py-3 text-left text-xs font-semibold text-zinc-500";
const TD = "px-4 py-3 text-xs text-zinc-600 align-top";
const DETAIL_ROUTES: Record<string, string> = {
  PERUSAHAAN: "perusahaan", RUMAH_SAKIT: "rumah-sakit", PEMDA: "pemda",
  SEKOLAH: "sekolah", INSTANSI_DAERAH: "instansi-daerah",
};

export default function KebutuhanTrainingContainer() {
  const m = useKebutuhanTrainingManage();
  return (
    <AppLayout breadcrumbs={[{ label: "Perusahaan" }, { label: "Kebutuhan Training" }]}>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-100 px-5 py-4">
          <h1 className="text-sm font-bold text-zinc-800">Kebutuhan Training</h1>
          <label className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            Kode Pelatihan
            <select value={m.kodeTraining} onChange={(e) => m.changeKode(e.target.value)} disabled={m.optionsLoading}
              className="w-full max-w-80 rounded-lg border border-zinc-200 px-3 py-2 sm:w-80 disabled:opacity-60">
              <option value="">{m.optionsLoading ? "Memuat kode pelatihan..." : "Pilih kode pelatihan"}</option>
              {m.options.map((o) => <option key={o.kode} value={o.kode}>{o.kode} — {o.judulTraining}</option>)}
            </select>
          </label>
          <input aria-label="Cari perusahaan" placeholder="Cari perusahaan, no induk, lini bisnis..."
            value={m.search} onChange={(e) => m.changeSearch(e.target.value)}
            className="ml-auto w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs sm:w-64" />
          {m.optionsError && <p role="alert" className="w-full text-xs text-red-600">{m.optionsError}</p>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                <th rowSpan={2} className={TH}>No.</th>
                <th rowSpan={2} className={TH}>No. Induk</th>
                <th rowSpan={2} className={TH}>Perusahaan</th>
                <th rowSpan={2} className={`${TH} text-center`}>Total Peserta</th>
                <th colSpan={4} className={`${TH} text-center`}>Akun</th>
                <th rowSpan={2} className={TH}>Line of Business</th>
                <th rowSpan={2} className={TH}>Kebutuhan Training</th>
              </tr>
              <tr>{BIDANG_AKUN.map((field) => <th key={field} className={`${TH} text-center`}>{field.toUpperCase()}</th>)}</tr>
            </thead>
            <tbody aria-busy={m.loading}>
              {m.loading ? <TableLoading columns={10} /> : !m.kodeTraining || m.error || m.data.length === 0 ? (
                <tr><td colSpan={10} className="px-5 py-12 text-center text-sm text-zinc-500">
                  <span role={m.error ? "alert" : "status"} className={m.error ? "text-red-600" : undefined}>
                    {!m.kodeTraining ? "Pilih kode pelatihan untuk melihat kebutuhan training perusahaan." : m.error || "Tidak ada perusahaan yang cocok."}
                  </span>
                </td></tr>
              ) : m.data.map((row, index) => (
                <tr key={row.noInduk} className="border-b border-zinc-100 hover:bg-zinc-50/60">
                  <td className={TD}>{(m.page - 1) * 10 + index + 1}</td>
                  <td className={`${TD} whitespace-nowrap`}>{row.noInduk}</td>
                  <td className={`${TD} min-w-52`}><Anchor name={row.perusahaan || row.noInduk}
                    route={`/database/${DETAIL_ROUTES[row.jenisInstansi] || "perusahaan"}/${encodeURIComponent(row.noInduk)}`} /></td>
                  <td className={`${TD} text-center`}>{row.totalPeserta}</td>
                  {BIDANG_AKUN.map((field) => <td key={field} className={`${TD} text-center font-semibold`}>{row.akun[field]?.kode || "–"}</td>)}
                  <td className={`${TD} min-w-48`}>{row.lineOfBusiness || "–"}</td>
                  <td className={`${TD} min-w-80 max-w-md break-all`}>{row.kebutuhanTrainingMentah || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {m.kodeTraining && !m.loading && !m.error && <TablePagination page={m.page} limit={10}
          total={m.pagination.total} totalPages={m.pagination.totalPages} onPageChange={m.setPage} />}
      </div>
    </AppLayout>
  );
}
