"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRekapSertifikat } from "@/hooks/use-rekap-sertifikat";
import { updateSertifikat } from "@/lib/services/rekap-sertifikat.service";
import type { SertifikatPelatihan } from "@/lib/types/rekap-sertifikat";
import type { SertifikatFormValues } from "./form";

export function useRekapSertifikatManage(noJadwal: string) {
  const resource = useRekapSertifikat(noJadwal);
  const [selected, setSelected] = useState<SertifikatPelatihan | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function edit(row: SertifikatPelatihan) {
    setSaveError(null);
    setSelected(row);
  }
  function close() {
    if (!saving) setSelected(null);
  }
  async function save(values: SertifikatFormValues) {
    if (!selected || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateSertifikat(noJadwal, selected.id, { ...values, updatedAt: selected.updatedAt });
      setSelected(null);
      resource.refetch();
      toast.success("Nomor sertifikat berhasil diperbarui.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Gagal memperbarui sertifikat.");
    } finally {
      setSaving(false);
    }
  }
  return { ...resource, selected, saving, saveError, edit, close, save };
}
