"use client";

import { UserPlus } from "lucide-react";
import {
  LaporanPesertaUji,
  type KolomLaporan,
} from "@/containers/training/laporan-peserta-uji";
import { CHECKLIST_FIELDS } from "@/lib/services/peserta-uji.service";

const KOLOM: KolomLaporan[] = [
  {
    label: "Kelengkapan Dokumen",
    render: (row) => {
      const lengkap = CHECKLIST_FIELDS.filter((f) => row[f]).length;
      const total = CHECKLIST_FIELDS.length;
      const persen = Math.round((lengkap / total) * 100);

      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden max-w-[100px]">
            <div className="h-full bg-emerald-400" style={{ width: `${persen}%` }} />
          </div>
          <span className="text-[10px] text-zinc-500 whitespace-nowrap">
            {lengkap}/{total}
          </span>
        </div>
      );
    },
  },
];

export default function CalonPesertaUjiContainer() {
  return (
    <LaporanPesertaUji
      judulHalaman="Calon Peserta Uji"
      judulKartu="Calon Peserta Uji"
      ikon={<UserPlus className="w-3.5 h-3.5 text-emerald-500" />}
      warnaIkon="bg-emerald-50"
      filterTetap={{ status: "CALON" }}
      kolomTambahan={KOLOM}
    />
  );
}
