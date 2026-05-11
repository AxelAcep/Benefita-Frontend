import { useState, useEffect } from "react";
import {
  getPegawaiMarketingSales,
  PegawaiDropdownItem,
} from "@/lib/services/login.service";

export function useDropdownSales() {
  const [data, setData] = useState<PegawaiDropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPegawaiMarketingSales()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
