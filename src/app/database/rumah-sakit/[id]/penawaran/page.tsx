"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AppLayout from "@/components/app-layout";
import { usePenawaran } from "@/hooks/use-perusahaan";
import CreatePenawaran from "./create-penawaran";
import ListPenawaran from "./list-penawaran";
import ModalEditPenawaran from "./modal-edit-penawaran";
import type { Penawaran } from "@/lib/services/perusahaan.service";

export default function PenawaranPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, refetch, create, update, remove, uploadFile } =
    usePenawaran();

  const [editTarget, setEditTarget] = useState<Penawaran | null>(null);
  const [search, setSearch] = useState("");

  const filtered = data.filter((p) =>
    p.kodePelatihan.some((k) => k.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Database", href: "/database" },
        { label: "Instansi/Perusahaan", href: "/database/instansi-perusahaan" },
        { label: id, href: `/database/perusahaan/${id}` },
        { label: "Penawaran" },
      ]}
      subtitle="Hari ini: Senin, 11 Mei 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          ← Kembali
        </button>

        <CreatePenawaran loading={loading} onCreate={create} />

        <ListPenawaran
          data={filtered}
          loading={loading}
          error={error}
          search={search}
          onSearch={setSearch}
          onEdit={setEditTarget}
          onDelete={remove}
          onUpload={uploadFile}
          onRetry={refetch}
        />

        {editTarget && (
          <ModalEditPenawaran
            penawaran={editTarget}
            loading={loading}
            onClose={() => setEditTarget(null)}
            onSave={async (payload) => {
              await update(editTarget.id, payload);
              setEditTarget(null);
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
