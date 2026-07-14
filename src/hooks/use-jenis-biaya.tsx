// hooks/useJenisBiaya.ts
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/services/login.service";

export function useJenisBiaya() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/accounting/jenis-biaya`,
          {
            method: "GET",
          },
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
