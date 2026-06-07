"use client";

import { useState, useEffect } from "react";

import CardInstansiDaerah from "../(form)/card-instansi-daerah";
import CardLokasiPemda from "../(form)/card-lokasi-pemda";
import CardKontak from "../(form)/card-kontak";
import CardInformasiInstansi from "../(form)/card-informasi-instansi";
import CardTraining from "../(form)/card-training";
import CardPrioritas from "../(form)/card-prioritas";

import {
  ModalInstansiDaerah,
  ModalLokasiPemda,
  ModalKontak,
  ModalInformasiInstansi,
  ModalTraining,
  ModalPrioritas,
} from "../(form)/modal-edit";

import {
  useGetOneInstansiDaerah,
  useUpdateInstansiDaerah,
  type InstansiDaerahFormState,
} from "@/hooks/use-instansi-daerah-edit";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type EditingSection =
  | null
  | "instansiDaerah"
  | "lokasi"
  | "kontak"
  | "informasiInstansi"
  | "training"
  | "prioritas";

interface TabDetailInstansiDaerahProps {
  id: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function TabDetailInstansiDaerah({
  id,
  onSuccess,
  onError,
}: TabDetailInstansiDaerahProps) {
  const { data, isLoading, refetch } = useGetOneInstansiDaerah(id);
  const { mutate, isLoading: isSaving } = useUpdateInstansiDaerah();

  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [form, setForm] = useState<InstansiDaerahFormState | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
        Memuat detail instansi daerah...
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // SAVE HANDLER
  // ─────────────────────────────────────────────

  async function handleSaveSection<K extends Exclude<EditingSection, null>>(
    section: K,
    sectionData: InstansiDaerahFormState[K],
  ) {
    const merged = {
      ...form,
      [section]: sectionData,
    } as InstansiDaerahFormState;

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
        <CardInstansiDaerah
          initialData={form.instansiDaerah}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("instansiDaerah")}
        />
        <CardLokasiPemda
          initialData={form.lokasi}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("lokasi")}
        />
        <CardKontak
          initialData={form.kontak}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("kontak")}
        />
        <CardInformasiInstansi
          initialData={form.informasiInstansi}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("informasiInstansi")}
        />
        <CardTraining
          initialData={form.training}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("training")}
        />
        <CardPrioritas
          initialData={form.prioritas}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("prioritas")}
        />
      </div>

      {/* ─── Modals ─── */}
      {editingSection === "instansiDaerah" && (
        <ModalInstansiDaerah
          initialData={form.instansiDaerah}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("instansiDaerah", val)}
        />
      )}
      {editingSection === "lokasi" && (
        <ModalLokasiPemda
          initialData={form.lokasi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("lokasi", val)}
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
      {editingSection === "informasiInstansi" && (
        <ModalInformasiInstansi
          initialData={form.informasiInstansi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("informasiInstansi", val)}
        />
      )}
      {editingSection === "training" && (
        <ModalTraining
          initialData={form.training}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("training", val)}
        />
      )}
      {editingSection === "prioritas" && (
        <ModalPrioritas
          initialData={form.prioritas}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("prioritas", val)}
        />
      )}
    </>
  );
}
