"use client";

// Neraca — padanan sheet "BS".
// Tiap grup dipecah jadi sub-bagian ber-subtotal (Kas dan Bank, Piutang
// Usaha, Persediaan, dst) seperti layout di sheet, bukan satu daftar datar.
// Kolom pembanding opsional: isi "Bandingkan dengan" untuk menampilkan dua
// periode berdampingan.
import React, { useEffect, useState } from "react";
import { Scale, FileDown, Loader2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { useLaporanNeraca } from "@/hooks/use-laporan-keuangan";
import { exportNeracaExcel, type NeracaGrup, type NeracaResponse } from "@/lib/services/jurnal-keuangan.service";
import { formatRupiah } from "@/components/laporan-shell";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Cari subtotal grup dengan kategori yang sama di data pembanding. */
function totalPembanding(grupPembanding: NeracaGrup[] | undefined, kategori: string | null) {
  if (!grupPembanding) return undefined;
  return grupPembanding.find((g) => g.kategori === kategori)?.total ?? 0;
}

function Nilai({ v, bold }: { v: number | undefined; bold?: boolean }) {
  if (v === undefined) return null;
  return (
    <td
      className={`px-4 py-1.5 text-xs text-right tabular-nums w-40 ${
        bold ? "font-bold text-zinc-800" : "text-zinc-700"
      }`}
    >
      {formatRupiah(v)}
    </td>
  );
}

function Bagian({
  judul,
  grup,
  grupPembanding,
  labelTotal,
  total,
  totalBanding,
  adaPembanding,
}: {
  judul: string;
  grup: NeracaGrup[];
  grupPembanding?: NeracaGrup[];
  labelTotal: string;
  total: number;
  totalBanding?: number;
  adaPembanding: boolean;
}) {
  const kolom = adaPembanding ? 3 : 2;
  return (
    <>
      <tr className="bg-zinc-50/60">
        <td colSpan={kolom} className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase">
          {judul}
        </td>
      </tr>

      {grup.length > 0 ? (
        grup.map((g) => (
          <React.Fragment key={g.kategori ?? g.label}>
            <tr className="border-b border-zinc-50">
              <td className="pl-6 pr-4 py-1.5 text-xs font-medium text-zinc-700">{g.label}</td>
              <Nilai v={g.total} />
              {adaPembanding ? <Nilai v={totalPembanding(grupPembanding, g.kategori)} /> : null}
            </tr>
            {g.items.map((r) => (
              <tr key={r.akun.id ?? r.akun.nama} className="border-b border-zinc-50">
                <td className="pl-10 pr-4 py-1 text-[11px] text-zinc-400">
                  {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
                </td>
                <td className="px-4 py-1 text-[11px] text-zinc-400 text-right tabular-nums w-40">
                  {formatRupiah(r.saldo)}
                </td>
                {adaPembanding ? <td className="w-40" /> : null}
              </tr>
            ))}
          </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan={kolom} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">
            Tidak ada data.
          </td>
        </tr>
      )}

      <tr className="bg-zinc-50/60 border-b border-zinc-100">
        <td className="pl-5 pr-4 py-1.5 text-xs font-semibold text-zinc-700">{labelTotal}</td>
        <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right tabular-nums w-40">
          {formatRupiah(total)}
        </td>
        {adaPembanding ? (
          <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right tabular-nums w-40">
            {totalBanding === undefined ? "" : formatRupiah(totalBanding)}
          </td>
        ) : null}
      </tr>
    </>
  );
}

function KepalaKolom({ data, pembanding }: { data: NeracaResponse; pembanding?: NeracaResponse }) {
  if (!pembanding) return null;
  return (
    <tr className="border-b border-zinc-100">
      <td />
      <td className="px-4 py-1 text-[10px] font-semibold text-zinc-400 text-right">
        {String(data.tanggal).slice(0, 10)}
      </td>
      <td className="px-4 py-1 text-[10px] font-semibold text-zinc-400 text-right">
        {String(pembanding.tanggal).slice(0, 10)}
      </td>
    </tr>
  );
}

export default function NeracaBaruPage() {
  const [tanggal, setTanggal] = useState(todayIso());
  const [tanggalPembanding, setTanggalPembanding] = useState("");
  const { data, loading, fetchData } = useLaporanNeraca();
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  useEffect(() => {
    fetchData(tanggal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onExportExcel() {
    onExportingTrue();
    try {
      await exportNeracaExcel(tanggal);
    } catch (err) {
      setNotif({
        message: err instanceof Error ? err.message : "Gagal mengunduh Excel",
        type: "error",
        key: Date.now(),
      });
    } finally {
      onExportingFalse();
    }
  }

  const banding = data?.pembanding;
  const ada = Boolean(banding);

  return (
    <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting" }, { label: "Neraca" }]}>
      {notif ? (
        <Notification key={notif.key} message={notif.message} type={notif.type} onClose={() => setNotif(null)} />
      ) : null}

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
              <span className="text-[11px] text-zinc-400">bandingkan</span>
              <input
                type="date"
                value={tanggalPembanding}
                onChange={(e) => setTanggalPembanding(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <button
                onClick={() => fetchData(tanggal, tanggalPembanding || undefined)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
              >
                Tampilkan
              </button>
            </div>

            <button
              onClick={onExportExcel}
              disabled={exporting || !data}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
              Export Excel
            </button>

            <span className="ml-auto inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 whitespace-nowrap">
              Real-time
            </span>
            {data ? (
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
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
                  <KepalaKolom data={data} pembanding={banding} />
                  <Bagian
                    judul="Aktiva Lancar"
                    grup={data.aktivaLancarGrup}
                    grupPembanding={banding?.aktivaLancarGrup}
                    labelTotal="Total Aktiva Lancar"
                    total={data.totalAktivaLancar}
                    totalBanding={banding?.totalAktivaLancar}
                    adaPembanding={ada}
                  />
                  <Bagian
                    judul="Aktiva Tetap"
                    grup={data.aktivaTetapGrup}
                    grupPembanding={banding?.aktivaTetapGrup}
                    labelTotal="Total Aktiva Tetap"
                    total={data.totalAktivaTetap}
                    totalBanding={banding?.totalAktivaTetap}
                    adaPembanding={ada}
                  />
                  {data.aktivaTidakLancarLainnyaGrup.length > 0 ? (
                    <Bagian
                      judul="Aktiva Tidak Lancar Lainnya"
                      grup={data.aktivaTidakLancarLainnyaGrup}
                      grupPembanding={banding?.aktivaTidakLancarLainnyaGrup}
                      labelTotal="Total Aktiva Tidak Lancar Lainnya"
                      total={data.totalAktivaTidakLancarLainnya}
                      totalBanding={banding?.totalAktivaTidakLancarLainnya}
                      adaPembanding={ada}
                    />
                  ) : null}

                  <tr className="border-t-2 border-zinc-200">
                    <td className="px-4 py-2.5 text-xs font-bold text-zinc-800">TOTAL AKTIVA</td>
                    <Nilai v={data.totalAset} bold />
                    {ada ? <Nilai v={banding?.totalAset} bold /> : null}
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
                  <KepalaKolom data={data} pembanding={banding} />
                  <Bagian
                    judul="Hutang Lancar"
                    grup={data.hutangLancarGrup}
                    grupPembanding={banding?.hutangLancarGrup}
                    labelTotal="Total Hutang Lancar"
                    total={data.totalHutangLancar}
                    totalBanding={banding?.totalHutangLancar}
                    adaPembanding={ada}
                  />
                  <Bagian
                    judul="Hutang Jangka Panjang"
                    grup={data.hutangJangkaPanjangGrup}
                    grupPembanding={banding?.hutangJangkaPanjangGrup}
                    labelTotal="Total Hutang Jangka Panjang"
                    total={data.totalHutangJangkaPanjang}
                    totalBanding={banding?.totalHutangJangkaPanjang}
                    adaPembanding={ada}
                  />
                  <Bagian
                    judul="Modal"
                    grup={data.modalGrup}
                    grupPembanding={banding?.modalGrup}
                    labelTotal="Total Modal"
                    total={data.totalModal}
                    totalBanding={banding?.totalModal}
                    adaPembanding={ada}
                  />

                  <tr className="border-t-2 border-zinc-200">
                    <td className="px-4 py-2.5 text-xs font-bold text-zinc-800">TOTAL KEWAJIBAN &amp; EKUITAS</td>
                    <Nilai v={data.totalLiabilitas + data.totalModal} bold />
                    {ada ? <Nilai v={(banding?.totalLiabilitas ?? 0) + (banding?.totalModal ?? 0)} bold /> : null}
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
