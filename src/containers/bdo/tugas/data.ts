/**
 * Status penyelesaian tugas, dipetakan ke kolom boolean `selesai`.
 *
 * Sebelumnya berisi "Tugas" / "Tugas dan Pelaporan" / "Pelaporan". Tiga
 * nilai itu tidak ada di data mana pun: tabReminder hanya menyimpan
 * "Close" atau kosong. Label jenis tugas sekarang diturunkan dari ada
 * tidaknya penerima laporan, lihat jenisTugas di @/lib/types/bdo.
 */
export const STATUS_TUGAS = ["Berjalan", "Selesai"] as const;

export type StatusTugas = (typeof STATUS_TUGAS)[number];
