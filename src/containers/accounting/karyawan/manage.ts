import { useEffect, useRef, useState } from "react";
import { usePegawaiList, usePegawaiActions } from "@/hooks/use-pegawai";
import type { Pegawai, CreatePegawaiRequest, UpdatePegawaiRequest } from "@/lib/services/pegawai.service";

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

export function useAccountingKaryawanManage() {
  const {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalData,
    pageSize,
    onPageChange,
    search,
    onSearchChange,
    refetch,
  } = usePegawaiList();

  const {
    isSaving,
    onGetDetail,
    onCreatePegawai,
    onUpdatePegawai,
    onResetPassword,
    onResetDevice,
    onDeleteDokumen,
  } = usePegawaiActions(refetch);

  const notifKey = useRef(0);
  const detailRequest = useRef(0);
  useEffect(() => () => {
    detailRequest.current += 1;
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [notif, setNotif] = useState<NotifState | null>(null);

  function showNotif(message: string, type: "success" | "error" = "success") {
    setNotif({ message, type, key: ++notifKey.current });
  }

  // ── Handlers ──
  function handleTambah() {
    detailRequest.current += 1;
    setSelectedPegawai(null);
    setModalOpen(true);
  }

  async function handleLihatDetail(id: string) {
    const request = ++detailRequest.current;
    try {
      const detail = await onGetDetail(id);
      if (request !== detailRequest.current) return;
      setSelectedPegawai(detail);
      setModalOpen(true);
    } catch {
      if (request === detailRequest.current) {
        showNotif("Gagal memuat detail pegawai", "error");
      }
    }
  }

  async function handleSubmitModal(
    payload: CreatePegawaiRequest | UpdatePegawaiRequest,
  ) {
    try {
      if (selectedPegawai) {
        await onUpdatePegawai(
          selectedPegawai.id,
          payload as UpdatePegawaiRequest,
        );
        showNotif("Data pegawai berhasil diperbarui");
      } else {
        await onCreatePegawai(payload as CreatePegawaiRequest);
        showNotif("Pegawai berhasil ditambahkan");
      }
      setModalOpen(false);
    } catch (e: unknown) {
      showNotif(e instanceof Error ? e.message : "Terjadi kesalahan", "error");
    }
  }

  async function handleResetPassword(id: string, newPassword: string) {
    try {
      await onResetPassword(id, newPassword);
      showNotif("Password berhasil direset");
    } catch (e: unknown) {
      showNotif(e instanceof Error ? e.message : "Gagal mereset password", "error");
    }
  }

  async function handleResetDevice(id: string) {
    try {
      await onResetDevice(id);
      showNotif("Device berhasil direset");
    } catch (e: unknown) {
      showNotif(e instanceof Error ? e.message : "Gagal mereset device", "error");
    }
  }

  async function handleDeleteDokumen(dokumenId: string) {
    try {
      await onDeleteDokumen(dokumenId);
      showNotif("Dokumen berhasil dihapus");
    } catch (e: unknown) {
      showNotif(e instanceof Error ? e.message : "Gagal menghapus dokumen", "error");
    }
  }

  function closeModal() {
    if (isSaving) return;
    detailRequest.current += 1;
    setModalOpen(false);
  }

  return {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalData,
    pageSize,
    onPageChange,
    search,
    onSearchChange,
    isSaving,
    modalOpen,
    selectedPegawai,
    notif,
    handleTambah,
    handleLihatDetail,
    handleSubmitModal,
    handleResetPassword,
    handleResetDevice,
    handleDeleteDokumen,
    closeModal,
    closeNotif: () => setNotif(null),
  };
}
