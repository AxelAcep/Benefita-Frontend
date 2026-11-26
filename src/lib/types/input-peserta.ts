export interface PesertaTrainingListItem {
  id: number;
  nama: string;
  perusahaan: { noInduk: string; company: string | null };
  accExecutive: string | null;
  ownEnv: string | null;
  metode: string | null;
  status: string | null;
  ujian: string | null;
  konfirmasiOleh: string | null;
  konTgl: string | null;
  statusFinal: boolean;
  finalTgl: string | null;
  hargaTotal: number | null;
  diskon: number | null;
  ppn: number | null;
  bayar: number | null;
  cashback: number | null;
  sisa: number;
  infoPembayaran: string | null;
  catatan: string | null;
  tglInput: string;
  tglUpdate: string;
  pegawaiInput: { id: string; nama: string } | null;
  pegawaiUpdate: { id: string; nama: string } | null;
  pegawaiKonfirmasi: { id: string; nama: string } | null;
  pegawaiFinal: { id: string; nama: string } | null;
}

export interface PesertaTraining extends PesertaTrainingListItem {
  jabatan: string | null;
  alamat: string | null;
  noTelp: string | null;
  noFax: string | null;
  email: string | null;
  alamatPengirimanSertifikat: string | null;
  industri: string | null;
  noInvUjian: string | null;
  noKwtUjian: string | null;
  infoPenagihan: string | null;
  tglBayar: string | null;
  noInvoice: string | null;
  noKwitansi: string | null;
  fileBuktiPembayaran: string | null;
  filePendaftaran: string | null;
  jadwalTraining: {
    noJadwal: string;
    judulLengkap: string;
    judulPendek: string;
    metode: string;
    biaya: number;
    status: string;
    kodePelatihan: string;
    lokasiDetail: string | null;
    kota: string;
    tglMulai: string | null;
    tglSelesai: string | null;
    catatan: string | null;
  };
}

export interface JadwalSummary {
  noJadwal: string;
  metode: string;
  biaya: number;
  status: string;
  jenisTraining: string;
  kodePelatihan: string;
  lokasiDetail: string | null;
  judulLengkap: string;
  catatan: string | null;
  tglMulai: string | null;
  tglSelesai: string | null;
  kota: string;
  pesertaFixOffline: number;
  pesertaFixOnline: number;
}

export interface PesertaTrainingPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPesertaTrainingResponse {
  jadwal: JadwalSummary;
  data: PesertaTrainingListItem[];
  meta: PesertaTrainingPagination;
}

export interface CreatePesertaTrainingRequest {
  nama: string;
  jabatan?: string;
  alamat?: string;
  noTelp?: string;
  noFax?: string;
  email?: string;
  alamatPengirimanSertifikat?: string;
  catatan?: string;
  industri?: string;
  status?: string;
  ownEnv?: string;
  metode?: string;
  noIndukPerusahaan: string;
  accExecutive?: string;
  ujian?: string;
  noInvUjian?: string;
  noKwtUjian?: string;
  diskon?: number;
  ppn?: number;
  cashback?: number;
  hargaTotal?: number;
  bayar?: number;
  infoPembayaran?: string;
  infoPenagihan?: string;
  tglBayar?: string;
  noInvoice?: string;
  noKwitansi?: string;
  fileBuktiPembayaran?: File;
  filePendaftaran?: File;
}

export type UpdatePesertaTrainingRequest =
  Partial<CreatePesertaTrainingRequest> & {
    konfirmasiOleh?: string;
  };
