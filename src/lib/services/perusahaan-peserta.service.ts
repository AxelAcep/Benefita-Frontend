import { apiList, type ListParams } from "@/lib/api/client";
import type { PesertaLengkapPerusahaan } from "@/lib/types/perusahaan-peserta";

export const perusahaanPesertaService = {
  list({ noInduk, ...params }: ListParams) {
    if (typeof noInduk !== "string" || !noInduk) throw new Error("Nomor induk perusahaan tidak ditemukan.");
    return apiList<PesertaLengkapPerusahaan>(
      `/api/database/perusahaan/${encodeURIComponent(noInduk)}/peserta-lengkap`,
      params,
      "Gagal mengambil peserta perusahaan.",
    );
  },
};
