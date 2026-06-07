"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import AppLayout from "@/components/app-layout";
import TableButton from "@/components/base/table-button";
import Notification from "@/components/base/notifications";

import CardInstansiSekolah from "../(form)/card-instansi-sekolah";
import CardKontak from "../(form)/card-kontak";
import CardLokasiSekolah from "../(form)/card-lokasi-sekolah";
import CardKlasifikasi from "../(form)/card-klasifikasi";
import CardInformasiSekolahDetail from "../(form)/card-infromasi-sekolah-detail";

import { useCreateSekolah } from "@/hooks/use-create-sekolah";

export default function TambahSekolahPage() {
  const router = useRouter();
  const { form, setSection, submit, loading, error } = useCreateSekolah();
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
        { label: "Sekolah", href: "/database/sekolah" },
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
        <CardInstansiSekolah
          initialData={form.instansiSekolah ?? {}}
          onChange={(data) => setSection("instansiSekolah", data)}
          disabled={loading}
        />
        <CardKontak
          initialData={form.kontak ?? {}}
          onChange={(data) => setSection("kontak", data)}
          disabled={loading}
        />
        <CardLokasiSekolah
          initialData={form.lokasi ?? {}}
          onChange={(data) => setSection("lokasi", data)}
          disabled={loading}
        />

        {/* ── Informasi Sekolah + Klasifikasi (row) ── */}
        <CardKlasifikasi
          initialData={form.klasifikasi ?? {}}
          onChange={(data) => setSection("klasifikasi", data)}
          disabled={loading}
        />

        <CardInformasiSekolahDetail
          initialData={form.informasiSekolahDetail ?? {}}
          onChange={(data) => setSection("informasiSekolahDetail", data)}
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
