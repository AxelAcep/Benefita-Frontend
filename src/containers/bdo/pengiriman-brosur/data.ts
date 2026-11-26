export interface PengirimanBrosur {
  acc: string;
  nama: string;
  jabatan: string;
  perusahaan: string;
  followUp: string | null;
}

// Data contoh sampai sumber data pengiriman POS tersedia.

export const DATA_CONTOH: PengirimanBrosur[] = [
  {
    acc: "EE",
    nama: "Muamal Rasyid",
    jabatan: "Traning",
    perusahaan: "PT. ABC",
    followUp: "sudah terima brosurnya (tes daily)",
  },
  {
    acc: "RQ",
    nama: "Yayat Hidayat",
    jabatan: "K3",
    perusahaan: "PT. BCA",
    followUp: null,
  },
  {
    acc: "EE",
    nama: "Toni Purba",
    jabatan: "Sistem Manajemen Supervisor",
    perusahaan: "PT. XYZ",
    followUp: null,
  },
  {
    acc: "EE",
    nama: "Imamsyah Roesil",
    jabatan: "Projek Officer",
    perusahaan: "PT. ACC",
    followUp: null,
  },
  {
    acc: "SL",
    nama: "Budi Santoso",
    jabatan: "HSE Manager",
    perusahaan: "PT. Maju Jaya",
    followUp: "brosur diterima, menunggu konfirmasi",
  },
  {
    acc: "NW",
    nama: "Siti Rahayu",
    jabatan: "Procurement Staff",
    perusahaan: "PT. Nusantara Energy",
    followUp: null,
  },
  {
    acc: "TA",
    nama: "Deni Kurniawan",
    jabatan: "QA Supervisor",
    perusahaan: "PT. Sinar Mas",
    followUp: "sudah terima, akan follow up minggu depan",
  },
  {
    acc: "CF",
    nama: "Rina Wulandari",
    jabatan: "Safety Officer",
    perusahaan: "PT. Tambang Raya",
    followUp: null,
  },
];
