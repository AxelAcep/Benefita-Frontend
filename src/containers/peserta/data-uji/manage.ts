import { useState } from "react";
import type { PesertaUji } from "@/lib/types/peserta-data-uji";
import { DUMMY_PESERTA, DUMMY_PENGIRIMAN } from "./data-contoh";

const PAGE_SIZE = 4;

export function usePesertaDataUjiManage() {
  const [activeTab, setActiveTab] = useState<"peserta" | "pengiriman">(
    "peserta",
  );

  // Peserta state
  const [searchPeserta, setSearchPeserta] = useState("");
  const [namaCari, setNamaCari] = useState("");
  const [instansiCari, setInstansiCari] = useState("");
  const [tglUjiCari, setTglUjiCari] = useState("2026");
  const [appliedNama, setAppliedNama] = useState("");
  const [appliedInstansi, setAppliedInstansi] = useState("");
  const [currentPagePeserta, setCurrentPagePeserta] = useState(1);

  // Pengiriman state
  const [searchPengiriman, setSearchPengiriman] = useState("");
  const [currentPagePengiriman, setCurrentPagePengiriman] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"upload" | "lihat" | "edit">(
    "upload",
  );
  const [modalData, setModalData] = useState<PesertaUji["kiriman"]>(undefined);

  const openModal = (
    mode: "upload" | "lihat" | "edit",
    data?: PesertaUji["kiriman"],
  ) => {
    setModalMode(mode);
    setModalData(data);
    setModalOpen(true);
  };

  // Filter peserta
  const filteredPeserta = DUMMY_PESERTA.filter((d) => {
    const matchNama = d.nama.toLowerCase().includes(appliedNama.toLowerCase());
    const matchInstansi = d.perusahaan
      .toLowerCase()
      .includes(appliedInstansi.toLowerCase());
    const matchSearch =
      d.nama.toLowerCase().includes(searchPeserta.toLowerCase()) ||
      d.kode.toLowerCase().includes(searchPeserta.toLowerCase());
    return matchNama && matchInstansi && matchSearch;
  });

  const totalPagesPeserta = Math.ceil(filteredPeserta.length / PAGE_SIZE);
  const paginatedPeserta = filteredPeserta.slice(
    (currentPagePeserta - 1) * PAGE_SIZE,
    currentPagePeserta * PAGE_SIZE,
  );

  // Filter pengiriman
  const filteredPengiriman = DUMMY_PENGIRIMAN.filter(
    (d) =>
      d.namaPenerima.toLowerCase().includes(searchPengiriman.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(searchPengiriman.toLowerCase()),
  );

  const totalPagesPengiriman = Math.ceil(filteredPengiriman.length / PAGE_SIZE);
  const paginatedPengiriman = filteredPengiriman.slice(
    (currentPagePengiriman - 1) * PAGE_SIZE,
    currentPagePengiriman * PAGE_SIZE,
  );
  const totalPeserta = filteredPeserta.length;
  const totalPengiriman = filteredPengiriman.length;

  function changeSearchPeserta(value: string) {
    setSearchPeserta(value);
    setCurrentPagePeserta(1);
  }

  function changeSearchPengiriman(value: string) {
    setSearchPengiriman(value);
    setCurrentPagePengiriman(1);
  }

  function applyPesertaFilter() {
    setAppliedNama(namaCari);
    setAppliedInstansi(instansiCari);
    setCurrentPagePeserta(1);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return {
    PAGE_SIZE,
    activeTab,
    setActiveTab,
    searchPeserta,
    namaCari,
    setNamaCari,
    instansiCari,
    setInstansiCari,
    tglUjiCari,
    setTglUjiCari,
    currentPagePeserta,
    setCurrentPagePeserta,
    searchPengiriman,
    currentPagePengiriman,
    setCurrentPagePengiriman,
    modalOpen,
    modalMode,
    modalData,
    openModal,
    totalPagesPeserta,
    paginatedPeserta,
    totalPagesPengiriman,
    paginatedPengiriman,
    totalPeserta,
    totalPengiriman,
    changeSearchPeserta,
    changeSearchPengiriman,
    applyPesertaFilter,
    closeModal,
  };
}
