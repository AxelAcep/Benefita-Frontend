import { notFound } from "next/navigation";

/**
 * Halaman ini ditutup atas permintaan pemilik repositori. Entrinya sudah
 * dibuang dari sidebar; notFound() menutup juga jalur URL langsung.
 *
 * Containernya sengaja tidak dihapus, tinggal mengembalikan baris render
 * di bawah kalau nanti dibuka lagi:
 *
 *   import PerusahaanProper2kaliBiruContainer from "@/containers/perusahaan/proper-2kali-biru";
 *   return <PerusahaanProper2kaliBiruContainer />;
 */
export default function Page() {
  notFound();
}
