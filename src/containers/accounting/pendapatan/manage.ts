import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePendapatan } from "@/hooks/use-pendapatan";

type JenisTab = "ALL" | "REG" | "INH" | "KON";


export function usePendapatanManage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<JenisTab>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 1000; // Ambil semua data agar search client-side berfungsi

  // State untuk filter bulan
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

  // State sorting
  const [sortBy, setSortBy] = useState<
    "totalPeserta" | "pendapatan" | "tglSelesai"
  >("pendapatan");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Parameter API
  const getApiParams = useCallback(() => {
    const params: any = {
      page: 1, // Selalu halaman 1 karena kita ambil semua data
      limit,
      sortBy,
      order: sortOrder,
    };
    if (activeTab !== "ALL") {
      params.jenis = activeTab;
    }
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
    usePendapatan(getApiParams());

  // Refresh ketika filter berubah (kecuali page dan search)
  useEffect(() => {
    refetch(getApiParams());
    setPage(1); // Reset ke halaman 1 saat filter berubah
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

  // Filter data client-side (search)
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(
      (item) =>
        item.kodePelatihan.toLowerCase().includes(search.toLowerCase()) ||
        item.judulLengkap.toLowerCase().includes(search.toLowerCase()) ||
        item.judulTraining.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // Reset page ketika search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Pagination manual setelah filter client-side
  const itemsPerPage = 10;
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Navigasi bulan
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setIsCustomRange(false);
  };

  const handleTabChange = (tab: JenisTab) => {
    setActiveTab(tab);
  };

  const handleApplyCustomRange = () => {
    setIsCustomRange(true);
  };
  const handleUseCurrentMonth = () => {
    setIsCustomRange(false);
  };

  // Format Rupiah

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
    setIsCustomRange,
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
    handleTabChange,
  };
}
