"use client";

import { useMemo, useState } from "react";
import { DATA_CONTOH, type TugasPelaporan } from "./data";
import type { TugasFormValues } from "./form";

const PAGE_SIZE = 10;

function tanggalHariIni() {
  const sekarang = new Date();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");

  return `${sekarang.getFullYear()}-${bulan}-${hari}`;
}

export function useTugasManage() {
  const [data, setData] = useState(DATA_CONTOH);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TugasPelaporan | null>(null);

  const formValues = useMemo(() => {
    if (!editTarget) return null;
    const { status, pic, dueDate, penerimaLaporan, kegiatan } = editTarget;

    return {
      status,
      pic,
      dueDate: dueDate ?? "",
      penerimaLaporan: penerimaLaporan ?? "",
      kegiatan,
    };
  }, [editTarget]);

  function openForm(row: TugasPelaporan | null) {
    setEditTarget(row);
    setModalOpen(true);
  }

  function closeForm() {
    setModalOpen(false);
    setEditTarget(null);
  }

  function save(values: TugasFormValues) {
    const fields = {
      ...values,
      dueDate: values.dueDate || null,
      penerimaLaporan: values.penerimaLaporan || null,
    };

    if (editTarget) {
      setData((rows) =>
        rows.map((row) => row.id === editTarget.id ? { ...row, ...fields } : row),
      );
    } else {
      const tanggal = tanggalHariIni();
      setData((rows) => [{ id: rows.length + 1, tanggal, ...fields }, ...rows]);
      setSearch("");
    }

    setPage(1);
    closeForm();
  }

  const query = search.trim().toLowerCase();
  const filtered = data.filter(({ kegiatan, pic, status }) =>
    [kegiatan, pic, status].some((value) => value.toLowerCase().includes(query)),
  );
  const start = (page - 1) * PAGE_SIZE;

  return {
    data: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    page,
    pageSize: PAGE_SIZE,
    setPage,
    search,
    changeSearch(value: string) {
      setSearch(value);
      setPage(1);
    },
    modalOpen,
    formValues,
    openForm,
    closeForm,
    save,
  };
}
