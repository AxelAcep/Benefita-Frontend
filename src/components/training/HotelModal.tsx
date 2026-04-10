"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const hotelFormSchema = z.object({
  kodeHotel: z.string().min(1, "Kode hotel wajib diisi"),
  namaHotel: z.string().min(1, "Nama hotel wajib diisi"),
  alamatHotel: z.string().min(1, "Alamat hotel wajib diisi"),
  kota: z.string().min(1, "Kota wajib dipilih"),
  telepon: z.string().min(1, "Nomor telepon wajib diisi"),
  fax: z.string().optional(),
  pubRate: z.string().optional(),
  corporate: z.string().optional(),
});

export type HotelFormValues = z.infer<typeof hotelFormSchema>;

export interface HotelData extends HotelFormValues {
  id?: number;
}

interface HotelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HotelFormValues) => Promise<void> | void;
  initialData?: HotelData | null;
  isLoading?: boolean;
}

const KOTA_OPTIONS = [
  "Bandung",
  "Jakarta",
  "Yogyakarta",
  "Surabaya",
  "Medan",
  "Bali",
  "Semarang",
  "Makassar",
];

// ---------------------------------------------------------------------------
// Small reusable field components (no shadcn form, pure HTML to match style)
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

export function HotelModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: HotelModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      kodeHotel: "",
      namaHotel: "",
      alamatHotel: "",
      kota: "",
      telepon: "",
      fax: "",
      pubRate: "",
      corporate: "",
    },
  });

  const kotaValue = watch("kota");

  useEffect(() => {
    if (open) {
      reset({
        kodeHotel: initialData?.kodeHotel ?? "",
        namaHotel: initialData?.namaHotel ?? "",
        alamatHotel: initialData?.alamatHotel ?? "",
        kota: initialData?.kota ?? "",
        telepon: initialData?.telepon ?? "",
        fax: initialData?.fax ?? "",
        pubRate: initialData?.pubRate ?? "",
        corporate: initialData?.corporate ?? "",
      });
    }
  }, [open, initialData, reset]);

  const onFormSubmit = async (data: HotelFormValues) => {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              {isEdit ? "Edit Data Hotel" : "Tambah Data Hotel"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Lengkapi formulir di bawah ini untuk{" "}
              {isEdit ? "memperbarui" : "menambahkan"} informasi hotel.
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

            {/* Kode + Nama */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Kode Hotel</FieldLabel>
                <input
                  {...register("kodeHotel")}
                  placeholder="Masukkan kode hotel"
                  className={inputCls}
                />
                <FieldError message={errors.kodeHotel?.message} />
              </div>
              <div>
                <FieldLabel>Nama Hotel</FieldLabel>
                <input
                  {...register("namaHotel")}
                  placeholder="Masukkan nama hotel"
                  className={inputCls}
                />
                <FieldError message={errors.namaHotel?.message} />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <FieldLabel>Alamat Hotel</FieldLabel>
              <textarea
                {...register("alamatHotel")}
                placeholder="Masukkan alamat hotel"
                rows={3}
                className={`${inputCls} resize-none`}
              />
              <FieldError message={errors.alamatHotel?.message} />
            </div>

            {/* Kota */}
            <div>
              <FieldLabel>Kota</FieldLabel>
              <select
                value={kotaValue}
                onChange={(e) => setValue("kota", e.target.value, { shouldValidate: true })}
                className={`${inputCls} bg-white`}
              >
                <option value="">Pilih kota</option>
                {KOTA_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <FieldError message={errors.kota?.message} />
            </div>

            {/* Telepon + Fax */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Telepon</FieldLabel>
                <input
                  {...register("telepon")}
                  placeholder="021-XXXXX"
                  className={inputCls}
                />
                <FieldError message={errors.telepon?.message} />
              </div>
              <div>
                <FieldLabel optional>Fax</FieldLabel>
                <input
                  {...register("fax")}
                  placeholder="021-XXXXX"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Pub Rate + Corporate */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Pub. Rate (Rp)</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 font-semibold pointer-events-none">
                    Rp
                  </span>
                  <input
                    {...register("pubRate")}
                    placeholder="Masukkan nominal"
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </div>
              <div>
                <FieldLabel optional>Corporate (Rp)</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 font-semibold pointer-events-none">
                    Rp
                  </span>
                  <input
                    {...register("corporate")}
                    placeholder="Masukkan nominal"
                    className={`${inputCls} pl-8`}
                  />
                </div>
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

export default HotelModal;