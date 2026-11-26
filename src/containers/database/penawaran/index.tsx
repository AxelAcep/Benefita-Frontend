"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/app-layout";
import CreatePenawaran from "./components/create-penawaran";
import ListPenawaran from "./components/list-penawaran";
import ModalEditPenawaran from "./components/modal-edit-penawaran";
import { usePenawaranManage } from "./manage";

const ENTITAS = {
  perusahaan: "Perusahaan",
  "rumah-sakit": "Rumah Sakit",
  pemda: "Pemda",
  "instansi-daerah": "Instansi Daerah",
  sekolah: "Sekolah",
};

export default function PenawaranContainer({ slug }: { slug: keyof typeof ENTITAS }) {
  const { id } = useParams<{ id: string }>();
  return <PenawaranInstansi key={id} id={id} slug={slug} />;
}

function PenawaranInstansi({ id, slug }: { id: string; slug: keyof typeof ENTITAS }) {
  const m = usePenawaranManage();
  const href = `/database/${slug}/${encodeURIComponent(id)}`;

  return (
    <AppLayout breadcrumbs={[
      { label: "Database", href: "/database" },
      { label: ENTITAS[slug], href: "/database" },
      { label: id, href },
      { label: "Penawaran" },
    ]}>
      <div className="space-y-4">
        <Link href={href} className="inline-block text-sm font-medium text-emerald-700 hover:underline">
          ← Kembali ke Detail
        </Link>
        <CreatePenawaran loading={m.loading} onCreate={m.create} />
        <ListPenawaran
          data={m.filtered}
          loading={m.loading}
          error={m.error}
          search={m.search}
          onSearch={m.setSearch}
          onEdit={m.setEditTarget}
          onDelete={m.remove}
          onUpload={m.uploadFile}
          onRetry={m.refetch}
        />
        {m.editTarget && (
          <ModalEditPenawaran
            key={m.editTarget.id}
            penawaran={m.editTarget}
            loading={m.loading}
            onClose={() => m.setEditTarget(null)}
            onSave={m.save}
          />
        )}
      </div>
    </AppLayout>
  );
}
