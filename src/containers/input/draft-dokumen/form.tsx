"use client";

import { useState } from "react";
import { TextInput } from "@/components/base/form-field";
import type { PesertaTraining } from "@/lib/services/input.service";

export type JenisDokumen = "invoice" | "kwitansi";

const formatUang = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const rupiah = (value: number | null) => value === null ? "" : formatUang.format(value);
const formatTanggal = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });
const tanggal = (value: string | null) => value ? formatTanggal.format(new Date(value)) : "";

function buatIsian(peserta: PesertaTraining, jenis: JenisDokumen) {
  const jadwal = peserta.jadwalTraining;
  return {
    nomor: (jenis === "invoice" ? peserta.noInvoice : peserta.noKwitansi) ?? "",
    tanggal: jenis === "kwitansi" ? tanggal(peserta.tglBayar) : "",
    noPO: "",
    namaPeserta: peserta.nama,
    instansi: peserta.perusahaan?.company ?? "",
    alamat: peserta.alamat ?? "",
    kode: jadwal.kodePelatihan,
    judul: jadwal.judulLengkap,
    kota: jadwal.kota,
    periode: [tanggal(jadwal.tglMulai), tanggal(jadwal.tglSelesai)].filter(Boolean).join(" – "),
    harga: rupiah(jadwal.biaya),
    ppn: rupiah(peserta.ppn),
    diskon: rupiah(peserta.diskon),
    total: rupiah(peserta.hargaTotal),
    dibayar: rupiah(peserta.bayar),
    administrasi: "",
    jabatan: "",
  };
}

type Isian = ReturnType<typeof buatIsian>;
type Field = [keyof Isian, string];

export function DraftDokumenForm({ peserta, jenis }: { peserta: PesertaTraining; jenis: JenisDokumen }) {
  const [isian, setIsian] = useState(() => buatIsian(peserta, jenis));
  const identitas: Field[] = [
    ["nomor", jenis === "invoice" ? "No. Invoice" : "No. Kwitansi"],
    ["tanggal", "Tanggal Dokumen"],
    ["noPO", "No. PO"],
    ["namaPeserta", "Nama Peserta"],
    ["instansi", "Instansi"],
    ["alamat", "Alamat"],
  ];

  function fields(items: Field[]) {
    return items.map(([name, label]) => (
      <TextInput
        key={name}
        label={label}
        aria-label={label}
        value={isian[name]}
        onChange={(event) => setIsian((previous) => ({ ...previous, [name]: event.target.value }))}
      />
    ));
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Identitas Dokumen</h2>
        <div className="grid gap-3 sm:grid-cols-2">{fields(identitas)}</div>
      </section>
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Pelatihan dan Pembayaran</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields([
            ["kode", "Kode Pelatihan"], ["judul", "Judul Pelatihan"], ["kota", "Kota"], ["periode", "Periode Pelatihan"],
            ["harga", "Biaya Jadwal"], ["ppn", "PPN"], ["diskon", "Diskon"], ["total", "Total Tagihan"], ["dibayar", "Pembayaran"],
          ])}
        </div>
      </section>
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Pengesahan</h2>
        <div className="grid gap-3 sm:grid-cols-2">{fields([["administrasi", "Administrasi"], ["jabatan", "Jabatan"]])}</div>
      </section>
    </div>
  );
}
