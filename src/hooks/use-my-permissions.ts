"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMyPermissions } from "@/lib/services/permission.service";
import type { MyPermissions } from "@/lib/types/permission";

// Bukan daftar CRUD: endpoint mengembalikan peta modul, bukan useResource.
export function useMyPermissions() {
  const [permissions, setPermissions] = useState<MyPermissions>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setPermissions({});
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyPermissions();
      if (id === requestId.current) setPermissions(data);
    } catch (err) {
      if (id === requestId.current) {
        setError(err instanceof Error ? err.message : "Gagal mengambil hak akses.");
      }
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
    return () => { requestId.current += 1; };
  }, [reload]);

  return { permissions, isLoading, error, reload };
}
