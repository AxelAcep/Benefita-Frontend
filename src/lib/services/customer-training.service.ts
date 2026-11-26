/**
 * Service rekap kebutuhan training per perusahaan.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 */
import { apiList } from "@/lib/api/client";
import type { CustomerTraining } from "@/lib/types/customer-training";
import type { ListParams, ListResult } from "@/lib/api/client";

export type { CustomerTraining };

const BASE = "/api/training/customer";

export const getCustomerTraining = (
  params: ListParams = {},
): Promise<ListResult<CustomerTraining>> =>
  apiList<CustomerTraining>(
    BASE,
    params,
    "Gagal mengambil data kebutuhan training",
  );

/** Hanya daftar; endpoint ini memang tidak punya create, update, atau delete. */
export const customerTrainingService = { list: getCustomerTraining };
