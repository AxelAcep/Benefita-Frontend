"use client";

import { Award } from "lucide-react";
import {
  Dash,
  LaporanPesertaUji,
  tanggalRingkas,
  type KolomLaporan,
} from "@/containers/training/laporan-peserta-uji";

const KOLOM: KolomLaporan[] = [
  { label: "No Reg", lebar: "w-32", render: (r) => <Dash>{r.noReg}</Dash> },
  {
    label: "No Ser BNSP",
    lebar: "w-32",
    render: (r) => <Dash>{r.noSerBNSP}</Dash>,
  },
  {
    label: "Tgl Terbit",
    lebar: "w-28",
    kelasSel: "whitespace-nowrap",
    render: (r) => tanggalRingkas(r.tglTerbit),
  },
  {
    label: "Status",
    lebar: "w-24",
    kelasSel: "text-center",
    render: () => (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
        B Terbit
      </span>
    ),
  },
];

export default function DaftarAsesiContainer() {
  return (
    <LaporanPesertaUji
      judulHalaman="Daftar Asesi"
      judulKartu="Daftar Asesi — Kompeten (K)"
      ikon={<Award className="w-3.5 h-3.5 text-emerald-500" />}
      warnaIkon="bg-emerald-50"
      filterTetap={{ statusHasil: "K" }}
      kolomTambahan={KOLOM}
    />
  );
}
