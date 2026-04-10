"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";
import { Trainer } from "@/lib/types/trainer-types";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const trainerFormSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  kode: z.string().min(1, "Kode wajib diisi"),
  alamat: z.string().optional(),
  hp: z.string().optional(),
  email: z.string().optional(),
  kantor: z.string().optional(),
  alamatKantor: z.string().optional(),
  noTelpKantor: z.string().optional(),
  referensi: z.string().optional(),
  subyekKhusus: z.string().optional(),
  keterangan: z.string().optional(),
});

export type TrainerFormValues = z.infer<typeof trainerFormSchema>;

// ---------------------------------------------------------------------------
// Shared field components — same pattern as HotelModal
// ---------------------------------------------------------------------------

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
      {children}
      {optional && <span className="ml-1 font-normal text-zinc-400">(opsional)</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[10px] text-red-500">{message}</p>;
}

const inputCls =
  "w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300";

// ---------------------------------------------------------------------------
// Section heading used inside modals
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-emerald-600 border-b border-zinc-100 pb-1.5 mb-3">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Detail field for view modal
// ---------------------------------------------------------------------------

function DetailField({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-400 mb-0.5">{label}</p>
      <p className="text-xs text-zinc-700">{value ?? <span className="text-zinc-300">-</span>}</p>
    </div>
  );
}

// ===========================================================================
// 1. DETAIL (VIEW) MODAL
// ===========================================================================

interface TrainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  data: Trainer | null;
}

export function TrainerDetailModal({ open, onClose, onEdit, data }: TrainerDetailModalProps) {
  if (!open || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <p className="font-bold text-zinc-800 text-sm">Detail Trainer</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Identitas Diri */}
          <div>
            <SectionHeading>Identitas Diri</SectionHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Nama" value={`${data.nama} - ${data.kode}`} />
              <DetailField label="Referensi" value={data.referensi.join(", ") || "-"} />
              <DetailField label="Alamat" value={data.alamat} />
              <DetailField label="Subyek Khusus" value={data.subyekKhusus} />
              <DetailField label="Hp/Telp" value={data.hp} />
              <DetailField label="Keterangan" value={data.keterangan} />
              <DetailField label="Email" value={data.email} />
              <DetailField label="Tugas" value={data.tugas} />
            </div>
          </div>

          {/* Kantor */}
          <div>
            <SectionHeading>Kantor</SectionHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Kantor" value={data.kantor} />
              <DetailField label="Alamat Kantor" value={data.alamatKantor} />
              <DetailField label="No Telp Kantor" value={data.noTelpKantor} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// 2. EDIT / CREATE MODAL
// ===========================================================================

interface TrainerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TrainerFormValues) => Promise<void> | void;
  initialData?: Trainer | null;
  isLoading?: boolean;
}

export function TrainerFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TrainerFormModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      nama: "",
      kode: "",
      alamat: "",
      hp: "",
      email: "",
      kantor: "",
      alamatKantor: "",
      noTelpKantor: "",
      referensi: "",
      subyekKhusus: "",
      keterangan: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        nama: initialData?.nama ?? "",
        kode: initialData?.kode ?? "",
        alamat: initialData?.alamat ?? "",
        hp: initialData?.hp ?? "",
        email: initialData?.email ?? "",
        kantor: initialData?.kantor ?? "",
        alamatKantor: initialData?.alamatKantor ?? "",
        noTelpKantor: initialData?.noTelpKantor ?? "",
        referensi: initialData?.referensi?.join(", ") ?? "",
        subyekKhusus: initialData?.subyekKhusus ?? "",
        keterangan: initialData?.keterangan ?? "",
      });
    }
  }, [open, initialData, reset]);

  const onFormSubmit: Parameters<typeof handleSubmit>[0] = async (data) => {
    await onSubmit(data);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              {isEdit ? "Edit Data Trainer" : "Tambah Data Trainer"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk{" "}
              {isEdit ? "memperbarui" : "menambahkan"} data trainer.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="px-6 py-5 space-y-4">

            {/* Identitas Diri */}
            <SectionHeading>Identitas Diri</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Nama</FieldLabel>
                <input {...register("nama")} placeholder="Nama lengkap trainer" className={inputCls} />
                <FieldError message={errors.nama?.message} />
              </div>
              <div>
                <FieldLabel>Kode</FieldLabel>
                <input {...register("kode")} placeholder="Kode trainer" className={inputCls} />
                <FieldError message={errors.kode?.message} />
              </div>
            </div>

            <div>
              <FieldLabel optional>Alamat</FieldLabel>
              <textarea {...register("alamat")} placeholder="Alamat lengkap" rows={3} className={`${inputCls} resize-none`} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Hp/Telp</FieldLabel>
                <input {...register("hp")} placeholder="08XXXXXXXXXX" className={inputCls} />
              </div>
              <div>
                <FieldLabel optional>Email</FieldLabel>
                <input {...register("email")} placeholder="email@example.com" className={inputCls} />
              </div>
            </div>

            {/* Kantor */}
            <SectionHeading>Kantor</SectionHeading>

            <div>
              <FieldLabel optional>Kantor</FieldLabel>
              <input {...register("kantor")} placeholder="Nama kantor / kota" className={inputCls} />
            </div>

            <div>
              <FieldLabel optional>Alamat Kantor</FieldLabel>
              <textarea {...register("alamatKantor")} placeholder="Alamat kantor" rows={2} className={`${inputCls} resize-none`} />
            </div>

            <div>
              <FieldLabel optional>No Telp Kantor</FieldLabel>
              <input {...register("noTelpKantor")} placeholder="(021) XXXXXX" className={inputCls} />
            </div>

            <div>
              <FieldLabel optional>Referensi</FieldLabel>
              <input {...register("referensi")} placeholder="EP-19, EP-67" className={inputCls} />
            </div>

            <div>
              <FieldLabel optional>Subyek Khusus</FieldLabel>
              <input {...register("subyekKhusus")} placeholder="Masukkan subyek khusus" className={inputCls} />
            </div>

            <div>
              <FieldLabel optional>Keterangan</FieldLabel>
              <textarea {...register("keterangan")} placeholder="Masukkan subyek khusus" rows={3} className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}