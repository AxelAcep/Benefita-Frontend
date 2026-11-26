"use client";

import { useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { karyawanCutiService, riwayatIzinService } from "@/lib/services/cuti.service";
import type { KaryawanCutiItem, RiwayatIzinItem } from "@/lib/types/cuti";

export function useRiwayatIzinManage() {
  const daftar = useResource<RiwayatIzinItem>(riwayatIzinService, { limit: 9 });
  const [selected, setSelected] = useState<RiwayatIzinItem | null>(null);
  return { ...daftar, selected, setSelected };
}

export function useKaryawanCutiManage() {
  return useResource<KaryawanCutiItem>(karyawanCutiService, { limit: 9 });
}
