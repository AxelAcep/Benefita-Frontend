import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePiutang } from "@/hooks/use-piutang";

type JenisTab = "ALL" | "REG" | "INH" | "KON";


export function usePiutangManage() {
  const router = useRouter();

  // ─── State ────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<JenisTab>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 1000; // ambil semua data agar search client-side berfungsi

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

  // Sorting
  const [sortBy, setSortBy] = useState<
    "totalPendapatan" | "totalPendapatan" | "totalPiutang" | "tglSelesai"
  >("totalPiutang");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal detail
  const [selectedJadwal, setSelectedJadwal] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ─── API params ──────────────────────────────────────────────
  const getApiParams = useCallback(() => {
    const params: any = {
      page: 1, // selalu 1 karena kita ambil semua data
      limit,
      sortBy,
      order: sortOrder,
    };
    if (activeTab !== "ALL") params.jenis = activeTab;
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
    activeTab,
    limit,
    sortBy,
    sortOrder,
    isCustomRange,
    customStartMonth,
    customStartYear,
    customEndMonth,
    customEndYear,
    currentMonth,
    currentYear,
  ]);

  const { data, grandTotal, loading, error, refetch } =
    usePiutang(getApiParams());

  // ─── Effect: refresh saat filter berubah (kecuali page & search) ──
  useEffect(() => {
    refetch(getApiParams());
    setPage(1); // reset ke halaman 1
  }, [
    activeTab,
    sortBy,
    sortOrder,
    currentMonth,
    currentYear,
    isCustomRange,
    customStartMonth,
    customStartYear,
    customEndMonth,
    customEndYear,
  ]);

  // ─── Filter client-side (search) ──────────────────────────────
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(
      (item) =>
        item.kodePelatihan.toLowerCase().includes(s) ||
        item.judulLengkap.toLowerCase().includes(s) ||
        item.judulTraining.toLowerCase().includes(s),
    );
  }, [data, search]);

  // Reset page saat search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  // ─── Pagination manual ─────────────────────────────────────────
  const itemsPerPage = 10;
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ─── Navigasi bulan ──────────────────────────────────────────────
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setIsCustomRange(false);
  };

  // ─── Handlers ──────────────────────────────────────────────────
  const handleTabChange = (tab: JenisTab) => setActiveTab(tab);
  const handleApplyCustomRange = () => setIsCustomRange(true);
  const handleUseCurrentMonth = () => setIsCustomRange(false);

  const handleOpenDetail = (kodeJadwal: string) => {
    setSelectedJadwal(kodeJadwal);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJadwal(null);
  };

  // ─── Format Rupiah ────────────────────────────────────────────

  return {
    router,
    activeTab,
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
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedJadwal,
    isModalOpen,
    grandTotal,
    loading,
    error,
    itemsPerPage,
    totalFiltered,
    totalPages,
    startIndex,
    paginatedData,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
    handleTabChange,
    handleApplyCustomRange,
    handleUseCurrentMonth,
    handleOpenDetail,
    handleCloseModal,
  };
}
