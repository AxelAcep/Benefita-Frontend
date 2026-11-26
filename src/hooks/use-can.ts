"use client";

import { usePermission } from "@/context/PermissionContext";
import type { PermissionAction } from "@/lib/types/permission";

/** Izin UI mengikuti tabel backend, termasuk untuk SUPER_ADMIN. */
export function useCan(modul: string, aksi: PermissionAction): boolean {
  const { permissions, isLoading, error } = usePermission();
  return !isLoading && !error && permissions[modul]?.[aksi] === true;
}
