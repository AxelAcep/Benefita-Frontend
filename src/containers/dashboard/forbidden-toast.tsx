"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Pisah komponen kecil buat useSearchParams (wajib dibungkus Suspense di Next.js)
export function ForbiddenToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("forbidden") === "1") {
      toast.error("🚫 Anda tidak memiliki akses ke halaman tersebut.", {
        description: "Hubungi administrator jika Anda merasa ini keliru.",
        duration: 4000,
      });
      // Bersihkan query param dari URL tanpa reload
      const url = new URL(window.location.href);
      url.searchParams.delete("forbidden");
      window.history.replaceState(null, "", url);
    }
  }, [searchParams]);

  return null;
}
