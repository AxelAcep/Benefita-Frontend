export interface PesertaUjiPelatihan {
  id: number;
  inPer: string;
  nama: string;
  perusahaan: string;
  noTelp: string;
  email: string;
  acc: string;
  tglPelatihan: string;
  tglUji: string | null;
  stt: "Pel & Ujian" | "Refresh & Ujian";
}
