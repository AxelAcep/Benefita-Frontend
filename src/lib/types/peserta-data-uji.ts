export interface PesertaUji {
  id: number;
  nama: string;
  perusahaan: string;
  kode: string;
  tglPel: string;
  invPeserta: "Belum Bayar" | "Lunas";
  tglUji: string;
  metode: "Offline" | "Online";
  lsp: string;
  invLSP: "Belum Bayar" | "Lunas";
  sertifikat: string | null;
  tglKirim: string | null;
  noResi: string | null;
  kiriman?: {
    penerima: string;
    hp: string;
    instansi: string;
    alamat: string;
    isiDokumen: string;
    noResi: string;
    kirimVia: string;
    tanggalKirim: string;
    diterimOleh: string;
    tanggalDiterima: string;
  };
}

export interface PengirimanDokumen {
  id: number;
  namaPenerima: string;
  perusahaan: string;
  alamat: string;
  noTelp: string;
  keteranganDokumen: string;
  noResi: string | null;
  tglKirim: string | null;
  kirimVia: string | null;
  diterimaOleh: string | null;
  tglDiterima: string | null;
  kiriman?: {
    penerima: string;
    hp: string;
    instansi: string;
    alamat: string;
    isiDokumen: string;
    noResi: string;
    kirimVia: string;
    tanggalKirim: string;
    diterimOleh: string;
    tanggalDiterima: string;
  };
}
