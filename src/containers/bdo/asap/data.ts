export interface DaftarASAP {
  perusahaan: string;
  asap: string;
  akun: string;
  kategori: string;
}

// Data contoh sampai sumber data ASAP tersedia.

export const DATA_CONTOH: DaftarASAP[] = [
  {
    perusahaan: "PT. ABC",
    asap: "Kontak lagi fahlul",
    akun: "Aldy",
    kategori: "ENV",
  },
  {
    perusahaan: "PT. BCA",
    asap: "Kontak lagi operator",
    akun: "Aldy",
    kategori: "ENV",
  },
  {
    perusahaan: "PT. XYZ",
    asap: "Kontak lagi Hesti",
    akun: "Aldy",
    kategori: "ENV",
  },
  {
    perusahaan: "PT. ACC",
    asap: "Kontak lagi Adam",
    akun: "Gempi",
    kategori: "ENV",
  },
  {
    perusahaan: "PT. Maju Jaya",
    asap: "Follow up proposal",
    akun: "Andi",
    kategori: "CSR",
  },
  {
    perusahaan: "PT. Nusantara Energy",
    asap: "Kirim jadwal training",
    akun: "Ihsan",
    kategori: "TSM",
  },
  {
    perusahaan: "PT. Sinar Mas",
    asap: "Konfirmasi kehadiran peserta",
    akun: "Gempi",
    kategori: "ENV",
  },
  {
    perusahaan: "PT. Tambang Raya",
    asap: "Tindak lanjut kontrak",
    akun: "Aldy",
    kategori: "EPM",
  },
];
