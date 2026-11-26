import { apiGetResponse } from "@/lib/api/client";
import type { ProperListResponse } from "@/lib/types/proper-ringkasan";

export type {
  PeringkatCounts,
  ProperListResponse,
  ProperProvinsiData,
} from "@/lib/types/proper-ringkasan";

export function getProperList(tahun: number): Promise<ProperListResponse> {
  return apiGetResponse<ProperListResponse>(
    "/api/database/proper-list",
    { tahun },
    "Gagal mengambil data proper",
  );
}
