export interface AkunPerusahaan {
  noInduk: string;
  perusahaan: string;
  jenisInstansi: string;
  waktu: string | null;
  action: string | null;
  accEnv: string | null;
  diKontakTerakhirEnv: string | null;
  enviro: number | null;
  accCsr: string | null;
  diKontakTerakhirCsr: string | null;
  csr: number | null;
  accTsm: string | null;
  diKontakTerakhirTsm: string | null;
  tsm: number | null;
  accEpm: string | null;
  diKontakTerakhirEpm: string | null;
  epm: number | null;
  hp: string | null;
}

export interface PengirimanBrosur {
  id: string;
  noInduk: string;
  jenisInstansi: string;
  acc: string | null;
  nama: string;
  jabatan: string;
  perusahaan: string;
  followUp: string | null;
  tanggalKirim: string | null;
}

export const JAM = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17"] as const;
export interface RekapAktivitas {
  id: string;
  nama: string;
  jam: Record<string, number>;
  diLuarJam: number;
}
export interface RekapDailyAE {
  id: string;
  nama: string;
  hari: Partial<Record<number, number>>;
}
