"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateInstansiDaerah } from "@/hooks/use-create-instansi-daerah";

export function useCreateInstansiDaerahManage() {
  const router = useRouter();
  const formState = useCreateInstansiDaerah();
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
