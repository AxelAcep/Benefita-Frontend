"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateSekolah } from "@/hooks/use-create-sekolah";

export function useCreateSekolahManage() {
  const router = useRouter();
  const formState = useCreateSekolah();
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
