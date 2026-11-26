"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { useCan } from "@/hooks/use-can";
import { useRekapSertifikatManage } from "./manage";
import { SertifikatForm } from "./form";
import { SertifikatTable } from "./components/sertifikat-table";

function tanggal(value: string | null) {
  return value ? new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta", day: "2-digit", month: "long", year: "numeric",
  }).format(new Date(value)) : "–";
}

function RekapSertifikat({ noJadwal }: { noJadwal: string }) {
  const m = useRekapSertifikatManage(noJadwal);
  const canUpdate = useCan("input", "update");
  const href = `/input/${encodeURIComponent(noJadwal)}`;
  return (
    <AppLayout breadcrumbs={[{ label: "Input Data", href }, { label: "Rekap Nomor Sertifikat" }]}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-zinc-800">Rekap Nomor Sertifikat</h1>
            {m.data && (
              <>
                <p className="mt-2 text-sm font-medium text-zinc-700">{m.data.jadwal.judulLengkap}</p>
                <p className="mt-1 text-sm text-zinc-500">{m.data.jadwal.kota} / {tanggal(m.data.jadwal.tglMulai)} – {tanggal(m.data.jadwal.tglSelesai)}</p>
              </>
            )}
          </div>
          <Link href={href} className="text-sm font-medium text-emerald-700 hover:underline">Kembali ke Input</Link>
        </div>
        {m.isLoading && !m.data && <p role="status" className="py-12 text-center text-sm text-zinc-500">Memuat rekap sertifikat...</p>}
        {m.error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{m.error}</p>
            <button type="button" onClick={m.refetch} className="mt-2 font-medium underline">Coba lagi</button>
          </div>
        )}
        {m.data && (
          <>
            <SertifikatTable rows={m.data.pelatihan} loading={m.isLoading} onEdit={canUpdate ? m.edit : undefined} />
            <SertifikatTable rows={m.data.ujian} loading={m.isLoading} onEdit={canUpdate ? m.edit : undefined} ujian />
          </>
        )}
      </div>
      <SertifikatForm row={m.selected} onClose={m.close} onSubmit={m.save} saving={m.saving} error={m.saveError} />
    </AppLayout>
  );
}

export default function RekapSertifikatContainer() {
  const { id } = useParams<{ id: string }>();
  return <RekapSertifikat key={id} noJadwal={id} />;
}
