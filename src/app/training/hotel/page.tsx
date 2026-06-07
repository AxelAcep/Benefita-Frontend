"use client";

import React, { useMemo, useState } from "react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { HotelModal, HotelFormValues } from "@/components/training/HotelModal";
import { KOTA_LIST } from "./dummy-hotels";
import { Pencil, Plus } from "lucide-react";
import { useHotels } from "@/hooks/use-hotel";
import Notification from "@/components/base/notifications"; // ✅

const PAGE_SIZE = 10;

// ── NOTIF STATE TYPE ────────────────────────────────────────────────────────
interface NotifState {
  message: string;
  type: "success" | "error";
  key: number; // force re-mount tiap notif baru
}

export default function ManajemenHotelPage() {
  const {
    data: hotels,
    page,
    setPage,
    search,
    setSearch,
    kota,
    setKota,
    create,
    update,
  } = useHotels({ initialLimit: PAGE_SIZE });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState<NotifState | null>(null); // ✅

  const currentPage = page;
  const paginated = useMemo(() => hotels, [hotels]);

  // ── HELPERS ──────────────────────────────────────────────────────────────

  const showNotif = (message: string, type: "success" | "error") => {
    setNotif({ message, type, key: Date.now() });
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleKota = (v: string) => {
    setKota(v === "all" ? "" : v);
    setPage(1);
  };

  // ── MODAL ─────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (hotel: any) => {
    setEditTarget({
      ...hotel,
      alamatHotel: hotel.alamat,
      corporate: hotel.corRate != null ? String(hotel.corRate) : "",
      pubRate: hotel.pubRate != null ? String(hotel.pubRate) : "",
      fax: hotel.fax ?? "",
    });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSave = async (data: HotelFormValues) => {
    setIsSaving(true);
    try {
      const basePayload = {
        kodeHotel: data.kodeHotel,
        namaHotel: data.namaHotel,
        alamat: data.alamatHotel,
        kota: data.kota,
        telepon: data.telepon,
        fax: data.fax || undefined,
        pubRate: data.pubRate ? Number(data.pubRate) : undefined,
        corRate: data.corporate ? Number(data.corporate) : undefined,
      };

      if (editTarget) {
        await update(basePayload.kodeHotel, basePayload); // ✅ pakai editTarget.id, bukan kodeHotel
        showNotif("Data hotel berhasil diperbarui", "success");
      } else {
        await create(basePayload);
        showNotif("Data hotel berhasil ditambahkan", "success");
      }

      handleClose();
    } catch (err: any) {
      showNotif(err?.message || "Gagal menyimpan data hotel", "error"); // ✅
    } finally {
      setIsSaving(false);
    }
  };

  // ── COLUMNS ───────────────────────────────────────────────────────────────
  const columns: ColumnDef<any>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, index) => (
        <span>{(currentPage - 1) * PAGE_SIZE + index + 1}</span>
      ),
    },
    { key: "kota", label: "Kota", render: (v) => <span>{String(v)}</span> },
    {
      key: "kodeHotel",
      label: "Kode Hotel",
      render: (v) => <span>{String(v)}</span>,
    },
    {
      key: "namaHotel",
      label: "Nama Hotel",
      render: (v) => <span>{String(v)}</span>,
    },
    {
      key: "alamat",
      label: "Alamat Hotel",
      render: (v) => <span>{String(v)}</span>,
    },
    {
      key: "telepon",
      label: "Telepon",
      render: (v) => <span>{String(v)}</span>,
    },
    {
      key: "fax",
      label: "Fax",
      render: (v) => (v ? <span>{String(v)}</span> : "-"),
    },
    {
      key: "pubRate",
      label: "Pub Rate",
      render: (v) => (v ? <span>{String(v)}</span> : "-"),
    },
    {
      key: "corRate",
      label: "Corporate",
      render: (v) => (v ? <span>{String(v)}</span> : "-"),
    },
    {
      key: "edit",
      label: "Edit",
      render: (_v, row) => (
        <button onClick={() => openEdit(row)}>
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Hotel" },
      ]}
    >
      {/* ✅ Notifikasi — key bikin re-mount tiap notif baru */}
      {notif && (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Manajemen Hotel</h1>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        totalData={hotels.length}
        currentPage={currentPage}
        totalPages={1}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Cari informasi..."
        filterSlot={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 shrink-0">Kota</span>
            <select
              value={kota || "all"}
              onChange={(e) => handleKota(e.target.value)}
              className="pl-3 pr-7 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white"
            >
              <option value="all">Pilih Kota</option>
              {KOTA_LIST.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
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
        initialData={
          editTarget
            ? {
                ...editTarget,
                fax: editTarget.fax ?? "",
                pubRate: editTarget.pubRate ?? "",
                corporate: editTarget.corporate ?? "",
              }
            : null
        }
        isLoading={isSaving}
      />
    </AppLayout>
  );
}
