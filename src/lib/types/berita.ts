/** Berita — pengumuman berperiode yang tampil di aplikasi. */

export type StatusBerita = "aktif" | "nonaktif";

export interface Berita {
  id: string;
  /** ISO date string dari backend. */
  periode: string;
  isi: string;
  /** Ditentukan backend dari periode, bukan diisi manual. */
  status: StatusBerita;
}

export interface CreateBeritaRequest {
  /** Format "YYYY-MM-DD" atau ISO string. */
  periode: string;
  isi: string;
}

export type UpdateBeritaRequest = Partial<CreateBeritaRequest>;

export function tanggalBerita(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
