"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import AppLayout from "@/components/app-layout";
import TableButton from "@/components/base/table-button";
import Notification from "@/components/base/notifications";

import CardInstansiDaerah from "../(form)/card-instansi-daerah";
import CardLokasiPemda from "../(form)/card-lokasi-pemda";
import CardKontak from "../(form)/card-kontak";
import CardInformasiInstansi from "../(form)/card-informasi-instansi";
import CardTraining from "../(form)/card-training";
import CardPrioritas from "../(form)/card-prioritas";

import { useCreateInstansiDaerah } from "@/hooks/use-create-instansi-daerah";

export default function TambahInstansiDaerahPage() {
  const router = useRouter();
  const { form, setSection, submit, loading, error } =
    useCreateInstansiDaerah();
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
        { label: "Instansi Daerah", href: "/database/instansi-daerah" },
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
        <CardInstansiDaerah
          initialData={form.instansiDaerah ?? {}}
          onChange={(data) => setSection("instansiDaerah", data)}
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
        <CardInformasiInstansi
          initialData={form.informasiInstansi ?? {}}
          onChange={(data) => setSection("informasiInstansi", data)}
          disabled={loading}
        />
        <CardTraining
          initialData={form.training ?? {}}
          onChange={(data) => setSection("training", data)}
          disabled={loading}
        />
        <CardPrioritas
          initialData={form.prioritas ?? {}}
          onChange={(data) => setSection("prioritas", data)}
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
