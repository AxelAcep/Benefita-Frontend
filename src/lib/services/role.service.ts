/**
 * Service Role.
 *
 * Role dulunya enum di backend, sekarang tabel — jadi daftarnya harus
 * dibaca, tidak boleh dipaku di frontend.
 */
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "@/lib/types/permission";

export type { CreateRoleRequest, Role, UpdateRoleRequest };

const BASE = "/api/role";

export const getRoleList = (): Promise<Role[]> =>
  apiGet<Role[]>(BASE, undefined, "Gagal mengambil daftar role");

export const createRole = (payload: CreateRoleRequest): Promise<Role> =>
  apiPost<Role>(BASE, payload, "Gagal membuat role");

/** `kode` tidak bisa diubah; hanya nama dan deskripsi. */
export const updateRole = (
  kode: string,
  payload: UpdateRoleRequest,
): Promise<Role> =>
  apiPut<Role>(`${BASE}/${kode}`, payload, "Gagal mengubah role");

export const deleteRole = (kode: string): Promise<void> =>
  apiDelete(`${BASE}/${kode}`, "Gagal menghapus role");
