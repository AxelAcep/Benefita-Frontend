"use client";

/**
 * Penjaga satu modul. Dipasang di layout tiap modul, jadi seluruh halaman
 * di bawahnya menuntut izin `read` modul itu.
 *
 * Ini penjagaan tampilan, bukan keamanan: yang benar-benar menahan adalah
 * middleware authorize() di backend. Gunanya supaya pengguna tidak melihat
 * halaman yang datanya akan ditolak server.
 */
import type { ReactNode } from "react";
import AppLayout from "@/components/app-layout";
import { usePermission } from "@/context/PermissionContext";
import { useCan } from "@/hooks/use-can";
import type { PermissionAction } from "@/lib/types/permission";

export interface ModuleAccessProps {
  modul: string;
  /** Label untuk breadcrumb dan pesan. Default memakai nama modul. */
  label?: string;
  aksi?: PermissionAction;
  children: ReactNode;
}

export function ModuleAccess({
  modul,
  label,
  aksi = "read",
  children,
}: ModuleAccessProps) {
  const { isLoading, error, reload } = usePermission();
  const boleh = useCan(modul, aksi);

  if (boleh) return children;

  const nama = label ?? modul;

  return (
    <AppLayout breadcrumbs={[{ label: nama }]}>
      <div
        role={isLoading ? "status" : "alert"}
        className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700"
      >
        <p>
          {isLoading
            ? `Memuat hak akses ${nama}...`
            : error ||
              `Anda tidak memiliki izin untuk membuka bagian ${nama}.`}
        </p>
        {error && (
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
          >
            Coba lagi
          </button>
        )}
      </div>
    </AppLayout>
  );
}

export default ModuleAccess;
