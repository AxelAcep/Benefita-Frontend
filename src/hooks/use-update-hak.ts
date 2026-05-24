import { useState } from "react";
import {
  updateHakAksesKaryawan,
  UpdateHakAksesPayload,
} from "@/lib/services/perusahaan.service";

export function useUpdateHakAkses() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function update(payload: UpdateHakAksesPayload) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateHakAksesKaryawan(payload);
      setSuccess(true);
      return response; // Kembalikan response jika perlu
    } catch (err: any) {
      // Ambil pesan error detail dari backend jika ada
      const message =
        err.response?.data?.message || err.message || "Terjadi kesalahan";

      setError(message);

      // KRUSIAL: Lempar error-nya keluar supaya catch di UI terpancing
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error, success };
}
