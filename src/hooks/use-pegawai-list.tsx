import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/services/login.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Pegawai {
  id: string;
  nama: string;
  nip: string | null;
}

export function usePegawai(search?: string) {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        const url = `${API_URL}/api/accounting/pegawai${params.toString() ? `?${params}` : ""}`;
        const res = await fetchWithAuth(url, { method: "GET" });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json.message || "Gagal mengambil data pegawai");
        setData(json.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Gagal mengambil data pegawai"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPegawai();
  }, [search]);

  return { data, loading, error };
}
