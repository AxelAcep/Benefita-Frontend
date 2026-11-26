"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePemda } from "@/hooks/use-create-pemda";

export function useCreatePemdaManage() {
  const router = useRouter();
  const formState = useCreatePemda();
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
