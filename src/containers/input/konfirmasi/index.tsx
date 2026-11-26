"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import AppLayout from "@/components/app-layout";
import { KonfirmasiForm } from "./form";
import { useKonfirmasiManage } from "./manage";

function KonfirmasiPeserta({ id, noJadwal }: { id: string; noJadwal: string }) {
  const m = useKonfirmasiManage(noJadwal, id);
  const router = useRouter();
  const href = `/input/${encodeURIComponent(noJadwal)}`;

  return (
    <AppLayout breadcrumbs={[{ label: "Input Data", href }, { label: "Konfirmasi" }]}>
      <div className="max-w-3xl rounded-xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">Konfirmasi Peserta</h1>
          <Link href={href} className="text-sm font-medium text-emerald-700 hover:underline">Kembali ke Input</Link>
        </div>
        {m.loading && <p role="status" className="text-sm text-zinc-600">Memuat peserta dan konfirmasi...</p>}
        {m.error && (
          <div role="alert" className="text-sm text-red-700">
            <p>{m.error}</p>
            <button type="button" className="mt-2 font-medium underline" onClick={m.retry}>Coba lagi</button>
          </div>
        )}
        {m.peserta && (
          <>
            <dl className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-zinc-500">Peserta</dt><dd className="font-medium">{m.peserta.nama}</dd></div>
              <div><dt className="text-zinc-500">Instansi</dt><dd className="font-medium">{m.peserta.perusahaan?.company || "–"}</dd></div>
              <div><dt className="text-zinc-500">Pelatihan</dt><dd className="font-medium">{m.peserta.jadwalTraining.judulLengkap}</dd></div>
              <div><dt className="text-zinc-500">Nomor Konfirmasi</dt><dd className="font-medium">{m.konfirmasi?.noKonfirmasi ?? "Dibuat saat disimpan"}</dd></div>
              <div><dt className="text-zinc-500">Kota</dt><dd className="font-medium">{m.peserta.jadwalTraining.kota || "–"}</dd></div>
              <div>
                <dt className="text-zinc-500">Harga Konfirmasi</dt>
                <dd className="font-medium">{m.peserta.hargaTotal == null ? "–" : `Rp${(m.peserta.hargaTotal - (m.peserta.diskon ?? 0)).toLocaleString("id-ID")}`}</dd>
              </div>
            </dl>
            <KonfirmasiForm
              peserta={m.peserta}
              konfirmasi={m.konfirmasi}
              simpan={async (values) => {
                await m.simpan(values);
                toast.success(m.konfirmasi ? "Konfirmasi diperbarui." : "Konfirmasi dibuat.");
                router.push(href);
              }}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default function KonfirmasiContainer() {
  const { id: noJadwal, idPeserta } = useParams<{ id: string; idPeserta: string }>();
  return <KonfirmasiPeserta key={JSON.stringify([noJadwal, idPeserta])} id={idPeserta} noJadwal={noJadwal} />;
}
