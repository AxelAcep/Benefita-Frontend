import { apiList, type ListParams } from "@/lib/api/client";
import type { PegawaiLoginItem } from "@/lib/types/pegawai-login";

export const pegawaiLoginService = {
  list: (params: ListParams) =>
    apiList<PegawaiLoginItem>("/api/user/pegawai-login", params, "Gagal mengambil daftar login."),
};
