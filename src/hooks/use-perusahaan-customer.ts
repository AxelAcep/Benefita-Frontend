import { useEffect, useState } from "react";
import { getPerusahaanCustomerList } from "@/lib/services/perusahaan.service";
import type {
  PerusahaanCustomerItem,
  PerusahaanCustomerPagination,
} from "@/lib/types/perusahaan-customer";

const PAGE_SIZE = 10;

export function usePerusahaanCustomer(
  page: number,
  search: string,
  tahun: number | "",
) {
  const [data, setData] = useState<PerusahaanCustomerItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanCustomerPagination>({
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
    getPerusahaanCustomerList({ page, limit: PAGE_SIZE, search, tahun })
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
  }, [page, search, tahun]);

  return { data, pagination, loading, error };
}
