type RowType =
  | "section-header"
  | "group-header"
  | "item"
  | "subtotal"
  | "total";

export interface LabaRugiRow {
  id: string;
  type: RowType;
  deskripsi: string;
  komersial: string;
  koreksiFiskal: string;
  laporanKeuanganFiskal: string;
}

export const labaRugiData: LabaRugiRow[] = [
  // PENDAPATAN
  {
    id: "pendapatan",
    type: "item",
    deskripsi: "PENDAPATAN",
    komersial: "Rp2.000.900.000",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },

  // HARGA POKOK PENJUALAN
  {
    id: "hpp-header",
    type: "section-header",
    deskripsi: "HARGA POKOK PENJUALAN",
    komersial: "",
    koreksiFiskal: "",
    laporanKeuanganFiskal: "",
  },

  // Biaya Tenaga Kerja Langsung
  {
    id: "btkl-header",
    type: "group-header",
    deskripsi: "Biaya Tenaga Kerja Langsung",
    komersial: "",
    koreksiFiskal: "",
    laporanKeuanganFiskal: "",
  },
  {
    id: "upah-imbalan",
    type: "item",
    deskripsi: "Upah & Imbalan Lainnya",
    komersial: "Rp117.900.376",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },

  // Biaya Subkont & Jasa Lainnya
  {
    id: "bsjl-header",
    type: "group-header",
    deskripsi: "Biaya Subkont & Jasa Lainnya",
    komersial: "",
    koreksiFiskal: "",
    laporanKeuanganFiskal: "",
  },
  {
    id: "biaya-jasa-ujian",
    type: "item",
    deskripsi: "Biaya Jasa Ujian/Sertifikasi",
    komersial: "Rp387.860.000",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },

  // Biaya Umum Meeting & Pelatihan
  {
    id: "bump-header",
    type: "group-header",
    deskripsi: "Biaya Umum Meeting & Pelatihan",
    komersial: "",
    koreksiFiskal: "",
    laporanKeuanganFiskal: "",
  },
  {
    id: "biaya-paket-meeting",
    type: "item",
    deskripsi: "Biaya Paket Meeting Hotel",
    komersial: "Rp133.707.760",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },
  {
    id: "biaya-kunjungan",
    type: "item",
    deskripsi: "Biaya Kunjungan/Survey/Perjalanan Dinas",
    komersial: "Rp10.150.000",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },
  {
    id: "biaya-lunch",
    type: "item",
    deskripsi: "Biaya Lunch & Snack",
    komersial: "Rp12.045.697",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },
  {
    id: "biaya-perlengkapan",
    type: "item",
    deskripsi: "Biaya Perlengkapan",
    komersial: "0",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },
  {
    id: "biaya-souvenir",
    type: "item",
    deskripsi: "Biaya Souvenir",
    komersial: "Rp21.000.000",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },
  {
    id: "biaya-hotel",
    type: "item",
    deskripsi: "Biaya Hotel dan Akomodasi",
    komersial: "Rp6.222.705",
    koreksiFiskal: "-",
    laporanKeuanganFiskal: "-",
  },

  // Subtotal HPP
  {
    id: "total-hpp",
    type: "subtotal",
    deskripsi: "Total Harga Pokok Penjualan",
    komersial: "Rp688.886.538",
    koreksiFiskal: "",
    laporanKeuanganFiskal: "",
  },

  // LABA RUGI KOTOR
  {
    id: "laba-kotor",
    type: "total",
    deskripsi: "LABA (RUGI) KOTOR",
    komersial: "Rp1.311.213.462",
    koreksiFiskal: "",
    laporanKeuanganFiskal: "",
  },
];

// ─── Row Renderer ─────────────────────────────────────────────────────────────
