"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import TableButton from "@/components/base/table-button";
import CardPerusahaan from "@/app/database/pemda/(form)/card-perusahaan";
import CardLokasiPemda from "@/app/database/pemda/(form)/card-lokasi-pemda";
import CardKontak from "@/app/database/pemda/(form)/card-kontak";
import CardInformasiDaerah from "@/app/database/pemda/(form)/card-informasi-daerah";
import CardBidangKedinasan from "@/app/database/pemda/(form)/card-bidang-kedinasan";
import { useCreatePemdaManage } from "./manage";

export default function CreatePemdaContainer() {
  const m = useCreatePemdaManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Pemda", href: "/database/pemda" },
        { label: "Tambah" },
      ]}
    >
      {m.showSuccess && (
        <Notification
          message="Data berhasil disimpan!"
          type="success"
          onClose={() => m.setShowSuccess(false)}
        />
      )}
      {m.error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
          {m.error}
        </div>
      )}
      <div className="space-y-4">
        <CardPerusahaan initialData={m.form.perusahaan} onChange={(data) => m.setSection("perusahaan", data)} disabled={m.loading} />
        <CardLokasiPemda initialData={m.form.lokasi} onChange={(data) => m.setSection("lokasi", data)} disabled={m.loading} />
        <CardKontak initialData={m.form.kontak} onChange={(data) => m.setSection("kontak", data)} disabled={m.loading} />
        <CardInformasiDaerah initialData={m.form.informasiDaerah} onChange={(data) => m.setSection("informasiDaerah", data)} disabled={m.loading} />
        <CardBidangKedinasan initialData={m.form.bidangKedinasan} onChange={(data) => m.setSection("bidangKedinasan", data)} disabled={m.loading} />
      </div>
      <div className="mt-4 flex justify-end">
        <TableButton icon="plus" onClick={m.submit} disabled={m.loading}>
          {m.loading ? "Menyimpan..." : "Simpan Data"}
        </TableButton>
      </div>
    </AppLayout>
  );
}
