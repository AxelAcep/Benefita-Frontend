"use client";

import { useAuth } from "@/context/AuthContext";
import { useCreatePengajuan } from "@/hooks/use-cuti";
import { useUserDetail } from "@/hooks/use-user-detail";
import type { CreatePengajuanRequest } from "@/lib/types/cuti";
import { toast } from "sonner";

export function useFormCutiManage() {
  const { user } = useAuth();
  const profil = useUserDetail(user?.id);
  const { mutate } = useCreatePengajuan();

  async function kirim(values: Omit<CreatePengajuanRequest, "pegawaiId">) {
    const pegawaiId = profil.data?.pegawaiId;
    if (!pegawaiId) return false;

    try {
      await mutate({ ...values, pegawaiId });
      toast.success("Pengajuan berhasil dikirim.");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim pengajuan.");
      return false;
    }
  }

  return { profil, kirim };
}
