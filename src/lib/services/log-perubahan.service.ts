import { apiList, type ListParams } from "@/lib/api/client";
import type { LogPerubahanItem } from "@/lib/types/log-perubahan";

export const logPerubahanService = {
  list: (params: ListParams) =>
    apiList<LogPerubahanItem>("/api/database/perubahan-summary", params, "Gagal mengambil log perubahan."),
};
