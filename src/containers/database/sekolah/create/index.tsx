"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import TableButton from "@/components/base/table-button";
import CardInstansiSekolah from "@/app/database/sekolah/(form)/card-instansi-sekolah";
import CardKontak from "@/app/database/sekolah/(form)/card-kontak";
import CardLokasiSekolah from "@/app/database/sekolah/(form)/card-lokasi-sekolah";
import CardKlasifikasi from "@/app/database/sekolah/(form)/card-klasifikasi";
import CardInformasiSekolahDetail from "@/app/database/sekolah/(form)/card-infromasi-sekolah-detail";
import { useCreateSekolahManage } from "./manage";

export default function CreateSekolahContainer() {
  const m = useCreateSekolahManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Sekolah", href: "/database/sekolah" },
        { label: "Tambah" },
      ]}
    >
      {m.showSuccess && (
        <Notification message="Data berhasil disimpan!" type="success" onClose={() => m.setShowSuccess(false)} />
      )}
      {m.error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
          {m.error}
        </div>
      )}
      <div className="space-y-4">
        <CardInstansiSekolah initialData={m.form.instansiSekolah} onChange={(data) => m.setSection("instansiSekolah", data)} disabled={m.loading} />
        <CardKontak initialData={m.form.kontak} onChange={(data) => m.setSection("kontak", data)} disabled={m.loading} />
        <CardLokasiSekolah initialData={m.form.lokasi} onChange={(data) => m.setSection("lokasi", data)} disabled={m.loading} />
        <CardKlasifikasi initialData={m.form.klasifikasi} onChange={(data) => m.setSection("klasifikasi", data)} disabled={m.loading} />
        <CardInformasiSekolahDetail initialData={m.form.informasiSekolahDetail} onChange={(data) => m.setSection("informasiSekolahDetail", data)} disabled={m.loading} />
      </div>
      <div className="mt-4 flex justify-end">
        <TableButton icon="plus" onClick={m.submit} disabled={m.loading}>
          {m.loading ? "Menyimpan..." : "Simpan Data"}
        </TableButton>
      </div>
    </AppLayout>
  );
}
