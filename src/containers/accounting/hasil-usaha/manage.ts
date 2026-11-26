"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLaporanHasilUsaha } from "@/hooks/use-laporan-hasil-usaha";
import type { LaporanHasilUsahaParams } from "@/lib/services/accounting.service";

type SortBy = "kode" | "keterangan" | "anggaran" | "realisasi";

const ITEMS_PER_PAGE = 10;
const DATA_LIMIT = 1000;

export function useHasilUsahaManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customStartMonth, setCustomStartMonth] = useState(currentMonth);
  const [customStartYear, setCustomStartYear] = useState(currentYear);
  const [customEndMonth, setCustomEndMonth] = useState(currentMonth);
  const [customEndYear, setCustomEndYear] = useState(currentYear);
  const [sortBy, setSortBy] = useState<SortBy>("realisasi");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getApiParams = useCallback((): LaporanHasilUsahaParams => {
    const params: LaporanHasilUsahaParams = {
      page: 1,
      limit: DATA_LIMIT,
      sortBy,
      order: sortOrder,
    };
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
    useLaporanHasilUsaha(getApiParams());

  useEffect(() => {
    refetch(getApiParams());
    setPage(1);
    // Refetch menerima seluruh parameter secara eksplisit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiParams]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (item) =>
        item.kode.toLowerCase().includes(query) ||
        item.keterangan.toLowerCase().includes(query),
    );
  }, [data, search]);

  useEffect(() => setPage(1), [search]);

  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function goToPrevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  }

  function goToNextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  }

  function goToCurrentMonth() {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setIsCustomRange(false);
  }

  return {
    search,
    setSearch,
    page,
    setPage,
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
    data,
    grandTotal,
    loading,
    error,
    filteredData,
    totalFiltered,
    totalPages,
    startIndex,
    paginatedData,
    itemsPerPage: ITEMS_PER_PAGE,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
    handleApplyCustomRange: () => setIsCustomRange(true),
    handleUseCurrentMonth: () => setIsCustomRange(false),
  };
}
