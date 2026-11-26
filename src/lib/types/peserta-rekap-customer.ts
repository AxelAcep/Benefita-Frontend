export interface RekapCustomer {
  id: number;
  noInduk: string;
  perusahaan: string;
  total: number;
  reg: number;
  inh: number;
  env: string;
  csr: string;
  tsm: string;
  epm: string;
  tahunPelatihan: string;
  proper: string | null;
  lineBisnis: string | null;
}
