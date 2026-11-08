"use client";

// Laporan Laba Rugi Rinci — padanan sheet "IS-BI".
// Isinya sama dengan Laporan Laba Rugi, bedanya beban digabung per
// grupBeban: mis. 6.1001 + 6.1002 + 6.1003 tampil sebagai satu baris
// "Gaji, Tunjangan, Bonus, Honorarium, THR, dsb".
import React from "react";
import { ListTree } from "lucide-react";
import { useLaporanLabaRugiRinci } from "@/hooks/use-laporan-keuangan";
import { LaporanShell, usePeriodeAwal } from "@/components/laporan-shell";
import { LabaRugiTabel, dariAkun, dariGrup } from "@/components/laba-rugi-tabel";

export default function LabaRugiRinciPage() {
  const { data, loading, fetchData } = useLaporanLabaRugiRinci();
  const { startDate, setStartDate, endDate, setEndDate } = usePeriodeAwal(fetchData);

  return (
    <LaporanShell
      judul="Laporan Laba Rugi Rinci"
      icon={ListTree}
      startDate={startDate}
      endDate={endDate}
      onStartDate={setStartDate}
      onEndDate={setEndDate}
      onFilter={() => fetchData(startDate, endDate)}
      loading={loading}
      badge={
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 whitespace-nowrap">
          Real-time
        </span>
      }
    >
      {data ? (
        <LabaRugiTabel
          data={data}
          pendapatanUsaha={dariAkun(data.pendapatanUsaha)}
          hargaPokok={dariGrup(data.hargaPokokRinci)}
          bebanPenjualan={dariGrup(data.bebanPenjualanRinci)}
          bebanAdministrasi={dariGrup(data.bebanAdministrasiRinci)}
          pendapatanLain={dariAkun(data.pendapatanLain)}
          bebanLain={dariAkun(data.bebanLain)}
          pajakPenghasilan={dariAkun(data.pajakPenghasilan)}
        />
      ) : null}
    </LaporanShell>
  );
}
