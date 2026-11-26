"use client";

import { XCircle } from "lucide-react";
import {
  Dash,
  LaporanPesertaUji,
  type KolomLaporan,
} from "@/containers/training/laporan-peserta-uji";

const KOLOM: KolomLaporan[] = [
  { label: "Asesor", lebar: "w-32", render: (r) => <Dash>{r.asesor?.nama}</Dash> },
  { label: "TUK", lebar: "w-32", render: (r) => <Dash>{r.tuk?.nama}</Dash> },
];

export default function DaftarAsesiBKContainer() {
  return (
    <LaporanPesertaUji
      judulHalaman="Daftar Asesi BK"
      judulKartu="Daftar Asesi — Belum Kompeten (BK)"
      ikon={<XCircle className="w-3.5 h-3.5 text-red-500" />}
      warnaIkon="bg-red-50"
      filterTetap={{ statusHasil: "BK" }}
      kolomTambahan={KOLOM}
    />
  );
}
