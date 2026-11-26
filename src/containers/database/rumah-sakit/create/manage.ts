"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePerusahaan } from "@/hooks/use-create-rumah-sakit";

export function useCreateRumahSakitManage() {
  const router = useRouter();
  const formState = useCreatePerusahaan();
  const [showSuccess, setShowSuccess] = useState(false);

  async function submit() {
    const ok = await formState.submit();
    if (ok) {
      setShowSuccess(true);
      setTimeout(() => router.push("/database"), 2000);
    }
  }

  return { ...formState, showSuccess, setShowSuccess, submit };
}
