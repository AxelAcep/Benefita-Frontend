"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import TableButton from "@/components/base/table-button";
import CardPerusahaan from "@/app/database/rumah-sakit/(form)/card-perusahaan";
import CardLokasi from "@/app/database/rumah-sakit/(form)/card-lokasi";
import CardSertifikasi from "@/app/database/rumah-sakit/(form)/card-sertifikasi";
import CardKlasifikasi from "@/app/database/rumah-sakit/(form)/card-klasifikasi";
import CardPropertiFinansial from "@/app/database/rumah-sakit/(form)/card-properti";
import CardInformasiLainnya from "@/app/database/rumah-sakit/(form)/card-lainya";
import CardKontak from "@/app/database/rumah-sakit/(form)/card-kontak";
import { useCreateRumahSakitManage } from "./manage";

export default function CreateRumahSakitContainer() {
  const m = useCreateRumahSakitManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Instansi/Rumah Sakit", href: "/database/rumah-sakit" },
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
        <CardPerusahaan initialData={m.form.perusahaan ?? {}} onChange={(data) => m.setSection("perusahaan", data)} disabled={m.loading} />
        <CardLokasi initialData={m.form.lokasi ?? {}} onChange={(data) => m.setSection("lokasi", data)} disabled={m.loading} />
        <CardKontak initialData={m.form.kontak ?? {}} onChange={(data) => m.setSection("kontak", data)} disabled={m.loading} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardSertifikasi initialData={m.form.sertifikasi ?? {}} onChange={(data) => m.setSection("sertifikasi", data)} disabled={m.loading} />
          <CardKlasifikasi initialData={m.form.klasifikasi ?? {}} onChange={(data) => m.setSection("klasifikasi", data)} disabled={m.loading} />
        </div>
        <CardPropertiFinansial initialData={m.form.propertiFinansial ?? {}} onChange={(data) => m.setSection("propertiFinansial", data)} disabled={m.loading} />
        <CardInformasiLainnya initialData={m.form.informasiLainnya ?? {}} onChange={(data) => m.setSection("informasiLainnya", data)} disabled={m.loading} />
      </div>
      <div className="mt-4 flex justify-end">
        <TableButton icon="plus" onClick={m.submit} disabled={m.loading}>
          {m.loading ? "Menyimpan..." : "Simpan Data"}
        </TableButton>
      </div>
    </AppLayout>
  );
}
