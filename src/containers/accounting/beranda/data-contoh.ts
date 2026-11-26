export const DUMMY_DATA = {
  totalPeserta: { value: 75, subtitle: "Semua Jenis" },
  pesertaReguler: { value: 12, subtitle: "28 Kode" },
  pesertaInHouse: { value: 63, subtitle: "4 Kode" },
  totalPendapatan: { value: 51750000, subtitle: "Semua Jenis" },
  pesertaPerKelompok: [
    { kode: "CSR", reguler: 2, inhouse: 0 },
    { kode: "EM", reguler: 1, inhouse: 10 },
    { kode: "ENG", reguler: 3, inhouse: 1 },
    { kode: "EP", reguler: 1, inhouse: 0 },
    { kode: "HAZ", reguler: 0, inhouse: 5 },
    { kode: "MM", reguler: 0, inhouse: 1 },
  ],
  pendapatanPerKelompok: [
    { kode: "CSR", reguler: 5000000, inhouse: 0 },
    { kode: "EM", reguler: 1000000, inhouse: 10000000 },
    { kode: "ENG", reguler: 5000000, inhouse: 5000000 },
    { kode: "EP", reguler: 1000000, inhouse: 0 },
    { kode: "HAZ", reguler: 0, inhouse: 5000000 },
    { kode: "MM", reguler: 0, inhouse: 16000000 },
  ],
  perbandinganRegulerInhouse: [
    { label: "Reguler", peserta: 7, pendapatan: 12000000 },
    { label: "In House", peserta: 3, pendapatan: 16000000 },
  ],
};

export const BULAN_OPTIONS = [
  { value: "", label: "Semua Bulan" },
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

// TODO: ganti dengan fetch dari API
export const DUMMY_KODE_OPTIONS = [
  { value: "CSR", label: "CSR" },
  { value: "EM", label: "EM" },
  { value: "ENG", label: "ENG" },
  { value: "EP", label: "EP" },
  { value: "HAZ", label: "HAZ" },
  { value: "MM", label: "MM" },
];

export const DUMMY_DATA_NERACA = {
  totalPemasukan: { value: 820204745, subtitle: "5 transaksi masuk" },
  totalPengeluaran: { value: 611949659, subtitle: "55 transaksi keluar" },
  saldoBersih: { value: 208255086, subtitle: "25,4% dari total pemasukan" },
  arusKasHarian: [
    { tanggal: "1", pemasukan: 300000000, pengeluaran: 150000000 },
    { tanggal: "2", pemasukan: 200000000, pengeluaran: 400000000 },
    { tanggal: "3", pemasukan: 100000000, pengeluaran: 200000000 },
    { tanggal: "4", pemasukan: 450000000, pengeluaran: 100000000 },
    { tanggal: "5", pemasukan: 600000000, pengeluaran: 350000000 },
    { tanggal: "6", pemasukan: 350000000, pengeluaran: 500000000 },
    { tanggal: "7", pemasukan: 250000000, pengeluaran: 300000000 },
    { tanggal: "8", pemasukan: 150000000, pengeluaran: 200000000 },
    { tanggal: "9", pemasukan: 400000000, pengeluaran: 100000000 },
    { tanggal: "10", pemasukan: 300000000, pengeluaran: 450000000 },
  ],
  top5Pengeluaran: [
    {
      label: "Hotel IBIS Cikarang",
      value: 12567000,
      type: "pengeluaran" as const,
    },
    {
      label: "Ujian PPPU & POIPPU",
      value: 34231333,
      type: "pemasukan" as const,
    },
    {
      label: "Ujian PLB3 & OPLB3",
      value: 23563312,
      type: "pengeluaran" as const,
    },
    { label: "THR Maret 2026", value: 7563312, type: "pemasukan" as const },
    { label: "Gaji Maret 2026", value: 12567000, type: "pengeluaran" as const },
  ],
  distribusiPengeluaran: [
    { label: "Gaji & THR", persentase: 78.2, nilai: 478324522 },
    { label: "Pelatihan & ujian", persentase: 11.2, nilai: 68538361 },
    { label: "Pajak & BPJS", persentase: 11.6, nilai: 71086776 },
  ],
};

export const DUMMY_DATA_LHU = {
  realisasiPendapatan: { value: 75350000, subtitle: "" },
  realisasiBiaya: { value: 0, subtitle: "" },
  programDenganRealisasi: { value: 4, subtitle: "" },
  realisasiPerProgram: [
    {
      label: "HAZ-17 Operator LB3",
      value: 5000000,
      type: "pemasukan" as const,
    },
    {
      label: "FP-21 Workshop SIMPTT",
      value: 10000000,
      type: "pemasukan" as const,
    },
    {
      label: "WM-05 Pelatihan Air",
      value: 8000000,
      type: "pemasukan" as const,
    },
    {
      label: "FP-14 Workshop LCA",
      value: 3000000,
      type: "pengeluaran" as const,
    },
  ],
  distribusiPerProgram: [
    { label: "HAZ — Pelatihan LB3", persentase: 80, nilai: 20800000 },
    { label: "FP — Workshop", persentase: 8, nilai: 2000000 },
    { label: "WM — Pelatihan Air", persentase: 12, nilai: 3120000 },
  ],
};

export const DUMMY_DATA_LABARUGI = {
  pendapatan: { value: 2073700000, subtitle: "" },
  totalBiaya: { value: 2613279377, subtitle: "" },
  labaOperasional: { value: -539579377, subtitle: "" },
  arusKas: [
    { label: "Pendapatan", value: 2073700000 },
    { label: "Pendapatan", value: 1500000000 },
    { label: "Laba Kotor", value: -800000000 },
    { label: "Biaya Ops", value: -1200000000 },
    { label: "Rugi Ops", value: -539579377 },
  ],
  komposisiHpp: [
    { label: "Jasa ujian & sertifikasi", persentase: 59.6, nilai: 444817200 },
    { label: "Meeting & akomodasi", persentase: 24.6, nilai: 183462000 },
    { label: "Upah langsung", persentase: 15.8, nilai: 117821000 },
  ],
  komposisiBiayaOps: [
    { label: "Jasa & pemasaran", persentase: 33.8, nilai: 250000000 },
    { label: "Transport", persentase: 20.3, nilai: 150000000 },
    { label: "Pajak & asuransi", persentase: 45.9, nilai: 340000000 },
  ],
};
