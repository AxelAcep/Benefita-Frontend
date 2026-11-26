export type PermissionAction = "create" | "read" | "update" | "delete";

export type ModulePermission = Record<PermissionAction, boolean>;

// Modul berasal dari backend; jangan dipaku agar modul baru ikut terbaca.
export type MyPermissions = Partial<Record<string, ModulePermission>>;

export const AKSI: PermissionAction[] = ["create", "read", "update", "delete"];

export const LABEL_AKSI: Record<PermissionAction, string> = {
  create: "Tambah",
  read: "Lihat",
  update: "Ubah",
  delete: "Hapus",
};

/** Satu baris matriks: kombinasi role dan modul beserta empat izinnya. */
export interface PermissionRow extends ModulePermission {
  id: string;
  role: string;
  modul: string;
}

export interface Role {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string | null;
  /** Role bawaan sistem tidak bisa dihapus. */
  bawaan: boolean;
  jumlahPengguna: number;
}

export interface CreateRoleRequest {
  kode: string;
  nama: string;
  deskripsi?: string;
}

export interface UpdateRoleRequest {
  nama?: string;
  deskripsi?: string | null;
}

/** Kunci peta matriks di layar. */
export const kunciIzin = (role: string, modul: string) => `${role}::${modul}`;
