import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNeraca } from "@/hooks/use-neraca";
import { useJenisBiaya } from "@/hooks/use-jenis-biaya";

import type { CreateNeracaPayload, NeracaItem } from "@/lib/services/accounting.service";

export function useNeracaManage() {
  const router = useRouter();

  // ─── HOOKS ──────────────────────────────────────────────
  const { data, loading, error, setParams, create, update, remove } =
    useNeraca();
  const { data: jenisBiaya, loading: loadingJenis } = useJenisBiaya();

  // ─── LOCAL STATE ────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [startMonth, setStartMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [isRange, setIsRange] = useState(false); // true = range, false = single month

  // ─── MODAL STATE ────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalInitialData, setModalInitialData] = useState<NeracaItem | null>(null);

  // ─── APPLY FILTER ───────────────────────────────────────
  const applyFilter = () => {
    if (isRange) {
      setParams({
        startMonth,
        startYear,
        endMonth,
        endYear,
        search: search || undefined,
      });
    } else {
      setParams({
        month: startMonth,
        year: startYear,
        search: search || undefined,
        startMonth: undefined,
        startYear: undefined,
        endMonth: undefined,
        endYear: undefined,
      });
    }
  };

  // ─── MODAL HANDLERS ─────────────────────────────────────
  const handleModalSubmit = async (payload: CreateNeracaPayload) => {
    if (modalMode === "create") {
      await create(payload);
    } else {
      if (modalInitialData) await update(modalInitialData.id, payload);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setModalInitialData(null);
    setModalOpen(true);
  };

  const openEditModal = (item: NeracaItem) => {
    setModalMode("edit");
    setModalInitialData(item);
    setModalOpen(true);
  };

  // ─── TOTALS ─────────────────────────────────────────────
  const totalDebet = data.reduce((sum, d) => sum + (d.debit || 0), 0);
  const totalKredit = data.reduce((sum, d) => sum + (d.kredit || 0), 0);
  const totalSaldo = data.reduce((sum, d) => sum + (d.saldo || 0), 0);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    if (!window.confirm("Yakin hapus?")) return;
    setDeleteError(null);
    try {
      await remove(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Gagal menghapus data neraca.");
    }
  }


  return {
    router,
    data,
    loading,
    error,
    jenisBiaya,
    search,
    setSearch,
    startMonth,
    setStartMonth,
    startYear,
    setStartYear,
    endMonth,
    setEndMonth,
    endYear,
    setEndYear,
    isRange,
    setIsRange,
    modalOpen,
    setModalOpen,
    modalMode,
    modalInitialData,
    applyFilter,
    handleModalSubmit,
    openCreateModal,
    openEditModal,
    totalDebet,
    totalKredit,
    totalSaldo,
    deleteError,
    handleDelete,
  };
}
