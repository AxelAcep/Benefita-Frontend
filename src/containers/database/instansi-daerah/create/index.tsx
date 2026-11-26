"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import TableButton from "@/components/base/table-button";
import CardInstansiDaerah from "@/app/database/instansi-daerah/(form)/card-instansi-daerah";
import CardLokasiPemda from "@/app/database/instansi-daerah/(form)/card-lokasi-pemda";
import CardKontak from "@/app/database/instansi-daerah/(form)/card-kontak";
import CardInformasiInstansi from "@/app/database/instansi-daerah/(form)/card-informasi-instansi";
import CardTraining from "@/app/database/instansi-daerah/(form)/card-training";
import CardPrioritas from "@/app/database/instansi-daerah/(form)/card-prioritas";
import { useCreateInstansiDaerahManage } from "./manage";

export default function CreateInstansiDaerahContainer() {
  const m = useCreateInstansiDaerahManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Instansi Daerah", href: "/database/instansi-daerah" },
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
        <CardInstansiDaerah initialData={m.form.instansiDaerah} onChange={(data) => m.setSection("instansiDaerah", data)} disabled={m.loading} />
        <CardLokasiPemda initialData={m.form.lokasi} onChange={(data) => m.setSection("lokasi", data)} disabled={m.loading} />
        <CardKontak initialData={m.form.kontak} onChange={(data) => m.setSection("kontak", data)} disabled={m.loading} />
        <CardInformasiInstansi initialData={m.form.informasiInstansi} onChange={(data) => m.setSection("informasiInstansi", data)} disabled={m.loading} />
        <CardTraining initialData={m.form.training} onChange={(data) => m.setSection("training", data)} disabled={m.loading} />
        <CardPrioritas initialData={m.form.prioritas} onChange={(data) => m.setSection("prioritas", data)} disabled={m.loading} />
      </div>
      <div className="mt-4 flex justify-end">
        <TableButton icon="plus" onClick={m.submit} disabled={m.loading}>
          {m.loading ? "Menyimpan..." : "Simpan Data"}
        </TableButton>
      </div>
    </AppLayout>
  );
}
