export interface RekapDailyAE {
  nama: string;
  hari: Partial<Record<number, number>>;
}

export const BULAN_CONTOH = "2026-04";

export const DATA_CONTOH: RekapDailyAE[] = [
  {
    nama: "Aldy",
    hari: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 },
  },
  {
    nama: "Andi",
    hari: { 1: 11, 2: 11, 3: 11, 4: 11, 5: 11 },
  },
  {
    nama: "Ihsan",
    hari: { 1: 13, 2: 13, 3: 13, 4: 13, 5: 13 },
  },
  {
    nama: "Gempi",
    hari: { 1: 23, 2: 23, 3: 23, 4: 23, 5: 23 },
  },
  {
    nama: "Budi",
    hari: { 1: 8, 2: 9, 3: 8, 4: 10, 5: 7, 6: 9, 7: 8 },
  },
  {
    nama: "Siti",
    hari: { 3: 12, 4: 11, 5: 13, 8: 10, 9: 12 },
  },
  {
    nama: "Deni",
    hari: { 2: 15, 3: 14, 6: 16, 7: 15, 10: 14 },
  },
  {
    nama: "Rina",
    hari: { 1: 9, 5: 10, 6: 11, 11: 9, 12: 10 },
  },
];
