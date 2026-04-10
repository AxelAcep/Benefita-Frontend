"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const pengajuanJudulSchema = z.object({
  judulTraining: z.string().min(1, "Judul training wajib diisi"),
  jmlHari: z
    .string()
    .min(1, "Jumlah hari wajib diisi")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Jumlah hari tidak boleh negatif"),
  perusahaan: z.string().optional(),
  namaKontak: z.string().optional(),
  kontak: z.string().optional(),
  jmlPeserta: z.string().optional(),
});

export type PengajuanJudulFormValues = z.infer<typeof pengajuanJudulSchema>;

// Parsed output untuk dikirim ke API / parent
export interface PengajuanJudulParsed {
  judulTraining: string;
  jmlHari: number;
  perusahaan?: string;
  namaKontak?: string;
  kontak?: string;
  jmlPeserta?: number | null;
}

export interface PengajuanJudulData {
  id?: number;
  judulTraining: string;
  jmlHari: number;
  perusahaan?: string;
  namaKontak?: string;
  kontak?: string;
  jmlPeserta?: number | null;
}

interface PengajuanJudulModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PengajuanJudulParsed) => Promise<void> | void;
  initialData?: PengajuanJudulData | null;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Small reusable field components (same as HotelModal)
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
// Component
// ---------------------------------------------------------------------------

export function PengajuanJudulModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: PengajuanJudulModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PengajuanJudulFormValues>({
    resolver: zodResolver(pengajuanJudulSchema),
    defaultValues: {
      judulTraining: "",
      jmlHari: "",
      perusahaan: "",
      namaKontak: "",
      kontak: "",
      jmlPeserta: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        judulTraining: initialData?.judulTraining ?? "",
        jmlHari: initialData?.jmlHari != null ? String(initialData.jmlHari) : "",
        perusahaan: initialData?.perusahaan ?? "",
        namaKontak: initialData?.namaKontak ?? "",
        kontak: initialData?.kontak ?? "",
        jmlPeserta: initialData?.jmlPeserta != null ? String(initialData.jmlPeserta) : "",
      });
    }
  }, [open, initialData, reset]);

  // handleSubmit callback typed ke PengajuanJudulFormValues (raw string dari form),
  // parse ke number di sini sebelum naik ke parent via onSubmit prop
  const onFormSubmit: Parameters<typeof handleSubmit>[0] = async (data) => {
    const parsed: PengajuanJudulParsed = {
      judulTraining: data.judulTraining,
      jmlHari: Number(data.jmlHari),
      perusahaan: data.perusahaan,
      namaKontak: data.namaKontak,
      kontak: data.kontak,
      jmlPeserta: data.jmlPeserta ? Number(data.jmlPeserta) : null,
    };
    await onSubmit(parsed);
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
              {isEdit ? "Edit Pengajuan Judul Training" : "Tambah Pengajuan Judul Training"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk{" "}
              {isEdit ? "memperbarui" : "menambahkan"} pengajuan judul training.
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

            {/* Judul Training */}
            <div>
              <FieldLabel>Judul Lengkap</FieldLabel>
              <input
                {...register("judulTraining")}
                placeholder="Masukkan judul lengkap training..."
                className={inputCls}
              />
              <FieldError message={errors.judulTraining?.message} />
            </div>

            {/* Jumlah Hari + Perusahaan */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Jumlah Hari</FieldLabel>
                <input
                  {...register("jmlHari")}
                  type="number"
                  min={0}
                  placeholder="Misal: 3"
                  className={inputCls}
                />
                <FieldError message={errors.jmlHari?.message} />
              </div>
              <div>
                <FieldLabel optional>Perusahaan/Instansi</FieldLabel>
                <input
                  {...register("perusahaan")}
                  placeholder="Nama perusahaan/instansi"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Nama Kontak + Kontak */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Nama Kontak</FieldLabel>
                <input
                  {...register("namaKontak")}
                  placeholder="Nama PIC"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel optional>Kontak</FieldLabel>
                <input
                  {...register("kontak")}
                  placeholder="No. Telp"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Jumlah Peserta */}
            <div>
              <FieldLabel optional>Jumlah Peserta</FieldLabel>
              <input
                {...register("jmlPeserta")}
                type="number"
                min={0}
                placeholder="Estimasi peserta"
                className={inputCls}
              />
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
              Batal
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

export default PengajuanJudulModal;