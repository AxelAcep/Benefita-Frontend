import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUmk } from "@/hooks/use-umk";
import { usePegawai } from "@/hooks/use-pegawai-list";

type SortBy =
  | "noUmk"
  | "tujuanUmk"
  | "jumlahUmk"
  | "realisasiUmk"
  | "sisaUangUmk"
  | "tglInput";


export function useUmkManage() {
  const router = useRouter();

  // ─── State ──────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter bulan
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customStartMonth, setCustomStartMonth] =
    useState<number>(currentMonth);
  const [customStartYear, setCustomStartYear] = useState<number>(currentYear);
  const [customEndMonth, setCustomEndMonth] = useState<number>(currentMonth);
  const [customEndYear, setCustomEndYear] = useState<number>(currentYear);

  // Filter PIC
  const [filterPicId, setFilterPicId] = useState<string>("");

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>("tglInput");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ─── Data Pegawai (untuk dropdown filter PIC) ────────────────
  const { data: pegawaiList } = usePegawai();

  // ─── API params ────────────────────────────────────────────────
  const getApiParams = useCallback(() => {
    const params: any = {
      page,
      limit,
      sortBy,
      order: sortOrder,
    };
    if (search) params.search = search;
    if (filterPicId) params.picId = filterPicId;
    if (isCustomRange) {
      params.startMonth = customStartMonth;
      params.startYear = customStartYear;
      params.endMonth = customEndMonth;
      params.endYear = customEndYear;
    } else {
      params.startMonth = currentMonth;
      params.startYear = currentYear;
    }
    return params;
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    filterPicId,
    isCustomRange,
    customStartMonth,
    customStartYear,
    customEndMonth,
    customEndYear,
    currentMonth,
    currentYear,
  ]);

  const { data, pagination, grandTotal, loading, error, refetch } =
    useUmk(getApiParams());

  // ─── Refresh saat filter berubah ──────────────────────────────
  useEffect(() => {
    refetch(getApiParams());
  }, [
    sortBy,
    sortOrder,
    search,
    filterPicId,
    currentMonth,
    currentYear,
    isCustomRange,
    customStartMonth,
    customStartYear,
    customEndMonth,
    customEndYear,
  ]);

  // ─── Navigasi bulan ────────────────────────────────────────────
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setPage(1);
  };
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setPage(1);
  };
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setIsCustomRange(false);
    setPage(1);
  };
  const handleApplyCustomRange = () => {
    setIsCustomRange(true);
    setPage(1);
  };
  const handleUseCurrentMonth = () => {
    setIsCustomRange(false);
    setPage(1);
  };

  // ─── Modal handlers ────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (id: number) => {
    setEditingId(id);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };
  const handleSuccess = () => {
    refetch(getApiParams());
  };

  // ─── Format Rupiah ─────────────────────────────────────────────

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    refetch({ ...getApiParams(), page: nextPage });
  }


  return {
    router,
    search,
    setSearch,
    page,
    setPage,
    limit,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    isCustomRange,
    customStartMonth,
    setCustomStartMonth,
    customStartYear,
    setCustomStartYear,
    customEndMonth,
    setCustomEndMonth,
    customEndYear,
    setCustomEndYear,
    filterPicId,
    setFilterPicId,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isModalOpen,
    editingId,
    pegawaiList,
    data,
    pagination,
    grandTotal,
    loading,
    error,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
    handleApplyCustomRange,
    handleUseCurrentMonth,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSuccess,
    handlePageChange,
  };
}
