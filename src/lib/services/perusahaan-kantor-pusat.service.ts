import { apiList, type ListParams } from "@/lib/api/client";
import type { PerusahaanKantorPusat } from "@/lib/types/perusahaan-kantor-pusat";

export const perusahaanKantorPusatService = {
  list: (params: ListParams) => apiList<PerusahaanKantorPusat>(
    "/api/database/perusahaan-kantor-pusat", params,
    "Gagal mengambil daftar perusahaan kantor pusat.",
  ),
};
