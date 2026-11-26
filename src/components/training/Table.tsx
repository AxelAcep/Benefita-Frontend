/**
 * Pindah ke @/components/base/data-table — dipakai 8 halaman lintas modul,
 * bukan cuma modul training.
 *
 * File ini hanya meneruskan ekspor supaya halaman lama tidak ikut rusak.
 * Hapus kalau semua pemakai sudah menunjuk ke path baru.
 */
export { DataTable } from "@/components/base/data-table";
export type { ColumnDef } from "@/components/base/data-table";
