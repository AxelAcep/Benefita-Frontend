export const STATUS_TUGAS = ["Tugas", "Tugas dan Pelaporan", "Pelaporan"] as const;

export interface TugasPelaporan {
  id: number;
  tanggal: string;
  kegiatan: string;
  pic: string;
  dueDate: string | null;
  penerimaLaporan: string | null;
  status: (typeof STATUS_TUGAS)[number];
}

export const DATA_CONTOH: TugasPelaporan[] = [
  {
    id: 1,
    tanggal: "2026-04-02",
    kegiatan: "Follow up perusahaan PT. ABC",
    pic: "Muamal Rasyid",
    dueDate: "2026-04-06",
    penerimaLaporan: null,
    status: "Tugas",
  },
  {
    id: 2,
    tanggal: "2026-04-01",
    kegiatan: "Menghubungi PT. ABC",
    pic: "Yayat Hidayat",
    dueDate: "2026-04-06",
    penerimaLaporan: "Axel",
    status: "Tugas dan Pelaporan",
  },
  {
    id: 3,
    tanggal: "2026-04-01",
    kegiatan: "Kunjungan",
    pic: "Toni Purba",
    dueDate: "2026-04-06",
    penerimaLaporan: "Axel",
    status: "Tugas dan Pelaporan",
  },
  {
    id: 4,
    tanggal: "2026-04-01",
    kegiatan: "Kunjungan",
    pic: "Imamsyah Roesli",
    dueDate: "2026-04-06",
    penerimaLaporan: null,
    status: "Tugas",
  },
  {
    id: 5,
    tanggal: "2026-03-31",
    kegiatan: "Follow up kontrak baru",
    pic: "Aldy",
    dueDate: "2026-04-07",
    penerimaLaporan: "Nanang",
    status: "Pelaporan",
  },
  {
    id: 6,
    tanggal: "2026-03-30",
    kegiatan: "Presentasi proposal training",
    pic: "Andi",
    dueDate: "2026-04-05",
    penerimaLaporan: null,
    status: "Tugas",
  },
  {
    id: 7,
    tanggal: "2026-03-29",
    kegiatan: "Koordinasi internal tim ENV",
    pic: "Ihsan",
    dueDate: "2026-04-04",
    penerimaLaporan: "Axel",
    status: "Tugas dan Pelaporan",
  },
  {
    id: 8,
    tanggal: "2026-03-28",
    kegiatan: "Kirim dokumen ke PT. Tambang Raya",
    pic: "Gempi",
    dueDate: "2026-04-03",
    penerimaLaporan: "Nanang",
    status: "Tugas dan Pelaporan",
  },
];
