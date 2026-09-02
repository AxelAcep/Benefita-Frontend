"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import {
  TrainerDetailModal,
  TrainerFormModal,
  TrainerFormValues,
} from "@/components/training/TrainerModal";
import type { Trainer } from "@/lib/types/trainer-types";
import {
  useTrainers,
  useTrainerById,
  useCreateTrainer,
  useUpdateTrainer,
} from "@/hooks/use-trainer";
import Notification from "@/components/base/notifications"; // ✅

export default function ManajemenTrainerPage() {
  const {
    data,
    pagination,
    loading,
    page,
    search,
    status,
    setPage,
    handleSearch,
    handleStatusChange,
    refresh,
  } = useTrainers();

  const { mutate: create, loading: creating } = useCreateTrainer();
  const { mutate: update, loading: updating } = useUpdateTrainer();

  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Trainer | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: detailData } = useTrainerById(selectedId);

  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (detailData) setSelectedItem(detailData);
  }, [detailData]);

  const handleOpenAdd = () => {
    setSelectedId(null);
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleOpenDetail = (item: Trainer) => {
    setSelectedItem(item); // sementara pakai list data
    if (selectedId === item.id) {
      // id sama, effect ga re-run → paksa pakai detailData yang sudah ada
      if (detailData) setSelectedItem(detailData);
    } else {
      setSelectedId(item.id); // id beda → trigger fetch
    }
    setDetailOpen(true);
  };

  const handleDetailToEdit = () => {
    setDetailOpen(false);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: Trainer) => {
    setSelectedId(item.id);
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleSubmit = async (data: TrainerFormValues) => {
    const referensiStr = Array.isArray(data.referensi)
      ? data.referensi.join(",")
      : (data.referensi ?? "");

    const payload = {
      kode: data.kode,
      nama: data.nama,
      telp: data.hp,
      email: data.email,
      kantor: data.kantor,
      alamat: data.alamat,
      alamatKantor: data.alamatKantor,
      noTelpKantor: data.noTelpKantor,
      referensi: referensiStr,
      subjekKhusus: data.subyekKhusus ?? undefined,
      keterangan: data.keterangan ?? undefined,
      tugas: data.tugas ?? undefined,
      statusAktif: data.statusAktif ?? true,
    };

    if (selectedItem) {
      await update(selectedItem.id, payload, () => {
        setFormOpen(false);
        setSelectedId(null);
        refresh();
        setNotif({
          message: "Data trainer berhasil diperbarui",
          type: "success",
        });
      });
    } else {
      await create(payload, () => {
        setFormOpen(false);
        setSelectedId(null);
        refresh();
        setNotif({
          message: "Data trainer berhasil ditambahkan",
          type: "success",
        });
      });
    }
  };

  const columns: ColumnDef<Trainer>[] = [
    {
      key: "no",
      label: "No",
      render: (_val, _row, index) => (
        <span className="text-zinc-400 font-medium">
          {(page - 1) * 10 + index + 1}
        </span>
      ),
    },
    { key: "kode", label: "Kode", sortable: true },
    {
      key: "nama",
      label: "Nama",
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-zinc-700">{val as string}</span>
      ),
    },
    { key: "hp", label: "HP" },
    {
      key: "email",
      label: "Email",
      render: (val) => (
        <span className="text-emerald-600">{val as string}</span>
      ),
    },
    { key: "kantor", label: "Kantor", sortable: true },
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
            <span className="text-[9px] text-zinc-400">
              +{row.referensi.length - 8}
            </span>
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
      key: "statusAktif",
      label: "Status",
      headerClassName: "text-center",
      className: "text-center",
      render: (_val, row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
            row.statusAktif
              ? "bg-emerald-50 text-emerald-600"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {row.statusAktif ? "Aktif" : "Nonaktif"}
        </span>
      ),
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
      breadcrumbs={[{ label: "Training" }, { label: "Manajemen Trainer" }]}
      subtitle="Hari Ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      {notif && (
        <Notification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          totalData={pagination.total}
          currentPage={page}
          totalPages={pagination.totalPages}
          pageSize={10}
          onPageChange={setPage}
          searchPlaceholder="Cari kode, nama, HP, kantor..."
          searchValue={search}
          onSearchChange={handleSearch}
          isLoading={loading}
          actionSlot={
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as "aktif" | "nonaktif" | "",
                  )
                }
                className="px-2.5 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 outline-none focus:border-emerald-300"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Data Trainer
              </button>
            </div>
          }
        />

        <TrainerDetailModal
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedId(null); // ← tambah ini
          }}
          onEdit={handleDetailToEdit}
          data={selectedItem}
        />

        <TrainerFormModal
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setSelectedId(null); // ← tambah ini
          }}
          initialData={selectedItem}
          onSubmit={handleSubmit}
          isLoading={creating || updating}
        />
      </div>
    </AppLayout>
  );
}
