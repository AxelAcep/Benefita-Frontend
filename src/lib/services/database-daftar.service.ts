import { apiGetResponse, type ListParams } from "@/lib/api/client";
import type { GetPerusahaanParams, GetPerusahaanResponse } from "@/lib/types/database-daftar";

interface DaftarResponse {
  data: { noInduk: string; company: string | null; alamat: string | null; telp?: string | null }[];
  pagination: { total: number; totalPages: number; currentPage: number; pageSize: number };
}

export async function getPerusahaan(params: GetPerusahaanParams = {}): Promise<GetPerusahaanResponse> {
  const { data, pagination } = await apiGetResponse<DaftarResponse>(
    "/api/database/perusahaan", { ...params }, "Gagal mengambil data perusahaan.",
  );
  return {
    data: data.map((item) => ({
      id: item.noInduk,
      nama: item.company,
      alamatPusat: item.alamat,
      noTelp: item.telp ?? null,
    })),
    meta: {
      total: pagination.total,
      totalPages: pagination.totalPages,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    },
  };
}

export const databaseDaftarService = {
  async list({ page, limit, search, jenisInstansi }: ListParams) {
    const { data, meta } = await getPerusahaan({
      page, pageSize: limit, search,
      jenisInstansi: typeof jenisInstansi === "string" ? jenisInstansi : undefined,
    });
    return { data, total: meta.total, totalPages: meta.totalPages, page: meta.page, limit: meta.pageSize };
  },
};
