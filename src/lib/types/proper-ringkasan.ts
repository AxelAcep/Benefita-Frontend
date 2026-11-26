export interface PeringkatCounts {
  EMAS: number;
  HIJAU: number;
  BIRU: number;
  MERAH: number;
  HITAM: number;
  DITUNDA: number;
  MASALAH: number;
  TUTUP: number;
  DITANGGUHKAN: number;
  MERAH_MUDA: number;
}

export interface ProperProvinsiData {
  id: string;
  provinsi: string;
  peringkat: PeringkatCounts;
  total: number;
}

export interface ProperListResponse {
  tahun: number;
  data: ProperProvinsiData[];
  total: number; // total keseluruhan semua provinsi
}
