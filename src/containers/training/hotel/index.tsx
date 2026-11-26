"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { Pencil, Plus } from "lucide-react";
import type { Hotel } from "@/lib/types/hotel";
import { HotelForm } from "./form";
import { UKURAN_HALAMAN, useHotelManage } from "./manage";

const teks = (v: unknown) =>
  v === null || v === undefined || v === "" ? "-" : String(v);

const rupiah = (v: unknown) =>
  typeof v === "number" ? v.toLocaleString("id-ID") : teks(v);

export default function HotelContainer() {
  const m = useHotelManage();

  const columns: ColumnDef<Hotel>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (m.page - 1) * UKURAN_HALAMAN + i + 1,
    },
    { key: "kota", label: "Kota", render: (v) => String(v) },
    { key: "kodeHotel", label: "Kode Hotel", render: (v) => String(v) },
    { key: "namaHotel", label: "Nama Hotel", render: (v) => String(v) },
    { key: "alamat", label: "Alamat Hotel", render: (v) => String(v) },
    { key: "telepon", label: "Telepon", render: (v) => String(v) },
    { key: "fax", label: "Fax", render: teks },
    { key: "pubRate", label: "Pub Rate", render: rupiah },
    { key: "corRate", label: "Corporate", render: rupiah },
    {
      key: "edit",
      label: "Edit",
      render: (_v, row) => (
        <button
          onClick={() => m.openEdit(row)}
          aria-label={`Edit ${row.namaHotel}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Hotel" },
      ]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Manajemen Hotel</h1>
      </div>

      <DataTable
        columns={columns}
        data={m.data}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={UKURAN_HALAMAN}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari kode, nama, atau alamat hotel..."
        isLoading={m.loading}
        filterSlot={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 shrink-0">Kota</span>
            <select
              value={m.kota || "all"}
              onChange={(e) =>
                m.setKota(e.target.value === "all" ? "" : e.target.value)
              }
              className="pl-3 pr-7 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white"
            >
              <option value="all">Pilih Kota</option>
              {m.kotaList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        }
        actionSlot={
          <button
            onClick={m.openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data Hotel
          </button>
        }
      />

      <HotelForm
        open={m.modalOpen}
        onClose={m.closeModal}
        onSubmit={m.save}
        initialData={m.editValues}
        isLoading={m.isSaving}
        kotaList={m.kotaList}
      />
    </AppLayout>
  );
}
