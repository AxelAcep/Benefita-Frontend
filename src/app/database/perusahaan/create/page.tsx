"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppLayout from "@/components/app-layout";
import TableButton from "@/components/base/table-button";
import Notification from "@/components/base/notifications";
import CardPerusahaan from "../(form)/card-perusahaan";
import CardLokasi from "../(form)/card-lokasi";
import CardSertifikasi from "../(form)/card-sertifikasi";
import CardKlasifikasi from "../(form)/card-klasifikasi";
import CardPropertiFinansial from "../(form)/card-properti";
import CardInformasiLainnya from "../(form)/card-lainya";
import CardKontak from "../(form)/card-kontak";
import { useCreatePerusahaan } from "@/hooks/use-create-perusahaan";

export default function TambahInstansiPerusahaanPage() {
  const router = useRouter();
  const { form, setSection, submit, loading, error } = useCreatePerusahaan();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit() {
    const ok = await submit();
    if (ok) {
      setShowSuccess(true); // Show success notification
      setTimeout(() => {
        router.push("/database"); // Redirect after notification
      }, 3000); // Wait for 3 seconds before redirecting
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Instansi/Perusahaan", href: "/database/instansi-perusahaan" },
        { label: "Tambah" },
      ]}
      subtitle="Hari ini: Sabtu, 9 Mei 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      {/* Success Notification */}
      {showSuccess && (
        <Notification
          message="Data berhasil disimpan!"
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Row 1 — full width */}
        <CardPerusahaan
          initialData={form.perusahaan ?? {}}
          onChange={(data) => setSection("perusahaan", data)}
          disabled={loading}
        />

        {/* Row 2 — full width */}
        <CardLokasi
          initialData={form.lokasi ?? {}}
          onChange={(data) => setSection("lokasi", data)}
          disabled={loading}
        />

        <CardKontak
          initialData={form.kontak ?? {}}
          onChange={(data) => setSection("kontak", data)}
          disabled={loading}
        />

        {/* Row 3 — 2 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSertifikasi
            initialData={form.sertifikasi ?? {}}
            onChange={(data) => setSection("sertifikasi", data)}
            disabled={loading}
          />
          <CardKlasifikasi
            initialData={form.klasifikasi ?? {}}
            onChange={(data) => setSection("klasifikasi", data)}
            disabled={loading}
          />
        </div>

        {/* Row 4 — full width */}
        <CardPropertiFinansial
          initialData={form.propertiFinansial ?? {}}
          onChange={(data) => setSection("propertiFinansial", data)}
          disabled={loading}
        />

        {/* Row 5 — full width */}
        <CardInformasiLainnya
          initialData={form.informasiLainnya ?? {}}
          onChange={(data) => setSection("informasiLainnya", data)}
          disabled={loading}
        />
      </div>

      {/* Toolbar */}
      <div className="flex justify-end mb-4 mt-4">
        <TableButton icon="plus" onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Data"}
        </TableButton>
      </div>
    </AppLayout>
  );
}
