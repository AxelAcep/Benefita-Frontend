"use client";

import { useEffect, useState } from "react";
import { getUserDetail, type UserDetail } from "@/lib/services/login.service";

export function useUserDetail(userId: string | undefined) {
  const [request, setRequest] = useState(0);
  const [result, setResult] = useState<{
    userId: string;
    request: number;
    data: UserDetail | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getUserDetail(userId).then(
      (data) => {
        if (active) setResult({ userId, request, data, error: null });
      },
      (err: unknown) => {
        if (active) setResult({
          userId,
          request,
          data: null,
          error: err instanceof Error ? err.message : "Gagal mengambil profil.",
        });
      },
    );
    return () => { active = false; };
  }, [userId, request]);

  const current = result && result.userId === userId && result.request === request ? result : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: Boolean(userId && !current),
    retry: () => setRequest((previous) => previous + 1),
  };
}
