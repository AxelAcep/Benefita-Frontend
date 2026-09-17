"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";
import { JENIS_AKUN_OPTIONS, type JenisAkun } from "@/lib/services/accounting.service";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const akunFormSchema = z.object({
  kode: z.string().optional(),
  nama: z.string().min(1, "Nama akun wajib diisi"),
  jenis: z.enum([...JENIS_AKUN_OPTIONS], {
    error: "Jenis akun wajib dipilih",
  }),
  saldoAwal: z.string().optional(),
  isKasBank: z.boolean().optional(),
});

export type AkunFormValues = z.infer<typeof akunFormSchema>;

export interface AkunData extends AkunFormValues {
  id?: number;
}

interface AkunModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AkunFormValues) => Promise<void> | void;
  initialData?: AkunData | null;
  isLoading?: boolean;
}

const JENIS_LABEL: Record<JenisAkun, string> = {
  ASET: "Aset",
  LIABILITAS: "Liabilitas",
  MODAL: "Modal",
  PENDAPATAN: "Pendapatan",
  BEBAN: "Beban",
};

// ---------------------------------------------------------------------------
// Small reusable field components (samain gaya sama TUKModal/HotelModal)
// ---------------------------------------------------------------------------

function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
      {children}
      {optional && (
        <span className="ml-1 font-normal text-zinc-400">(opsional)</span>
      )}
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

export function AkunModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: AkunModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AkunFormValues>({
    resolver: zodResolver(akunFormSchema),
    defaultValues: {
      kode: "",
      nama: "",
      jenis: "ASET",
      saldoAwal: "",
      isKasBank: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        kode: initialData?.kode ?? "",
        nama: initialData?.nama ?? "",
        jenis: initialData?.jenis ?? "ASET",
        saldoAwal: initialData?.saldoAwal ?? "",
        isKasBank: initialData?.isKasBank ?? false,
      });
    }
  }, [open, initialData, reset]);

  const onFormSubmit = async (data: AkunFormValues) => {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              {isEdit ? "Edit Akun" : "Tambah Akun"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk{" "}
              {isEdit ? "memperbarui" : "menambahkan"} akun.
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Kode Akun</FieldLabel>
                <input
                  {...register("kode")}
                  placeholder="Contoh: 1-1001"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel>Jenis Akun</FieldLabel>
                <select {...register("jenis")} className={`${inputCls} bg-white`}>
                  {JENIS_AKUN_OPTIONS.map((j) => (
                    <option key={j} value={j}>
                      {JENIS_LABEL[j]}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.jenis?.message} />
              </div>
            </div>

            <div>
              <FieldLabel>Nama Akun</FieldLabel>
              <input
                {...register("nama")}
                placeholder="Masukkan nama akun"
                className={inputCls}
              />
              <FieldError message={errors.nama?.message} />
            </div>

            <div>
              <FieldLabel optional>Saldo Awal (Rp)</FieldLabel>
              <input
                {...register("saldoAwal")}
                inputMode="numeric"
                placeholder="0"
                className={inputCls}
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
              <input
                type="checkbox"
                {...register("isKasBank")}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-400"
              />
              Tandai sebagai akun Kas &amp; Bank
            </label>
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

export default AkunModal;
