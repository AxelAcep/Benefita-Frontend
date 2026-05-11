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
      await updateHakAksesKaryawan(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memperbarui hak akses.");
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error, success };
}
