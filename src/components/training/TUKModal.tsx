"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const tukFormSchema = z.object({
  noSK: z.string().min(1, "No SK wajib diisi"),
  noPenetapan: z.string().optional(),
  tglSanggup: z.string().optional(),
  nama: z.string().min(1, "Nama TUK wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  telp: z.string().optional(),
});

export type TUKFormValues = z.infer<typeof tukFormSchema>;

export interface TUKData extends TUKFormValues {
  id?: number;
}

interface TUKModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TUKFormValues) => Promise<void> | void;
  initialData?: TUKData | null;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Small reusable field components (samain gaya sama HotelModal)
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

export function TUKModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TUKModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUKFormValues>({
    resolver: zodResolver(tukFormSchema),
    defaultValues: {
      noSK: "",
      noPenetapan: "",
      tglSanggup: "",
      nama: "",
      alamat: "",
      telp: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        noSK: initialData?.noSK ?? "",
        noPenetapan: initialData?.noPenetapan ?? "",
        tglSanggup: initialData?.tglSanggup ?? "",
        nama: initialData?.nama ?? "",
        alamat: initialData?.alamat ?? "",
        telp: initialData?.telp ?? "",
      });
    }
  }, [open, initialData, reset]);

  const onFormSubmit = async (data: TUKFormValues) => {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              {isEdit ? "Edit Data TUK" : "Tambah Data TUK"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk{" "}
              {isEdit ? "memperbarui" : "menambahkan"} data Tempat Uji
              Kompetensi.
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
            {/* No SK + No Penetapan */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>No SK</FieldLabel>
                <input
                  {...register("noSK")}
                  placeholder="Masukkan No SK"
                  className={inputCls}
                />
                <FieldError message={errors.noSK?.message} />
              </div>
              <div>
                <FieldLabel optional>No Penetapan</FieldLabel>
                <input
                  {...register("noPenetapan")}
                  placeholder="Masukkan No Penetapan"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Nama TUK */}
            <div>
              <FieldLabel>Nama TUK</FieldLabel>
              <input
                {...register("nama")}
                placeholder="Masukkan nama TUK"
                className={inputCls}
              />
              <FieldError message={errors.nama?.message} />
            </div>

            {/* Alamat */}
            <div>
              <FieldLabel>Alamat</FieldLabel>
              <textarea
                {...register("alamat")}
                placeholder="Masukkan alamat TUK"
                rows={3}
                className={`${inputCls} resize-none`}
              />
              <FieldError message={errors.alamat?.message} />
            </div>

            {/* Telp + Tgl Kesanggupan */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Telp</FieldLabel>
                <input
                  {...register("telp")}
                  placeholder="021-XXXXX"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel optional>Tgl Kesanggupan</FieldLabel>
                <input
                  type="date"
                  {...register("tglSanggup")}
                  className={inputCls}
                />
              </div>
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

export default TUKModal;
