"use client";

import CardRekapPotensi from "./components/card/CardRekapPotensi";
import CardNeracaKeuangan from "./components/card/CardNeracaKeuangan";
import CardLaporanHasilUsaha from "./components/card/CardLaporanHasilUsaha";
import CardLabaRugi from "./components/card/CardLabaRugi";
import AppLayout from "@/components/app-layout";
import { useBerandaManage } from "./manage";
import { DUMMY_DATA, BULAN_OPTIONS, DUMMY_KODE_OPTIONS, DUMMY_DATA_NERACA, DUMMY_DATA_LHU, DUMMY_DATA_LABARUGI } from "./data-contoh";

export default function BerandaContainer() {
  const { bulan, setBulan, pickKode, setPickKode } = useBerandaManage();

  return (
    <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting/beranda" }, { label: "Beranda" }]}>
      {/* Filter Bulan */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-zinc-600">Bulan</span>
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="text-xs border border-zinc-200 rounded-md px-3 py-1.5 bg-white text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          {BULAN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col gap-6">
        <CardRekapPotensi
          totalPeserta={DUMMY_DATA.totalPeserta}
          pesertaReguler={DUMMY_DATA.pesertaReguler}
          pesertaInHouse={DUMMY_DATA.pesertaInHouse}
          totalPendapatan={DUMMY_DATA.totalPendapatan}
          pesertaPerKelompok={DUMMY_DATA.pesertaPerKelompok}
          pendapatanPerKelompok={DUMMY_DATA.pendapatanPerKelompok}
          perbandinganRegulerInhouse={DUMMY_DATA.perbandinganRegulerInhouse}
          kodeOptions={DUMMY_KODE_OPTIONS}
          pickKode={pickKode}
          onChangeKode={setPickKode}
        />
        <CardNeracaKeuangan
          tahun={2023}
          totalPemasukan={DUMMY_DATA_NERACA.totalPemasukan}
          totalPengeluaran={DUMMY_DATA_NERACA.totalPengeluaran}
          saldoBersih={DUMMY_DATA_NERACA.saldoBersih}
          arusKasHarian={DUMMY_DATA_NERACA.arusKasHarian}
          top5Pengeluaran={DUMMY_DATA_NERACA.top5Pengeluaran}
          distribusiPengeluaran={DUMMY_DATA_NERACA.distribusiPengeluaran}
        />
        <CardLaporanHasilUsaha
          realisasiPendapatan={DUMMY_DATA_LHU.realisasiPendapatan}
          realisasiBiaya={DUMMY_DATA_LHU.realisasiBiaya}
          programDenganRealisasi={DUMMY_DATA_LHU.programDenganRealisasi}
          realisasiPerProgram={DUMMY_DATA_LHU.realisasiPerProgram}
          distribusiPerProgram={DUMMY_DATA_LHU.distribusiPerProgram}
        />
        <CardLabaRugi
          pendapatan={DUMMY_DATA_LABARUGI.pendapatan}
          totalBiaya={DUMMY_DATA_LABARUGI.totalBiaya}
          labaOperasional={DUMMY_DATA_LABARUGI.labaOperasional}
          arusKas={DUMMY_DATA_LABARUGI.arusKas}
          komposisiHpp={DUMMY_DATA_LABARUGI.komposisiHpp}
          komposisiBiayaOps={DUMMY_DATA_LABARUGI.komposisiBiayaOps}
        />
      </div>
    </AppLayout>
  );
}
