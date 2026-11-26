export interface RekapPelatihan {
  id: number;
  kode: string;
  judul: string;
  data: {
    [year: number]: {
      rencana: number | null;
      running: number | null;
      cancel: number | null;
      peserta: number | null;
      rataRataPeserta: number | null;
    };
  };
}
