"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useResource } from "@/hooks/use-resource";
import { daftarPengajuanService, konfirmasiPengajuan } from "@/lib/services/cuti.service";
import type { KonfirmasiRequest, PengajuanIzinListItem, RiwayatIzinItem } from "@/lib/types/cuti";

export function useListCutiManage() {
  const daftar = useResource<PengajuanIzinListItem>(daftarPengajuanService, { limit: 9 });
  const [selected, setSelected] = useState<RiwayatIzinItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function open(row: PengajuanIzinListItem) {
    setSelected({ ...row, alasanTolak: null, tanggalKonfirmasi: null });
  }

  function close() {
    if (!isProcessing) setSelected(null);
  }

  async function process(id: string, payload: KonfirmasiRequest) {
    if (isProcessing || selected?.id !== id) return;
    setIsProcessing(true);
    try {
      await konfirmasiPengajuan(id, payload);
      toast.success(payload.status === "DISETUJUI" ? "Pengajuan disetujui." : "Pengajuan ditolak.");
      setSelected(null);
      if (daftar.page > 1 && daftar.data.length === 1) {
        daftar.setPage(daftar.page - 1);
      } else {
        await daftar.refetch();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memproses pengajuan.");
    } finally {
      setIsProcessing(false);
    }
  }

  return { ...daftar, selected, isProcessing, open, close, process };
}
