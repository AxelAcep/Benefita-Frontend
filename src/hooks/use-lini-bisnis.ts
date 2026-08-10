import { useState, useEffect } from "react";
import {
  getLiniBisnis,
  LiniBisnisItem,
} from "@/lib/services/perusahaan.service";

export function useLiniBisnis() {
  const [data, setData] = useState<LiniBisnisItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getLiniBisnis()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
