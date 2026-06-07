"use client";

import { useState, useEffect } from "react";

import CardPerusahaan from "../(form)/card-perusahaan";
import CardLokasiPemda from "../(form)/card-lokasi-pemda";
import CardKontak from "../(form)/card-kontak";
import CardInformasiDaerah from "../(form)/card-informasi-daerah";
import CardBidangKedinasan from "../(form)/card-bidang-kedinasan";
import CardStatistikProper from "../(form)/card-proper";

import {
  ModalPerusahaan,
  ModalLokasiPemda,
  ModalKontak,
  ModalInformasiDaerah,
  ModalBidangKedinasan,
  ModalStatistikProper,
} from "../(form)/modal-edit";

import {
  useGetOnePemda,
  useUpdatePemda,
  type PemdaFormState,
} from "@/hooks/use-pemda-edit";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type EditingSection =
  | null
  | "perusahaan"
  | "lokasi"
  | "kontak"
  | "informasiDaerah"
  | "bidangKedinasan"
  | "statistikProper";

interface TabDetailPemdaProps {
  id: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function TabDetailPemda({
  id,
  onSuccess,
  onError,
}: TabDetailPemdaProps) {
  const { data, isLoading, refetch } = useGetOnePemda(id);
  const { mutate, isLoading: isSaving } = useUpdatePemda();

  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [form, setForm] = useState<PemdaFormState | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
        Memuat detail PEMDA...
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // SAVE HANDLER
  // ─────────────────────────────────────────────

  async function handleSaveSection<K extends Exclude<EditingSection, null>>(
    section: K,
    sectionData: PemdaFormState[K],
  ) {
    const merged = { ...form, [section]: sectionData } as PemdaFormState;

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
        <CardPerusahaan
          initialData={form.perusahaan}
          onChange={() => {}}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("perusahaan")}
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
        <CardInformasiDaerah
          initialData={form.informasiDaerah}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("informasiDaerah")}
        />
        <CardBidangKedinasan
          initialData={form.bidangKedinasan}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("bidangKedinasan")}
        />
        <CardStatistikProper
          initialData={form.statistikProper}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("statistikProper")}
        />
      </div>

      {/* ─── Modals ─── */}
      {editingSection === "perusahaan" && (
        <ModalPerusahaan
          initialData={form.perusahaan}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("perusahaan", val)}
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
      {editingSection === "informasiDaerah" && (
        <ModalInformasiDaerah
          initialData={form.informasiDaerah}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("informasiDaerah", val)}
        />
      )}
      {editingSection === "bidangKedinasan" && (
        <ModalBidangKedinasan
          initialData={form.bidangKedinasan}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("bidangKedinasan", val)}
        />
      )}
      {editingSection === "statistikProper" && (
        <ModalStatistikProper
          initialData={form.statistikProper}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("statistikProper", val)}
        />
      )}
    </>
  );
}
