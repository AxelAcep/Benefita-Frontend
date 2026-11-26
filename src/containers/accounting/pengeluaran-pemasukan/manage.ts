import React, { useEffect, useState } from "react";
import { useRole } from "@/hooks/use-role";
import { useRequestKeuangan, useRequestKeuanganMutation } from "@/hooks/use-request-keuangan";
import { getAkunList, getUmk, updateUmk, JENIS_REQUEST_TO_AKUN, type JenisRequestKeuangan, type StatusRequestKeuangan, type AkunItem, type RequestKeuanganItem, type UmkItem } from "@/lib/services/accounting.service";

function parseTanggalUmk(str: string | null): string {
  if (!str) return new Date().toISOString().split("T")[0];
  const parts = str.split(".");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }
  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? new Date().toISOString().split("T")[0] : fallback.toISOString().split("T")[0];
}

const PAGE_SIZE = 10;

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}


export function usePengeluaranPemasukanManage() {
  const { isFinance } = useRole();

  const [notif, setNotif] = useState<NotifState | null>(null);
  const showNotif = (message: string, type: "success" | "error") =>
    setNotif({ message, type, key: Date.now() });

  // ─── Form pengajuan ──────────────────────────────────────────
  const [jenis, setJenis] = useState<JenisRequestKeuangan>("PENGELUARAN");
  const [akunId, setAkunId] = useState<number | "">("");
  const [akunOptions, setAkunOptions] = useState<AkunItem[]>([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedUmkId, setSelectedUmkId] = useState<number | null>(null);

  const { create, update, approve, reject, loading: isMutating } =
    useRequestKeuanganMutation();

  // ─── Tab "Riwayat Request" vs "Pending UMK" ──────────────────
  const [historyTab, setHistoryTab] = useState<"riwayat" | "pending-umk">("riwayat");
  const [pendingUmk, setPendingUmk] = useState<UmkItem[]>([]);
  const [loadingPendingUmk, setLoadingPendingUmk] = useState(false);

  function loadPendingUmk() {
    setLoadingPendingUmk(true);
    getUmk({ isDocumented: false, limit: 50, sortBy: "tglInput", order: "desc" })
      .then((res) => setPendingUmk(res.data))
      .catch(() => setPendingUmk([]))
      .finally(() => setLoadingPendingUmk(false));
  }

  useEffect(() => {
    if (historyTab === "pending-umk") loadPendingUmk();
  }, [historyTab]);

  function onPakaiUmk(umk: UmkItem) {
    setEditId(null);
    setJenis("PENGELUARAN");
    setSelectedUmkId(umk.id);
    setDeskripsi(umk.tujuanUmk);
    setNominal(String(umk.jumlahUmk));
    setTanggal(parseTanggalUmk(umk.tglPenyerahanUang));
    setBuktiFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (editId) return; // pas edit, akunOptions gak perlu direset ulang tiap jenis dipilih manual
    setAkunId("");
    getAkunList({ jenis: JENIS_REQUEST_TO_AKUN[jenis], isActive: true, limit: 100 })
      .then((res) => setAkunOptions(res.data))
      .catch(() => setAkunOptions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenis]);

  function resetForm() {
    setJenis("PENGELUARAN");
    setAkunId("");
    setDeskripsi("");
    setNominal("");
    setTanggal(new Date().toISOString().split("T")[0]);
    setBuktiFile(null);
    setEditId(null);
    setSelectedUmkId(null);
  }

  function onOpenEdit(row: RequestKeuanganItem) {
    setEditId(row.id);
    setSelectedUmkId(null);
    setJenis(row.jenis);
    getAkunList({ jenis: JENIS_REQUEST_TO_AKUN[row.jenis], isActive: true, limit: 100 })
      .then((res) => setAkunOptions(res.data))
      .catch(() => setAkunOptions([]));
    setAkunId(row.akunId ?? "");
    setDeskripsi(row.deskripsi);
    setNominal(String(row.nominal));
    setTanggal(row.tanggal.slice(0, 10));
    setBuktiFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!deskripsi.trim()) {
      showNotif("Deskripsi wajib diisi", "error");
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      showNotif("Nominal wajib diisi dan lebih dari 0", "error");
      return;
    }

    try {
      if (editId) {
        await update(editId, {
          jenis,
          akunId: akunId ? Number(akunId) : null,
          deskripsi: deskripsi.trim(),
          nominal: Number(nominal),
          tanggal,
          buktiFile: buktiFile ?? undefined,
        });
        showNotif("Request berhasil diperbarui", "success");
      } else {
        await create({
          jenis,
          akunId: akunId ? Number(akunId) : undefined,
          deskripsi: deskripsi.trim(),
          nominal: Number(nominal),
          tanggal,
          buktiFile: buktiFile ?? undefined,
        });
        if (selectedUmkId) {
          try {
            await updateUmk(selectedUmkId, { isDocumented: true });
            showNotif("Request berhasil diajukan & UMK ditandai terdokumentasi", "success");
          } catch {
            showNotif("Request berhasil diajukan, tapi gagal update status UMK", "error");
          }
          loadPendingUmk();
          setHistoryTab("riwayat");
        } else {
          showNotif("Request berhasil diajukan", "success");
        }
      }
      resetForm();
      refetch();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan request",
        "error",
      );
    }
  }

  // ─── Tabel riwayat ───────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<StatusRequestKeuangan | "">("");
  const [jenisFilter, setJenisFilter] = useState<JenisRequestKeuangan | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, pagination, loading, error, refetch } = useRequestKeuangan({
    page,
    limit: PAGE_SIZE,
  });

  function applyFilters(overrides?: {
    page?: number;
    status?: StatusRequestKeuangan | "";
    jenis?: JenisRequestKeuangan | "";
    search?: string;
  }) {
    const p = overrides?.page ?? page;
    refetch({
      page: p,
      status: (overrides?.status ?? statusFilter) || undefined,
      jenis: (overrides?.jenis ?? jenisFilter) || undefined,
      search: (overrides?.search ?? search) || undefined,
    });
  }

  function handleStatusFilter(v: StatusRequestKeuangan | "") {
    setStatusFilter(v);
    setPage(1);
    applyFilters({ page: 1, status: v });
  }
  function handleJenisFilter(v: JenisRequestKeuangan | "") {
    setJenisFilter(v);
    setPage(1);
    applyFilters({ page: 1, jenis: v });
  }
  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
    applyFilters({ page: 1, search: v });
  }
  function handlePageChange(p: number) {
    setPage(p);
    applyFilters({ page: p });
  }

  // ─── Approve / Reject ───────────────────────────────────────
  const [rejectTarget, setRejectTarget] = useState<RequestKeuanganItem | null>(
    null,
  );

  async function handleApprove(row: RequestKeuanganItem) {
    try {
      await approve(row.id);
      showNotif(`Request "${row.deskripsi}" berhasil disetujui`, "success");
      applyFilters();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyetujui request",
        "error",
      );
    }
  }

  async function handleReject(catatan: string) {
    if (!rejectTarget) return;
    try {
      await reject(rejectTarget.id, catatan);
      showNotif(`Request "${rejectTarget.deskripsi}" berhasil ditolak`, "success");
      setRejectTarget(null);
      applyFilters();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menolak request",
        "error",
      );
    }
  }

  return {
    isFinance,
    notif,
    setNotif,
    jenis,
    setJenis,
    akunId,
    setAkunId,
    akunOptions,
    deskripsi,
    setDeskripsi,
    nominal,
    setNominal,
    tanggal,
    setTanggal,
    buktiFile,
    setBuktiFile,
    editId,
    selectedUmkId,
    isMutating,
    historyTab,
    setHistoryTab,
    pendingUmk,
    loadingPendingUmk,
    onPakaiUmk,
    resetForm,
    onOpenEdit,
    handleSubmitRequest,
    statusFilter,
    jenisFilter,
    search,
    page,
    data,
    pagination,
    loading,
    error,
    handleStatusFilter,
    handleJenisFilter,
    handleSearch,
    handlePageChange,
    rejectTarget,
    setRejectTarget,
    handleApprove,
    handleReject,
  };
}
