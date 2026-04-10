"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { TrainerDetailModal, TrainerFormModal, TrainerFormValues } from "@/components/training/TrainerModal";
import { Trainer, dummyTrainers } from "@/lib/types/trainer-types";

const PAGE_SIZE = 10;

export default function ManajemenTrainerPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Trainer | null>(null);

  const filtered = dummyTrainers.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.kantor.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleOpenDetail = (item: Trainer) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  // From detail modal → switch to edit modal
  const handleDetailToEdit = () => {
    setDetailOpen(false);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: Trainer) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleSubmit = async (data: TrainerFormValues) => {
    // TODO: replace with actual API call
    console.log("submit", data);
    setFormOpen(false);
  };

  const columns: ColumnDef<Trainer>[] = [
    {
      key: "no",
      label: "No",
      render: (_val, _row, index) => (
        <span className="text-zinc-400 font-medium">
          {(currentPage - 1) * PAGE_SIZE + index + 1}
        </span>
      ),
    },
    {
      key: "kode",
      label: "Kode",
      sortable: true,
    },
    {
      key: "nama",
      label: "Nama",
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-zinc-700">{val as string}</span>
      ),
    },
    {
      key: "hp",
      label: "HP",
    },
    {
      key: "email",
      label: "Email",
      render: (val) => (
        <span className="text-emerald-600">{val as string}</span>
      ),
    },
    {
      key: "kantor",
      label: "Kantor",
      sortable: true,
    },
    {
      key: "referensi",
      label: "Referensi",
      className: "max-w-[200px]",
      render: (_val, row) => (
        <div className="flex flex-wrap gap-1">
          {row.referensi.slice(0, 8).map((ref) => (
            <span
              key={ref}
              className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-zinc-100 text-zinc-500"
            >
              {ref}
            </span>
          ))}
          {row.referensi.length > 8 && (
            <span className="text-[9px] text-zinc-400">+{row.referensi.length - 8}</span>
          )}
        </div>
      ),
    },
    {
      key: "subyekKhusus",
      label: "Subyek Khusus",
      render: (val) =>
        val ? (
          <span>{val as string}</span>
        ) : (
          <span className="text-zinc-300">-</span>
        ),
    },
    {
      key: "jumlahHari",
      label: "Jumlah Hari",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center font-semibold text-zinc-700",
    },
    {
      key: "detail",
      label: "Detail",
      render: (_val, row) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="text-[11px] font-semibold text-emerald-500 hover:text-emerald-700 whitespace-nowrap transition-colors"
        >
          Lihat Detail →
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training" },
        { label: "Manajemen Trainer" },
      ]}
      subtitle="Hari Ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={paginated}
          totalData={filtered.length}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          searchPlaceholder="Cari informasi..."
          searchValue={search}
          onSearchChange={handleSearch}
          actionSlot={
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Data Trainer
            </button>
          }
        />

        {/* Detail / View Modal */}
        <TrainerDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onEdit={handleDetailToEdit}
          data={selectedItem}
        />

        {/* Edit / Create Modal */}
        <TrainerFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={selectedItem}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}