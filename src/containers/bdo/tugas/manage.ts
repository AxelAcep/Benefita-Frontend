"use client";

import { useMemo, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { tugasService } from "@/lib/services/bdo.service";
import type { CreateTugasRequest, Tugas, UpdateTugasRequest } from "@/lib/types/bdo";
import type { TugasFormValues } from "./form";

/**
 * Daftar Tugas. Penyaringan menurut pegawai yang login dikerjakan backend:
 * selain SUPER_ADMIN, seseorang hanya menerima tugas yang dia jadi PIC-nya
 * atau yang dilaporkan kepadanya.
 */
export function useTugasManage() {
  const resource = useResource<Tugas, string, CreateTugasRequest, UpdateTugasRequest>(
    tugasService,
    { limit: 10, pesanGagal: "Gagal mengambil data tugas." },
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tugas | null>(null);

  const formValues = useMemo<TugasFormValues | null>(() => {
    if (!editTarget) return null;

    return {
      status: editTarget.selesai ? "Selesai" : "Berjalan",
      picId: editTarget.picId ?? "",
      // Input type=date hanya menerima yyyy-mm-dd.
      dueDate: editTarget.dueDate ? editTarget.dueDate.slice(0, 10) : "",
      penerimaId: editTarget.penerimaId ?? "",
      kegiatan: editTarget.kegiatan,
    };
  }, [editTarget]);

  function openForm(row: Tugas | null) {
    setEditTarget(row);
    setModalOpen(true);
  }

  function closeForm() {
    setModalOpen(false);
    setEditTarget(null);
  }

  async function save(values: TugasFormValues) {
    const payload = {
      kegiatan: values.kegiatan,
      picId: values.picId || null,
      penerimaId: values.penerimaId || null,
      dueDate: values.dueDate || null,
      selesai: values.status === "Selesai",
    };

    if (editTarget) await resource.update?.(editTarget.id, payload);
    else await resource.create?.(payload);

    closeForm();
  }

  return { ...resource, modalOpen, formValues, openForm, closeForm, save, editTarget };
}
