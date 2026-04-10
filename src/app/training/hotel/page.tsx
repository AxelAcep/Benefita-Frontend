"use client";

import React, { useMemo, useState } from "react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { HotelModal, HotelFormValues } from "@/components/training/HotelModal";
import { Hotel, dummyHotels, KOTA_LIST } from "./dummy-hotels";
import { Pencil, Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default function ManajemenHotelPage() {
  // ── state ──────────────────────────────────────────────────────────────────
  const [hotels, setHotels] = useState<Hotel[]>(dummyHotels);
  const [search, setSearch] = useState("");
  const [kotaFilter, setKotaFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Hotel | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── filter + pagination ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hotels.filter((h) => {
      const matchKota = kotaFilter === "all" || h.kota === kotaFilter;
      const matchSearch =
        !q ||
        h.namaHotel.toLowerCase().includes(q) ||
        h.kodeHotel.toLowerCase().includes(q) ||
        h.alamatHotel.toLowerCase().includes(q) ||
        h.kota.toLowerCase().includes(q);
      return matchKota && matchSearch;
    });
  }, [hotels, search, kotaFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleKota = (v: string) => { setKotaFilter(v); setCurrentPage(1); };

  // ── modal ──────────────────────────────────────────────────────────────────
  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (hotel: Hotel) => { setEditTarget(hotel); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditTarget(null); };

  const handleSave = async (data: HotelFormValues) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));

    if (editTarget) {
      setHotels((prev) =>
        prev.map((h) => h.id === editTarget.id ? { ...h, ...data } : h)
      );
    } else {
      const newId = Math.max(...hotels.map((h) => h.id)) + 1;
      setHotels((prev) => [...prev, { id: newId, ...data }]);
    }

    setIsSaving(false);
    handleClose();
  };

  // ── columns ────────────────────────────────────────────────────────────────
  const columns: ColumnDef<Hotel>[] = [
    {
      key: "no",
      label: "No",
      headerClassName: "w-10",
      render: (_v, _row, index) => (
        <span className="text-zinc-400">{(currentPage - 1) * PAGE_SIZE + index + 1}</span>
      ),
    },
    {
      key: "kota",
      label: "Kota",
      sortable: true,
      render: (v) => <span className="font-medium text-zinc-700">{v as string}</span>,
    },
    {
      key: "kodeHotel",
      label: "Kode Hotel",
      render: (v) => (
        <span className="font-mono text-[11px] bg-zinc-100 px-2 py-0.5 rounded-lg text-zinc-600">
          {v as string}
        </span>
      ),
    },
    {
      key: "namaHotel",
      label: "Nama Hotel",
      sortable: true,
      className: "font-medium text-zinc-700 min-w-[180px]",
    },
    {
      key: "alamatHotel",
      label: "Alamat Hotel",
      className: "text-zinc-500 min-w-[200px] max-w-[240px]",
      render: (v) => (
        <span className="line-clamp-1 block max-w-[240px]">{v as string}</span>
      ),
    },
    {
      key: "telepon",
      label: "Telepon",
      className: "text-zinc-600",
    },
    {
      key: "fax",
      label: "Fax",
      render: (v) => v
        ? <span className="text-zinc-600">{v as string}</span>
        : <span className="text-zinc-300">-</span>,
    },
    {
      key: "pubRate",
      label: "Pub.Rate",
      headerClassName: "text-right",
      className: "text-right",
      render: (v) => v
        ? <span className="font-semibold text-zinc-700">{v as string}</span>
        : <span className="text-zinc-300">-</span>,
    },
    {
      key: "corporate",
      label: "Corporate",
      headerClassName: "text-right",
      className: "text-right",
      render: (v) => v
        ? <span className="font-semibold text-zinc-700">{v as string}</span>
        : <span className="text-zinc-300">-</span>,
    },
    {
      key: "edit",
      label: "Edit",
      headerClassName: "text-center w-12",
      className: "text-center",
      render: (_v, row) => (
        <button
          onClick={() => openEdit(row)}
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Hotel" },
      ]}
    >
      {/* Page title row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <p className="font-bold text-zinc-800 text-sm">Manajemen Hotel</p>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        totalData={filtered.length}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Cari informasi..."
        filterSlot={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 shrink-0">Kota</span>
            <select
              value={kotaFilter}
              onChange={(e) => handleKota(e.target.value)}
              className="pl-3 pr-7 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
            >
              <option value="all">Pilih Kota</option>
              {KOTA_LIST.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              Terapkan
            </button>
          </div>
        }
        actionSlot={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data Hotel
          </button>
        }
      />

      <HotelModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSave}
        initialData={editTarget
          ? { ...editTarget, fax: editTarget.fax ?? "", pubRate: editTarget.pubRate ?? "", corporate: editTarget.corporate ?? "" }
          : null
        }
        isLoading={isSaving}
      />
    </AppLayout>
  );
}