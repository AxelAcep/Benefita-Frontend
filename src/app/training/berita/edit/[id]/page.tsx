"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Newspaper } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const beritaSchema = z.object({
  periode: z.string().min(1, "Periode / Batas wajib diisi"),
  isi: z.string().min(1, "Isi berita wajib diisi"),
  status: z.enum(["Aktif", "Tidak Aktif"]).optional(),
});

type BeritaFormValues = z.infer<typeof beritaSchema>;

// ---------------------------------------------------------------------------
// Field components
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
  "w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300 bg-white";

const selectCls = `${inputCls} appearance-none cursor-pointer`;

const STATUS_OPTIONS = ["Aktif", "Tidak Aktif"] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  initialData?: Partial<BeritaFormValues>;
  isEdit?: boolean;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TambahEditBeritaPage({ initialData, isEdit = false }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BeritaFormValues>({
    resolver: zodResolver(beritaSchema),
    defaultValues: {
      periode: initialData?.periode ?? "",
      isi: initialData?.isi ?? "",
      status: initialData?.status ?? "Aktif",
    },
  });

  const onSubmit = async (data: BeritaFormValues) => {
    // TODO: replace with actual API call
    console.log("submit", data);
    router.push("/training/manajemen-berita");
  };

  const onFormSubmit: Parameters<typeof handleSubmit>[0] = async (data) => {
    await onSubmit(data);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Berita", href: "/training/manajemen-berita" },
        { label: isEdit ? "Edit Berita" : "Tambah Berita" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              Form Pengajuan Berita
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Lengkapi data pengajuan di bawah ini</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="px-6 py-6 space-y-5">

            {/* Section label */}
            <p className="text-xs font-semibold text-zinc-700">Detail Pengajuan</p>

            {/* Periode / Batas */}
            <div>
              <FieldLabel>Periode / Batas</FieldLabel>
              <div className="relative">
                <input
                  {...register("periode")}
                  type="date"
                  placeholder="dd/mm/yyyy"
                  className={inputCls}
                />
              </div>
              <FieldError message={errors.periode?.message} />
            </div>

            {/* Isi */}
            <div>
              <FieldLabel>Isi</FieldLabel>
              <textarea
                {...register("isi")}
                rows={5}
                placeholder="Masukkan deskripsi berita"
                className={`${inputCls} resize-none`}
              />
              <FieldError message={errors.isi?.message} />
            </div>

            {/* Status — hanya tampil saat edit */}
            {isEdit && (
              <div>
                <FieldLabel optional>Status</FieldLabel>
                <div className="relative">
                  <select {...register("status")} className={selectCls}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.push("/training/manajemen-berita")}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[130px] justify-center"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}