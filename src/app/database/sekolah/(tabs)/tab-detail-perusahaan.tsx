"use client";

import { useState, useEffect } from "react";

import CardInstansiSekolah from "../(form)/card-instansi-sekolah";
import CardKontak from "../(form)/card-kontak";
import CardLokasiSekolah from "../(form)/card-lokasi-sekolah";
import CardKlasifikasi from "../(form)/card-klasifikasi";
import CardInformasiSekolahDetail from "../(form)/card-infromasi-sekolah-detail";

import {
  ModalInstansiSekolah,
  ModalLokasiSekolah,
  ModalKontak,
  ModalKlasifikasi,
  ModalInformasiSekolahDetail,
} from "../(form)/modal-edit";

import {
  useGetOneSekolah,
  useUpdateSekolah,
  type SekolahFormState,
} from "@/hooks/use-sekolah-edit";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type EditingSection =
  | null
  | "instansiSekolah"
  | "kontak"
  | "lokasi"
  | "klasifikasi"
  | "informasiSekolahDetail";

interface TabDetailSekolahProps {
  id: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function TabDetailSekolah({
  id,
  onSuccess,
  onError,
}: TabDetailSekolahProps) {
  const { data, isLoading, refetch } = useGetOneSekolah(id);
  const { mutate, isLoading: isSaving } = useUpdateSekolah();

  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [form, setForm] = useState<SekolahFormState | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
        Memuat detail sekolah...
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // SAVE HANDLER
  // ─────────────────────────────────────────────

  async function handleSaveSection(
    section: Exclude<EditingSection, null>,
    sectionData: SekolahFormState[Exclude<EditingSection, null>],
  ) {
    const merged = {
      ...form,
      [section]: sectionData,
    } as unknown as SekolahFormState;

    await mutate(id, merged, {
      onSuccess: () => {
        setEditingSection(null);
        setForm(merged);
        refetch();
        onSuccess();
      },
      onError,
    });
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <>
      <div className="space-y-4">
        <CardInstansiSekolah
          initialData={form.instansiSekolah}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("instansiSekolah")}
        />
        <CardKontak
          initialData={form.kontak}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("kontak")}
        />
        <CardLokasiSekolah
          initialData={form.lokasi}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("lokasi")}
        />

        {/* ── Informasi Sekolah + Klasifikasi (row) ── */}

        <CardKlasifikasi
          initialData={form.klasifikasi}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("klasifikasi")}
        />

        <CardInformasiSekolahDetail
          initialData={form.informasiSekolahDetail}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("informasiSekolahDetail")}
        />
      </div>

      {/* ─── Modals ─── */}
      {editingSection === "instansiSekolah" && (
        <ModalInstansiSekolah
          initialData={form.instansiSekolah}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("instansiSekolah", val)}
        />
      )}
      {editingSection === "kontak" && (
        <ModalKontak
          initialData={form.kontak}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("kontak", val)}
        />
      )}
      {editingSection === "lokasi" && (
        <ModalLokasiSekolah
          initialData={form.lokasi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("lokasi", val)}
        />
      )}
      {editingSection === "klasifikasi" && (
        <ModalKlasifikasi
          initialData={form.klasifikasi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("klasifikasi", val)}
        />
      )}
      {editingSection === "informasiSekolahDetail" && (
        <ModalInformasiSekolahDetail
          initialData={form.informasiSekolahDetail}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("informasiSekolahDetail", val)}
        />
      )}
    </>
  );
}
