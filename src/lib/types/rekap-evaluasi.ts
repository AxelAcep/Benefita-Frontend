export interface RekapEvaluasiResponse {
  jadwal: {
    judulLengkap: string;
    tglMulai: string | null;
    tglSelesai: string | null;
  };
  totalPeserta: number;
  totalMengisi: number;
  rataRata: {
    nilaiSistematikaMateri: number;
    nilaiTampilanSlide: number;
    nilaiAlokasiWaktu: number;
    nilaiPenerapanMateri: number;
    nilaiPeningkatanKompetensi: number;
    nilaiTrainer: number;
  };
  komentarManfaatPeserta: string[];
  komentarManfaatPerusahaan: string[];
}
