export type PermissionAction = "create" | "read" | "update" | "delete";

export type ModulePermission = Record<PermissionAction, boolean>;

// Modul berasal dari backend; jangan dipaku agar modul baru ikut terbaca.
export type MyPermissions = Partial<Record<string, ModulePermission>>;
