"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import AppLayout from "@/components/app-layout";
import TableButton from "@/components/base/table-button";
import Notification from "@/components/base/notifications";

import CardPerusahaan from "../(form)/card-perusahaan";
import CardLokasiPemda from "../(form)/card-lokasi-pemda";
import CardKontak from "../(form)/card-kontak";
import CardInformasiDaerah from "../(form)/card-informasi-daerah";
import CardBidangKedinasan from "../(form)/card-bidang-kedinasan";

import { useCreatePemda } from "@/hooks/use-create-pemda";

export default function TambahPemdaPage() {
  const router = useRouter();
  const { form, setSection, submit, loading, error } = useCreatePemda();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit() {
    const ok = await submit();
    if (ok) {
      setShowSuccess(true);
      setTimeout(() => router.push("/database"), 2000);
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Pemda", href: "/database/pemda" },
        { label: "Tambah" },
      ]}
      subtitle="Hari ini: Sabtu, 9 Mei 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      {showSuccess && (
        <Notification
          message="Data berhasil disimpan!"
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <CardPerusahaan
          initialData={form.perusahaan ?? {}}
          onChange={(data) => setSection("perusahaan", data)}
          disabled={loading}
        />
        <CardLokasiPemda
          initialData={form.lokasi ?? {}}
          onChange={(data) => setSection("lokasi", data)}
          disabled={loading}
        />
        <CardKontak
          initialData={form.kontak ?? {}}
          onChange={(data) => setSection("kontak", data)}
          disabled={loading}
        />
        <CardInformasiDaerah
          initialData={form.informasiDaerah ?? {}}
          onChange={(data) => setSection("informasiDaerah", data)}
          disabled={loading}
        />
        <CardBidangKedinasan
          initialData={form.bidangKedinasan ?? {}}
          onChange={(data) => setSection("bidangKedinasan", data)}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end mt-4">
        <TableButton icon="plus" onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Data"}
        </TableButton>
      </div>
    </AppLayout>
  );
}
