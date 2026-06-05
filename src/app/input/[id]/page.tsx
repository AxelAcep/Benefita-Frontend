"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/app-layout";

import CardDetailKegiatan, {
  type DetailKegiatanFormData,
} from "./card-detail-kegiatan";
import CardDaftarMenu from "./card-daftar-menu";
import TableListPeserta, { type Peserta } from "./table-list-peserta";
import ModalTambahPeserta, {
  type TambahPesertaFormData,
} from "./modal-tambah-peserta";
import PageKonfirmasi from "./konfirmasi/[idPeserta]/page";
import PageKwitansi from "./kwitansi/[idPeserta]/page";
import PageInvoice from "./invoice/[idPeserta]/page";
import { useParams, useRouter } from "next/navigation";

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────

const INITIAL_DETAIL: DetailKegiatanFormData = {
  noJadwal: "2026274",
  kode: "EM-05",
  tanggalMulai: "02 Apr 2026",
  tanggalSelesai: "02 Apr 2026",
  metode: "Offline",
  lokasi: "LSP Benefita",
  kota: "Bandung",
  biayaOnline: "Online : 5,900,000",
  biayaOffline: "Offline : 7,900,000",
  biayaSertifikasi: "Sertifikasi: 4,600,000",
  judul: "Penanggung Jawab Pengendalian Pencemaran Udara (PPPU)",
  pesertaFIXOnline: "0",
  pesertaFIXOffline: "0",
  catatan: "",
  statusJadwal: "UJI_Running",
};

const INITIAL_PESERTA: Peserta[] = [
  {
    id: 1,
    nama: "Muhammad Habibie Musy",
    perusahaan: "PT ABC",
    noTelp: "-",
    ae: "SL",
    ovEnv: "SL",
    status: "FIX",
    statusUji: "R&U",
    form: "Ada",
    konf: "-",
    biaya: "Rp5.900.000",
    diskon: 0,
    total: "Rp14.900.000",
    bayar: 0,
    cashback: 0,
    sisa: "Rp14.900.000",
    infoBayar: "sylva\n01apr 08:23",
    inputBy: "Permata",
    updBy: "zirah\n20apr 09:51",
    catatan: "PROSES",
  },
  {
    id: 2,
    nama: "Arief Khan Djaelani",
    perusahaan: "PT BCAA",
    noTelp: "-",
    ae: "SL",
    ovEnv: "SL",
    status: "FIX",
    statusUji: "-",
    form: "-",
    konf: "-",
    biaya: "Rp5.900.000",
    diskon: 0,
    total: "Rp7.500.000",
    bayar: 0,
    cashback: 0,
    sisa: "Rp7.500.000",
    infoBayar: "sylva\n01apr 08:23",
    inputBy: "-",
    updBy: "zirah\n20apr 09:51",
    catatan: "PROSES",
  },
  {
    id: 3,
    nama: "Setiyo Rishandoko",
    perusahaan: "PT ABCCC",
    noTelp: "-",
    ae: "SL",
    ovEnv: "SL",
    status: "FIX",
    statusUji: "R&U",
    form: "-",
    konf: "-",
    biaya: "Rp5.900.000",
    diskon: 0,
    total: "Rp14.900.000",
    bayar: 0,
    cashback: 0,
    sisa: "Rp14.900.000",
    infoBayar: "sylva\n01apr 08:23",
    inputBy: "-",
    updBy: "zirah\n20apr 09:51",
    catatan: "PROSES",
  },
  {
    id: 4,
    nama: "Ahmad Sarminto",
    perusahaan: "PT BCASO",
    noTelp: "08113168985 / 08559997475",
    ae: "NW",
    ovEnv: "SL",
    status: "Cancel",
    statusUji: "R&U",
    form: "-",
    konf: "-",
    biaya: "0",
    diskon: 0,
    total: "0",
    bayar: 0,
    cashback: 0,
    sisa: "0",
    infoBayar: "sylva\n01apr 08:23",
    inputBy: "-",
    updBy: "zirah\n20apr 09:51",
    catatan: "PROSES",
  },
];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function InputDataPage() {
  const router = useRouter();
  const params = useParams();

  const [detailData, setDetailData] =
    useState<DetailKegiatanFormData>(INITIAL_DETAIL);
  const [pesertaData, setPesertaData] = useState<Peserta[]>(INITIAL_PESERTA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konfirmasiPeserta, setKonfirmasiPeserta] = useState<Peserta | null>(
    null,
  );
  const [invoicePeserta, setInvoicePeserta] = useState<Peserta | null>(null);
  const [kwitansiPeserta, setKwitansiPeserta] = useState<Peserta | null>(null);

  function handleTambahPeserta() {
    setIsModalOpen(true);
  }

  function handleSimpanPeserta(data: TambahPesertaFormData) {
    console.log("Simpan peserta:", data);
    setIsModalOpen(false);
  }

  // Show konfirmasi page when a peserta is selected
  if (konfirmasiPeserta) {
    return (
      <PageKonfirmasi
        initialData={{
          namaPeserta: konfirmasiPeserta.nama,
          instansi: konfirmasiPeserta.perusahaan,
        }}
        onBack={() => setKonfirmasiPeserta(null)}
        onSimpan={(data) => {
          console.log("Simpan konfirmasi:", data);
          setKonfirmasiPeserta(null);
        }}
        onDownloadPdf={(data) => console.log("Download PDF konfirmasi:", data)}
      />
    );
  }

  if (invoicePeserta) {
    return <PageInvoice />;
  }

  if (kwitansiPeserta) {
    return <PageKwitansi />;
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Input Data" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="flex flex-col gap-4">
        {/* Back button */}
        <div>
          <button
            type="button"
            onClick={() => history.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </button>
        </div>

        {/* Card Detail Kegiatan */}
        <CardDetailKegiatan
          initialData={detailData}
          onChange={(updated) => setDetailData(updated)}
          disabled={!isEditMode}
          isEdit={!isEditMode}
          onEdit={() => setIsEditMode(true)}
        />

        {/* Card Daftar Menu */}
        <CardDaftarMenu
          handlers={{
            onEvaluasiKegiatan: () => alert("Evaluasi Kegiatan"),
            onRekapNomorSertifikat: () =>
              router.push(`/input/${params.id}/Recap`),
            onLinkPengisianData: () => alert("Link Pengisian Data"),
            onCetakFormulir: () =>
              router.push(`/input/${params.id}/formulir-pendaftaram`),
            onPindahJadwalPeserta: () => alert("Pindah Jadwal Peserta"),
            onPindahJadwal: () =>
              router.push(`/input/${params.id}/pindah-peserta`),
            onDownloadBrosur: () => alert("Download Brosur"),
            onPerusahaanTarget: () =>
              router.push(`/input/${params.id}/perusahaan-target`),
            onCetakAbsensi: () => alert("Cetak Absensi"),
            onCetakDataPeserta: () => alert("Cetak Data Peserta"),
          }}
        />

        {/* Table List Peserta */}
        <TableListPeserta
          data={pesertaData}
          onTambah={handleTambahPeserta}
          aksiHandlers={{
            onEdit: (p) => console.log("Edit", p),
            onKonfirmasi: (p) => setKonfirmasiPeserta(p),
            onCetakKwitansi: (p) => setKwitansiPeserta(p),
            onCetakInvoice: (p) => setInvoicePeserta(p),
            onPesertaFinal: (p) => console.log("Peserta Final", p),
          }}
        />
      </div>

      <ModalTambahPeserta
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSimpan={handleSimpanPeserta}
      />
    </AppLayout>
  );
}
