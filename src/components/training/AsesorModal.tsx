"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const asesorFormSchema = z.object({
  nama: z.string().min(1, "Nama asesor wajib diisi"),
  noRegAsesor: z.string().optional(),
});

export type AsesorFormValues = z.infer<typeof asesorFormSchema>;

export interface AsesorData extends AsesorFormValues {
  id?: number;
}

interface AsesorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AsesorFormValues) => Promise<void> | void;
  initialData?: AsesorData | null;
  isLoading?: boolean;
}

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

export function AsesorModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: AsesorModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AsesorFormValues>({
    resolver: zodResolver(asesorFormSchema),
    defaultValues: {
      nama: "",
      noRegAsesor: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        nama: initialData?.nama ?? "",
        noRegAsesor: initialData?.noRegAsesor ?? "",
      });
    }
  }, [open, initialData, reset]);

  const onFormSubmit = async (data: AsesorFormValues) => {
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
              {isEdit ? "Edit Data Asesor" : "Tambah Data Asesor"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk{" "}
              {isEdit ? "memperbarui" : "menambahkan"} data asesor.
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
            <div>
              <FieldLabel>Nama Asesor</FieldLabel>
              <input
                {...register("nama")}
                placeholder="Masukkan nama asesor"
                className={inputCls}
              />
              <FieldError message={errors.nama?.message} />
            </div>

            <div>
              <FieldLabel optional>No Reg Asesor</FieldLabel>
              <input
                {...register("noRegAsesor")}
                placeholder="Masukkan No Reg Asesor"
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

export default AsesorModal;
