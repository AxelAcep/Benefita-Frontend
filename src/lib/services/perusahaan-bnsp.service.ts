import { apiList, type ListParams } from "@/lib/api/client";
import type { PerusahaanBNSP } from "@/lib/types/perusahaan-bnsp";

export const perusahaanBnspService = {
  list: (params: ListParams) => apiList<PerusahaanBNSP>(
    "/api/database/perusahaan-bnsp", params,
    "Gagal mengambil daftar perusahaan bersertifikat BNSP.",
  ),
};
