"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useParams, useRouter } from "next/navigation";

import CardDetailKegiatan, {
  type DetailKegiatanFormData,
} from "./card-detail-kegiatan";
import CardDaftarMenu from "./card-daftar-menu";
import TableListPeserta from "./table-list-peserta";
import ModalTambahPeserta, {
  type TambahPesertaFormData,
} from "./modal-tambah-peserta";
import PageKwitansi from "./kwitansi/[idPeserta]/page";
import PageInvoice from "./invoice/[idPeserta]/page";
import Notification from "@/components/base/notifications"; // sesuaikan path

import {
  usePesertaTrainingList,
  usePesertaTrainingDetail,
  usePesertaTrainingMutation,
} from "@/hooks/use-input";
import {
  PesertaTrainingListItem,
  JadwalSummary,
} from "@/lib/services/input.service";

export default function InputDataPage() {
  const router = useRouter();
  const params = useParams();
  const noJadwal = params.id as string;

  const [detailData, setDetailData] = useState<DetailKegiatanFormData | null>(
    null,
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPesertaId, setEditingPesertaId] = useState<string | null>(null);
  const [invoicePeserta, setInvoicePeserta] =
    useState<PesertaTrainingListItem | null>(null);
  const [kwitansiPeserta, setKwitansiPeserta] =
    useState<PesertaTrainingListItem | null>(null);

  const {
    data,
    meta,
    isLoading,
    search,
    currentPage,
    jadwal,
    fetch,
    handleSearch,
    handlePageChange,
  } = usePesertaTrainingList(noJadwal);

  const {
    data: detailPeserta,
    isLoading: isLoadingDetail,
    fetch: fetchDetail,
    reset: resetDetail,
  } = usePesertaTrainingDetail();

  const {
    handleCreate,
    handleUpdate,
    isLoading: isSaving,
  } = usePesertaTrainingMutation({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingPesertaId(null);
      resetDetail();
      fetch();
      // ✅ Tambah ini
      setNotification({
        message: editingPesertaId
          ? "Data peserta berhasil diperbarui"
          : "Peserta berhasil ditambahkan",
        type: "success",
      });
    },
    onError: (msg) => {
      // ✅ Tambah ini juga biar error kecover
      setNotification({ message: msg, type: "error" });
    },
  });

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (jadwal) {
      setDetailData({
        noJadwal: jadwal.noJadwal,
        kode: jadwal.kodePelatihan,
        tanggalMulai: jadwal.tglMulai
          ? new Date(jadwal.tglMulai).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
        tanggalSelesai: jadwal.tglSelesai
          ? new Date(jadwal.tglSelesai).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
        metode: jadwal.metode,
        lokasi: jadwal.lokasiDetail ?? "-",
        kota: jadwal.kota,
        biayaOnline: "",
        biayaOffline: `Rp${jadwal.biaya.toLocaleString("id-ID")}`,
        biayaSertifikasi: "",
        judul: jadwal.judulLengkap,
        pesertaFIXOnline: String(jadwal.pesertaFixOnline),
        pesertaFIXOffline: String(jadwal.pesertaFixOffline),
        catatan: jadwal.catatan ?? "",
        statusJadwal: jadwal.status,
      });
    }
  }, [jadwal]);

  useEffect(() => {
    if (editingPesertaId) {
      fetchDetail(editingPesertaId).catch((err) => {
        setNotification({
          message:
            err instanceof Error
              ? err.message
              : "Gagal mengambil detail peserta",
          type: "error",
        });
        setIsModalOpen(false);
        setEditingPesertaId(null);
      });
    }
  }, [editingPesertaId]);

  function handleTambah() {
    resetDetail();
    setEditingPesertaId(null);
    setIsModalOpen(true);
  }

  function handleEdit(peserta: PesertaTrainingListItem) {
    setEditingPesertaId(String(peserta.id));
    setIsModalOpen(true);
  }

  function handleSimpan(formData: TambahPesertaFormData) {
    const payload = {
      nama: formData.nama,
      jabatan: formData.jabatan,
      noIndukPerusahaan: formData.noIndukPerusahaan,
      alamat: formData.alamat,
      noTelp: formData.noTelp,
      noFax: formData.noFax,
      email: formData.email,
      alamatPengirimanSertifikat: formData.alamatPengirimanSertifikat,
      catatan: formData.catatan,
      accExecutive: formData.accExecutive,
      status: formData.status,
      metode: formData.metode,
      ujian: formData.ujian,
      industri: formData.industri,
      ownEnv: formData.ownEnv,
      diskon: formData.diskon ? parseInt(formData.diskon) : undefined,
      ppn: formData.ppn ? parseInt(formData.ppn) : undefined,
      cashback: formData.cashback ? parseInt(formData.cashback) : undefined,
      hargaTotal: formData.hargaTotal
        ? parseInt(formData.hargaTotal)
        : undefined,
      bayar: formData.bayar ? parseInt(formData.bayar) : undefined,
      infoPembayaran: formData.infoPembayaran,
      infoPenagihan: formData.infoPenagihan,
      tglBayar: formData.tanggalBayar,
      noInvoice: formData.noInvoice,
      noKwitansi: formData.noKwitansi,
      noInvUjian: formData.noInvUjian,
      noKwtUjian: formData.noKwtUjian,
      fileBuktiPembayaran: formData.fileBuktiPembayaran,
      filePendaftaran: formData.filePendaftaran,
    };

    if (editingPesertaId) {
      handleUpdate(editingPesertaId, payload);
    } else {
      handleCreate(noJadwal, payload);
    }
  }

  const initialFormData: Partial<TambahPesertaFormData> | undefined =
    detailPeserta
      ? {
          nama: detailPeserta.nama,
          jabatan: detailPeserta.jabatan ?? "",
          noIndukPerusahaan: detailPeserta.perusahaan?.noInduk ?? "",
          alamat: detailPeserta.alamat ?? "",
          noTelp: detailPeserta.noTelp ?? "",
          noFax: detailPeserta.noFax ?? "",
          email: detailPeserta.email ?? "",
          alamatPengirimanSertifikat:
            detailPeserta.alamatPengirimanSertifikat ?? "",
          catatan: detailPeserta.catatan ?? "",
          accExecutive: detailPeserta.accExecutive ?? "",
          status: detailPeserta.status ?? "",
          metode: detailPeserta.metode ?? "",
          ujian: detailPeserta.ujian ?? "",
          konfirmasiOleh: detailPeserta.konfirmasiOleh ?? "",
          industri: detailPeserta.industri ?? "",
          ownEnv: detailPeserta.ownEnv ?? "",
          diskon: detailPeserta.diskon ? String(detailPeserta.diskon) : "",
          ppn: detailPeserta.ppn ? String(detailPeserta.ppn) : "",
          cashback: detailPeserta.cashback
            ? String(detailPeserta.cashback)
            : "",
          hargaTotal: detailPeserta.hargaTotal
            ? String(detailPeserta.hargaTotal)
            : "",
          bayar: detailPeserta.bayar ? String(detailPeserta.bayar) : "",
          infoPembayaran: detailPeserta.infoPembayaran ?? "",
          infoPenagihan: detailPeserta.infoPenagihan ?? "",
          tanggalBayar: detailPeserta.tglBayar
            ? detailPeserta.tglBayar.split("T")[0]
            : "",
          noInvoice: detailPeserta.noInvoice ?? "",
          noKwitansi: detailPeserta.noKwitansi ?? "",
          noInvUjian: detailPeserta.noInvUjian ?? "",
          noKwtUjian: detailPeserta.noKwtUjian ?? "",
        }
      : undefined;

  if (invoicePeserta) return <PageInvoice />;
  if (kwitansiPeserta) return <PageKwitansi />;

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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col gap-4">
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

        {detailData && (
          <CardDetailKegiatan
            initialData={detailData}
            onChange={(updated) => setDetailData(updated)}
            disabled={!isEditMode}
            isEdit={!isEditMode}
            onEdit={() => setIsEditMode(true)}
          />
        )}

        <CardDaftarMenu
          handlers={{
            onEvaluasiKegiatan: () =>
              router.push(`${params.id}/rekap-evaluasi`),
            onRekapNomorSertifikat: () =>
              router.push(`/input/${params.id}/Recap`),
            onLinkPengisianData: () => router.push(`/pengumuman/${noJadwal}`),
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

        <TableListPeserta
          data={data}
          totalData={meta.total}
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          searchValue={search}
          isLoading={isLoading}
          onTambah={handleTambah}
          aksiHandlers={{
            onEdit: handleEdit,
            onKonfirmasi: (p) =>
              router.push(`/input/${noJadwal}/konfirmasi/${p.id}`),
            onCetakKwitansi: (p) =>
              router.push(`/input/${noJadwal}/kwitansi/${p.id}`),
            onCetakInvoice: (p) =>
              router.push(`/input/${noJadwal}/invoice/${p.id}`),
            onPesertaFinal: (p) => console.log("Peserta Final", p),
          }}
        />
      </div>

      <ModalTambahPeserta
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPesertaId(null);
          resetDetail();
        }}
        onSimpan={handleSimpan}
        isLoading={isLoadingDetail || isSaving}
        isEditMode={!!editingPesertaId}
        initialData={initialFormData}
        inputOleh={detailPeserta?.pegawaiInput?.nama}
        tanggalInput={
          detailPeserta?.tglInput
            ? detailPeserta.tglInput.split("T")[0]
            : undefined
        }
        updateOleh={detailPeserta?.pegawaiUpdate?.nama}
        tanggalUpdate={
          detailPeserta?.tglUpdate
            ? detailPeserta.tglUpdate.split("T")[0]
            : undefined
        }
      />
    </AppLayout>
  );
}
