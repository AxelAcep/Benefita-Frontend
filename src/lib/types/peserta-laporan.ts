export type PesertaMode = "final" | "sertifikat-bnsp" | "permintaan-offline" | "bulanan" | "fix" | "cancle" |
  "rekap-ae" | "rekap-customer" | "rekap-tahunan" | "rekap-pelatihan" | "data-uji" | "data-uji-pelatihan";
export type PesertaRow = Record<string, string | number | null>;
export interface PesertaOpsi { tahun: number[]; kode: { kode: string; judulTraining: string }[] }
