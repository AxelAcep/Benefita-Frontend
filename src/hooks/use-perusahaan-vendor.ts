import { useEffect, useState } from "react";
import { getPerusahaanVendorList } from "@/lib/services/perusahaan.service";
import type {
  PerusahaanVendorItem,
  PerusahaanVendorPagination,
} from "@/lib/types/perusahaan-vendor";

const PAGE_SIZE = 10;

export function usePerusahaanVendor(
  page: number,
  search: string,
) {
  const [data, setData] = useState<PerusahaanVendorItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanVendorPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(null);
    getPerusahaanVendorList({ page, limit: PAGE_SIZE, search })
      .then((result) => {
        if (batal) return;
        setData(result.data);
        setPagination(result.pagination);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [page, search]);

  return { data, pagination, loading, error };
}
