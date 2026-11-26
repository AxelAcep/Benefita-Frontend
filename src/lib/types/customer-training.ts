/** Rekap kebutuhan training per perusahaan. */

export type BidangAkun = "env" | "csr" | "tsm" | "epm";

export const BIDANG_AKUN: BidangAkun[] = ["env", "csr", "tsm", "epm"];

/**
 * Entri akun terbaru dari kolom riwayat di backend.
 *
 * Kolom acc, accCsr, accTsm, dan accEpm menyimpan riwayat dipisah titik
 * koma dengan entri terbaru di depan, berbentuk <dua huruf><yymmdd>.
 * Backend hanya mengirim entri terbarunya.
 */
export interface EntriAkun {
  kode: string;
  /** Format yymmdd apa adanya dari data lama; bisa null. */
  tanggal: string | null;
  mentah: string;
}

export interface CustomerTraining {
  jenisInstansi: string;
  kebutuhanTrainingMentah: string | null;
  noInduk: string;
  perusahaan: string | null;
  totalPeserta: number;
  pesertaInhouse: number;
  akun: Record<BidangAkun, EntriAkun | null>;
  kontakTerakhir: Record<BidangAkun, string | null>;
  lineOfBusiness: string | null;
  liniBisnis: { id: number; nama: string } | null;
  kebutuhanTraining: string[];
}

/** Tanggal yymmdd dari data lama jadi teks yang bisa dibaca. */
export function tanggalAkun(yymmdd: string | null): string | null {
  if (!yymmdd || yymmdd.length !== 6) return null;

  const th = Number(yymmdd.slice(0, 2));
  const bl = Number(yymmdd.slice(2, 4));
  const tg = Number(yymmdd.slice(4, 6));
  if (!bl || bl > 12 || !tg || tg > 31) return null;

  // Data lama memakai dua digit tahun. Diasumsikan tahun 2000-an, karena
  // seluruh isi tabel ini berasal dari era itu.
  const d = new Date(2000 + th, bl - 1, tg);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}
