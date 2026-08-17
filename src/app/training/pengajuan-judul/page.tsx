// app/training/pengajuan-judul/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import {
  PengajuanJudulModal,
  PengajuanJudulParsed,
  PengajuanJudulData,
} from "@/components/training/JudulModal";
import type { PengajuanListItem } from "@/lib/services/pengajuan-judul-training.service";
import Notification from "@/components/base/notifications";
import {
  usePengajuan,
  usePengajuanById,
  useCreatePengajuan,
  useUpdatePengajuan,
} from "@/hooks/use-pengajuan-judul";

const responMAColor = {
  PENDING: "bg-zinc-100 text-zinc-500",
  DISETUJUI: "bg-emerald-50 text-emerald-600",
  DITOLAK: "bg-red-50 text-red-500",
};

const responMALabel = {
  PENDING: "Pending",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};

export default function PengajuanJudulTrainingPage() {
  const {
    data,
    pagination,
    loading,
    page,
    search,
    setPage,
    handleSearch,
    refresh,
  } = usePengajuan();

  const { mutate: create, loading: creating } = useCreatePengajuan();
  const { mutate: update, loading: updating } = useUpdatePengajuan();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PengajuanJudulData | null>(
    null,
  );
  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { data: detailData } = usePengajuanById(selectedId);

  useEffect(() => {
    if (detailData) {
      setSelectedItem({
        id: detailData.id,
        judulTraining: detailData.judulTraining,
        jumlahHari: detailData.jumlahHari,
        perusahaanId: detailData.perusahaanId,
        namaKontak: detailData.namaKontak ?? undefined,
        kontak: detailData.kontak ?? undefined,
        jumlahPeserta: detailData.jumlahPeserta,
        responMA: detailData.responMA,
      });
    }
  }, [detailData]);

  const handleOpenAdd = () => {
    setSelectedId(null);
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PengajuanListItem) => {
    setSelectedId(item.id);
    setSelectedItem({
      id: item.id,
      judulTraining: item.judulTraining,
      jumlahHari: item.jumlahHari,
      // Nilai identitas perusahaan (noInduk/teks manual) belum tersedia dari
      // list item — hanya nama tampilannya. Field ini akan langsung
      // ditimpa oleh detail fetch (usePengajuanById) begitu selesai load.
      perusahaanId: undefined,
      namaKontak: item.namaKontak ?? undefined,
      kontak: item.kontak ?? undefined,
      responMA: item.responMA ?? undefined,
      jumlahPeserta: item.jumlahPeserta,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (data: PengajuanJudulParsed) => {
    const payload = {
      judulTraining: data.judulTraining,
      jumlahHari: data.jumlahHari,
      perusahaanId: data.perusahaanId ?? undefined,
      namaKontak: data.namaKontak,
      kontak: data.kontak,
      jumlahPeserta: data.jumlahPeserta ?? undefined,
      responMA: data.responMA,
    };

    if (selectedItem?.id) {
      await update(selectedItem.id, payload, () => {
        setModalOpen(false);
        setSelectedId(null);
        refresh();
        setNotif({ message: "Pengajuan berhasil diperbarui", type: "success" });
      });
    } else {
      await create(payload, () => {
        setModalOpen(false);
        refresh();
        setNotif({
          message: "Pengajuan berhasil ditambahkan",
          type: "success",
        });
      });
    }
  };

  const columns: ColumnDef<PengajuanListItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_val, _row, index) => (
        <span className="text-zinc-400 font-medium">
          {(page - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      key: "judulTraining",
      label: "Judul Training",
      sortable: true,
      className: "max-w-[220px] whitespace-normal",
      render: (val) => (
        <span className="font-semibold text-zinc-700">{val as string}</span>
      ),
    },
    {
      key: "jumlahHari",
      label: "Jml Hari",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
    },
    {
      key: "perusahaan",
      label: "Perusahaan/Instansi",
      sortable: true,
      className: "max-w-[180px] whitespace-normal",
      render: (_val, row) => <span>{row.perusahaan ?? "-"}</span>,
    },
    {
      key: "namaKontak",
      label: "Nama Kontak",
      render: (val) => <span>{(val as string) || "-"}</span>,
    },
    {
      key: "kontak",
      label: "Kontak",
      render: (val) => <span>{(val as string) || "-"}</span>,
    },
    {
      key: "jumlahPeserta",
      label: "Jml Peserta",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (val) =>
        val != null ? (
          <span>{val as number}</span>
        ) : (
          <span className="text-zinc-300">-</span>
        ),
    },
    {
      key: "inputOleh",
      label: "Input By",
      render: (_val, row) => (
        <div>
          <p className="font-semibold text-zinc-700 text-[11px]">
            {row.inputOleh?.nama ?? "-"}
          </p>
          <p className="text-zinc-400 text-[10px]">
            {new Date(row.tanggalPengajuan).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "responMA",
      label: "Respons MA",
      render: (_val, row) => {
        const status = (_val as keyof typeof responMALabel) ?? "PENDING";
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${responMAColor[status]}`}
          >
            {row.responMA}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (_val, row) => (
        <button
          onClick={() => handleOpenEdit(row)}
          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training" },
        { label: "Pengajuan Judul Training" },
      ]}
      subtitle="Hari ini: Jumat, 10 April 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          totalData={pagination.total}
          currentPage={page}
          totalPages={pagination.totalPages}
          pageSize={10}
          onPageChange={setPage}
          searchPlaceholder="Cari judul, perusahaan, input by..."
          searchValue={search}
          onSearchChange={handleSearch}
          isLoading={loading}
          actionSlot={
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Pengajuan
            </button>
          }
        />

        <PengajuanJudulModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedId(null);
          }}
          initialData={selectedItem}
          onSubmit={handleSubmit}
          isLoading={creating || updating}
        />

        {notif && (
          <Notification
            message={notif.message}
            type={notif.type}
            onClose={() => setNotif(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
