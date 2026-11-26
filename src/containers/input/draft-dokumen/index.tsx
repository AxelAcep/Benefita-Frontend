"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { DraftDokumenForm, type JenisDokumen } from "./form";
import { useDraftDokumen } from "./manage";

export default function DraftDokumen({ jenis }: { jenis: JenisDokumen }) {
  const { id: noJadwal, idPeserta } = useParams<{ id: string; idPeserta?: string }>();
  const m = useDraftDokumen(noJadwal, idPeserta);
  const halamanInput = `/input/${encodeURIComponent(noJadwal)}`;
  const judul = jenis === "invoice" ? "Draf Invoice" : "Draf Kwitansi";

  return (
    <AppLayout breadcrumbs={[{ label: "Input Data", href: halamanInput }, { label: judul }]}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{judul}</h1>
          <p className="text-sm text-zinc-600">Perubahan draf tidak disimpan. Penerbitan dokumen resmi belum tersedia.</p>
        </div>
        <Link href={halamanInput} className="text-sm font-medium text-emerald-700 hover:underline">Kembali ke Input</Link>
      </div>
      {m.loading && <p role="status" className="text-sm text-zinc-500">Memuat data peserta...</p>}
      {m.error && (
        <div role="alert" className="text-sm text-red-700">
          <p>{m.error}</p>
          {idPeserta && <button type="button" onClick={m.retry} className="mt-2 font-medium underline">Coba lagi</button>}
        </div>
      )}
      {m.peserta && <DraftDokumenForm key={`${jenis}:${m.peserta.id}`} peserta={m.peserta} jenis={jenis} />}
    </AppLayout>
  );
}
