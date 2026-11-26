export interface PerusahaanTargetItem {
  noInduk: string;
  perusahaanInstansi: string;
  totalPeserta: number;
  akunENV: string;
  akunCSR: string;
  akunTSM: string;
  akunEPM: string;
  alamat: string;
  noTelp: string;
}

export const DATA_CONTOH: PerusahaanTargetItem[] = [
  {
    noInduk: "PR00001",
    perusahaanInstansi: "PT ABC",
    totalPeserta: 2,
    akunENV: "SL",
    akunCSR: "SL",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat:
      "Perkantoran Hijau Arkadia Menara F Lt. 8 Jl. TB Simatupang Kav. 88 Jakarta Selatan 12520",
    noTelp:
      "021-2997 4000; 52034011(HO); 021-8834 6059-60;88021799 - 021 8834660701",
  },
  {
    noInduk: "PR00002",
    perusahaanInstansi: "PT BCAA",
    totalPeserta: 0,
    akunENV: "SL",
    akunCSR: "SL",
    akunTSM: "FIX",
    akunEPM: "-",
    alamat:
      "Jl. Jawa 1 Blok J-11 Kawasan Industri MM2100 Cikarang Barat Kab. Bekasi - Jabar 17520",
    noTelp: "021-89812731; 0343-613700",
  },
  {
    noInduk: "PR00003",
    perusahaanInstansi: "PT ABCCC",
    totalPeserta: 0,
    akunENV: "SL",
    akunCSR: "SL",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat: "Jl. Margomulyo No. 44 Kav. E 1-2 Tandos Surabaya - Jatim 60183",
    noTelp: "(021) 28645455; (021) 28645455; (021) 25515555 HO",
  },
  {
    noInduk: "PR00004",
    perusahaanInstansi: "PT BCASD",
    totalPeserta: 0,
    akunENV: "NW",
    akunCSR: "SL",
    akunTSM: "Cancel",
    akunEPM: "R&U",
    alamat: "Jl. Gajah Tunggal km. 1.0 Tangerang - Banten 15135",
    noTelp: "0271-7891410; 0271-7089238",
  },
  {
    noInduk: "PR00005",
    perusahaanInstansi: "PT DEFGH",
    totalPeserta: 1,
    akunENV: "SL",
    akunCSR: "NW",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat:
      "Jl. Industri Raya No. 5 Kawasan Industri Pulogadung Jakarta Timur 13920",
    noTelp: "021-4602345; 021-4602346",
  },
  {
    noInduk: "PR00006",
    perusahaanInstansi: "PT IJKLM",
    totalPeserta: 3,
    akunENV: "FIX",
    akunCSR: "SL",
    akunTSM: "SL",
    akunEPM: "-",
    alamat: "Kawasan Industri KIIC Lot DD-1 Karawang Barat - Jawa Barat 41361",
    noTelp: "0267-8610234",
  },
  {
    noInduk: "PR00007",
    perusahaanInstansi: "PT NOPQR",
    totalPeserta: 0,
    akunENV: "SL",
    akunCSR: "Cancel",
    akunTSM: "FIX",
    akunEPM: "R&U",
    alamat: "Jl. Raya Bogor Km 31 Cimanggis Depok - Jawa Barat 16953",
    noTelp: "021-8710345",
  },
];
