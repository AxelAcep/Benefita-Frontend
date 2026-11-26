/** Tempat Uji Kompetensi — master data lokasi pelaksanaan uji sertifikasi. */
export interface TUK {
  id: number;
  noSK: string;
  noPenetapan: string | null;
  tglSanggup: string | null;
  nama: string;
  alamat: string;
  telp: string | null;
  updateOleh: string | null;
  pegawai: { id: string; nama: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTUKRequest {
  noSK: string;
  noPenetapan?: string;
  tglSanggup?: string;
  nama: string;
  alamat: string;
  telp?: string;
}

export type UpdateTUKRequest = Partial<CreateTUKRequest>;
