"use client";

import { useState } from "react";
import { usePenawaran } from "@/hooks/use-perusahaan";
import type { Penawaran } from "@/lib/services/perusahaan.service";

export function usePenawaranManage() {
  const resource = usePenawaran();
  const [editTarget, setEditTarget] = useState<Penawaran | null>(null);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = resource.data.filter((item) =>
    item.kodePelatihan.some((code) => code.toLowerCase().includes(query)),
  );

  async function save(payload: { kodePelatihan?: string[]; file?: File }) {
    if (!editTarget) return;
    await resource.update(editTarget.id, payload);
    setEditTarget(null);
  }

  return { ...resource, editTarget, setEditTarget, search, setSearch, filtered, save };
}
