export interface Konfirmasi {
  id: number;
  noKonfirmasi: string;
  tanggalKonfirmasi: string;
  tanggalPelatihan: string | null;
  metode: string;
  kepada: string | null;
  kodePelatihan: string | null;
  namaPeserta: string;
  jabatan: string | null;
  kontak: string | null;
  filePath: string | null;
  instansi: string | null;
  noIndukInstansi: string | null;
  noJadwal: string;
  pesertaTrainingId: number;
  dibuatOlehId: string;
  createdAt: string;
  updatedAt: string;
  jadwalTraining: {
    noJadwal: string;
    judulLengkap: string;
    judulPendek: string;
    kodePelatihan: string;
    metode: string;
    tglMulai: string | null;
    tglSelesai: string | null;
  };
  pesertaTraining: { id: number; nama: string; jabatan: string | null };
  dibuatOleh: { id: string; nama: string };
}

export interface KonfirmasiPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetListKonfirmasiResponse {
  data: Konfirmasi[];
  meta: KonfirmasiPagination;
}

export interface CreateKonfirmasiRequest {
  pesertaTrainingId: number;
  metode: string;
  tanggalPelatihan?: string;
  kepada?: string;
  namaPeserta?: string;
  jabatan?: string;
  kontak?: string;
  noIndukInstansi?: string;
  file?: File;
}

export type UpdateKonfirmasiRequest = Omit<
  CreateKonfirmasiRequest,
  "pesertaTrainingId"
>;
