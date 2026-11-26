"use client";

import { TabelContoh } from "@/containers/input/components/tabel-contoh";
import type { ColumnDef } from "@/components/base/data-table";
import { infoPelatihan, sertifikatData, type SertifikatItem } from "./data";

const columns: ColumnDef<SertifikatItem>[] = [
  { key: "nama", label: "Nama", className: "font-medium" },
  { key: "perusahaanInstansi", label: "Perusahaan/Instansi" },
  { key: "noSertifikat", label: "No. Sertifikat" },
  { key: "noReg", label: "No. Reg" },
];

export default function RekapSertifikatContainer() {
  return (
    <TabelContoh
      judul="Rekap Nomor Sertifikat"
      info={<p className="mt-2 text-xs text-zinc-600">{infoPelatihan.judulPelatihan} · {infoPelatihan.tempatTanggalKegiatan}</p>}
      columns={columns}
      data={sertifikatData}
      pageSize={10}
      searchPlaceholder="Cari nama, perusahaan, atau no. sertifikat..."
      match={(row, query) => [row.nama, row.perusahaanInstansi, row.noSertifikat].some((value) => value.toLowerCase().includes(query))}
    />
  );
}
