export interface SertifikatPelatihan {
  id: number;
  noJadwal: string;
  nama: string;
  instansi: string | null;
  noSertifikat: string | null;
  noReg: string | null;
  ujian: string | null;
  updatedAt: string;
}

export interface RekapSertifikat {
  jadwal: {
    noJadwal: string;
    judulLengkap: string;
    kota: string;
    tglMulai: string | null;
    tglSelesai: string | null;
  };
  pelatihan: SertifikatPelatihan[];
  ujian: SertifikatPelatihan[];
}

export interface UpdateSertifikat {
  noSertifikat: string;
  noReg: string;
  updatedAt: string;
}
