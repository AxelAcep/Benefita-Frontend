import { apiGet, apiPut } from "@/lib/api/client";
import type {
  MyPermissions,
  PermissionRow,
} from "@/lib/types/permission";

export const getMyPermissions = (): Promise<MyPermissions> =>
  apiGet<MyPermissions>(
    "/api/permission/me",
    undefined,
    "Gagal mengambil hak akses.",
  );

/**
 * Seluruh matriks izin. Hanya SUPER_ADMIN yang diizinkan backend.
 *
 * Daftar role diambil terpisah lewat role.service, bukan dari meta
 * respons ini: apiGet membuka pembungkus `data`, jadi `meta` tidak ikut
 * terbawa — dan daftar role memang lebih berguna lengkap dengan
 * jumlah penggunanya.
 */
export const getPermissionMatrix = (): Promise<PermissionRow[]> =>
  apiGet<PermissionRow[]>(
    "/api/permission",
    undefined,
    "Gagal mengambil matriks hak akses.",
  );

export const savePermissionMatrix = (
  items: Pick<PermissionRow, "role" | "modul" | "create" | "read" | "update" | "delete">[],
): Promise<{ message: string; tersimpan: number }> =>
  apiPut<{ message: string; tersimpan: number }>(
    "/api/permission",
    { items },
    "Gagal menyimpan hak akses.",
  );
