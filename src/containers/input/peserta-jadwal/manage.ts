"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useDaftarPesertaJadwal } from "@/hooks/use-daftar-peserta-jadwal";
import {
  createPesertaTraining, createPesertaUjiFromTraining, getPesertaTrainingById,
  updatePesertaTraining, updateStatusFinalPeserta,
} from "@/lib/services/input.service";
import type { PesertaTraining, PesertaTrainingListItem } from "@/lib/types/input-peserta";
import type { TambahPesertaFormData } from "./components/modal-tambah-peserta";
import { toForm, toRequest } from "./form-mapping";

function galat(error: unknown, fallback: string) {
  toast.error(error instanceof Error ? error.message : fallback);
}

export function usePesertaJadwalManage(noJadwal: string) {
  const list = useDaftarPesertaJadwal(noJadwal);
  const [modal, setModal] = useState<"tambah" | "edit" | null>(null);
  const [detail, setDetail] = useState<PesertaTraining | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pesertaUji, setPesertaUji] = useState<PesertaTrainingListItem | null>(null);
  const [registering, setRegistering] = useState(false);
  const request = useRef(0);
  const pendingFinal = useRef(new Set<number>());
  const initialForm = useMemo(() => detail ? toForm(detail) : undefined, [detail]);

  function resetForm(mode: "tambah" | null) {
    request.current += 1;
    setLoadingDetail(false);
    setDetail(null);
    setModal(mode);
  }

  async function edit(row: PesertaTrainingListItem) {
    const id = ++request.current;
    setLoadingDetail(true);
    setDetail(null);
    setModal("edit");
    try {
      const data = await getPesertaTrainingById(String(row.id));
      if (id !== request.current) return;
      if (data.jadwalTraining?.noJadwal !== noJadwal) throw new Error("Peserta tidak terdaftar pada jadwal ini.");
      setDetail(data);
    } catch (err) {
      if (id === request.current) {
        setModal(null);
        galat(err, "Gagal memuat detail peserta.");
      }
    } finally {
      if (id === request.current) setLoadingDetail(false);
    }
  }

  async function save(form: TambahPesertaFormData) {
    if (!modal || saving || (modal === "edit" && !detail)) return;
    if (!form.nama.trim() || !form.noIndukPerusahaan.trim()) {
      toast.error("Nama dan perusahaan peserta wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = toRequest(form);
      if (detail) await updatePesertaTraining(String(detail.id), payload);
      else await createPesertaTraining(noJadwal, payload);
      toast.success(detail ? "Data peserta diperbarui." : "Peserta ditambahkan.");
      resetForm(null);
      list.refetch();
    } catch (err) {
      galat(err, "Gagal menyimpan peserta.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleFinal(row: PesertaTrainingListItem) {
    if (pendingFinal.current.has(row.id)) return;
    pendingFinal.current.add(row.id);
    const statusFinal = !row.statusFinal;
    try {
      await updateStatusFinalPeserta(String(row.id), statusFinal);
      toast.success(statusFinal ? "Peserta ditandai Final." : "Status Final dibatalkan.");
      list.refetch();
    } catch (err) {
      galat(err, "Gagal mengubah status Final.");
    } finally {
      pendingFinal.current.delete(row.id);
    }
  }

  async function daftarUji(skemaId: number) {
    if (!pesertaUji || registering) return;
    setRegistering(true);
    try {
      await createPesertaUjiFromTraining(String(pesertaUji.id), skemaId);
      setPesertaUji(null);
      toast.success("Peserta didaftarkan ke uji kompetensi.");
      list.refetch();
    } catch (err) {
      galat(err, "Gagal mendaftarkan peserta ke uji kompetensi.");
    } finally {
      setRegistering(false);
    }
  }

  return {
    list, modal, detail, initialForm, loadingDetail, saving, pesertaUji, setPesertaUji,
    registering, edit, save, toggleFinal, daftarUji,
    add: () => resetForm("tambah"),
    close: () => { if (!saving) resetForm(null); },
  };
}
