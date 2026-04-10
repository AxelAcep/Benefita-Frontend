"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, CalendarDays, Upload } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const jadwalSchema = z.object({
  noJadwal: z.string().min(1, "No. Jadwal wajib diisi"),
  kode: z.string().min(1, "Kode wajib dipilih"),
  tglMulai: z.string().optional(),
  tglSelesai: z.string().optional(),
  judulLengkap: z.string().optional(),
  judulPendek: z.string().optional(),
  metode: z.string().optional(),
  jenisTraining: z.string().optional(),
  kota: z.string().optional(),
  lokasi: z.string().optional(),
  biaya: z.string().optional(),
  namaTrainer: z.string().optional(),
  statusTrainer: z.string().optional(),
  statusJadwal: z.string().optional(),
  updateOleh: z.string().optional(),
  catatan: z.string().optional(),
  fileAgenda: z.string().optional(),
});

type JadwalFormValues = z.infer<typeof jadwalSchema>;

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

const KODE_OPTIONS = ["WM-01", "K3-01", "K3-02", "ENV-01", "HR-05", "CSR-01", "CSR-02"];
const JUDUL_LENGKAP_OPTIONS = ["PPPA", "Ahli K3 Umum Sertifikasi Kemnaker RI", "ISO 14001:2015", "Effective Leadership & People Management"];
const JUDUL_PENDEK_OPTIONS = ["PPPA", "K3 Umum", "ISO 14001", "Leadership"];
const METODE_OPTIONS = ["Online", "Offline", "Hybrid"];
const JENIS_OPTIONS = ["REG", "IHT", "Inhouse"];
const STATUS_JADWAL_OPTIONS = ["R - Rencana", "C - Confirmed", "D - Done", "X - Cancel"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Props {
  initialData?: Partial<JadwalFormValues>;
  isEdit?: boolean;
}

export default function TambahJadwalTrainingPage({ initialData, isEdit = false }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JadwalFormValues>({
    resolver: zodResolver(jadwalSchema),
    defaultValues: {
      noJadwal: initialData?.noJadwal ?? "2026142",
      kode: initialData?.kode ?? "",
      tglMulai: initialData?.tglMulai ?? "",
      tglSelesai: initialData?.tglSelesai ?? "",
      judulLengkap: initialData?.judulLengkap ?? "",
      judulPendek: initialData?.judulPendek ?? "",
      metode: initialData?.metode ?? "",
      jenisTraining: initialData?.jenisTraining ?? "",
      kota: initialData?.kota ?? "",
      lokasi: initialData?.lokasi ?? "",
      biaya: initialData?.biaya ?? "",
      namaTrainer: initialData?.namaTrainer ?? "",
      statusTrainer: initialData?.statusTrainer ?? "",
      statusJadwal: initialData?.statusJadwal ?? "",
      updateOleh: initialData?.updateOleh ?? "nanang 12-01-2026",
      catatan: initialData?.catatan ?? "",
      fileAgenda: initialData?.fileAgenda ?? "",
    },
  });

  const onSubmit = async (data: JadwalFormValues) => {
    // TODO: replace with actual API call
    console.log("submit", data);
    router.push("/training/manajemen-jadwal-training");
  };

  const onFormSubmit: Parameters<typeof handleSubmit>[0] = async (data) => {
    await onSubmit(data);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Jadwal Training", href: "/training/manajemen-jadwal-training" },
        { label: isEdit ? "Edit Jadwal" : "Tambah Jadwal" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              {isEdit ? "Edit Jadwal Training" : "Tambah Jadwal Training"}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Lengkapi informasi di bawah ini</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="px-6 py-6 space-y-5">

            {/* No. Jadwal + Kode */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>No. Jadwal</FieldLabel>
                <input {...register("noJadwal")} placeholder="No. Jadwal" className={inputCls} />
                <FieldError message={errors.noJadwal?.message} />
              </div>
              <div>
                <FieldLabel>Kode</FieldLabel>
                <div className="relative">
                  <select {...register("kode")} className={selectCls}>
                    <option value="">Pilih Kode</option>
                    {KODE_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
                <FieldError message={errors.kode?.message} />
              </div>
            </div>

            {/* Tgl Mulai + Tgl Selesai */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Tgl. Mulai</FieldLabel>
                <div className="relative">
                  <input {...register("tglMulai")} type="date" className={inputCls} />
                </div>
              </div>
              <div>
                <FieldLabel optional>Tgl. Selesai</FieldLabel>
                <div className="relative">
                  <input {...register("tglSelesai")} type="date" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Judul Lengkap */}
            <div>
              <FieldLabel optional>Judul Lengkap</FieldLabel>
              <div className="relative">
                <select {...register("judulLengkap")} className={selectCls}>
                  <option value="">Pilih Judul Lengkap</option>
                  {JUDUL_LENGKAP_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
              </div>
            </div>

            {/* Judul Pendek + Metode */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Judul Pendek</FieldLabel>
                <div className="relative">
                  <select {...register("judulPendek")} className={selectCls}>
                    <option value="">Pilih Judul Pendek</option>
                    {JUDUL_PENDEK_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>
              <div>
                <FieldLabel optional>Metode</FieldLabel>
                <div className="relative">
                  <select {...register("metode")} className={selectCls}>
                    <option value="">Pilih Metode</option>
                    {METODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>
            </div>

            {/* Jenis Training + Kota */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Jenis Training</FieldLabel>
                <div className="relative">
                  <select {...register("jenisTraining")} className={selectCls}>
                    <option value="">Pilih Jenis Training</option>
                    {JENIS_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>
              <div>
                <FieldLabel optional>Kota</FieldLabel>
                <input {...register("kota")} placeholder="Bandung" className={inputCls} />
              </div>
            </div>

            {/* Lokasi/Hotel/LSP + Biaya */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Lokasi/Hotel/LSP</FieldLabel>
                <input {...register("lokasi")} placeholder="Bandung" className={inputCls} />
              </div>
              <div>
                <FieldLabel optional>Biaya (Rupiah)</FieldLabel>
                <input {...register("biaya")} placeholder="5.900.000" className={inputCls} />
              </div>
            </div>

            {/* Nama Trainer + Status Trainer */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Nama Trainer</FieldLabel>
                <input {...register("namaTrainer")} placeholder="Masukkan nama trainer" className={inputCls} />
              </div>
              <div>
                <FieldLabel optional>Status Trainer</FieldLabel>
                <input {...register("statusTrainer")} placeholder="Masukkan status trainer" className={inputCls} />
              </div>
            </div>

            {/* Status Jadwal + Update Oleh */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Status Jadwal</FieldLabel>
                <div className="relative">
                  <select {...register("statusJadwal")} className={selectCls}>
                    <option value="">Pilih Status Jadwal</option>
                    {STATUS_JADWAL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>
              <div>
                <FieldLabel optional>Update Oleh</FieldLabel>
                <input {...register("updateOleh")} className={inputCls} readOnly />
              </div>
            </div>

            {/* Catatan */}
            <div>
              <FieldLabel optional>Catatan</FieldLabel>
              <textarea
                {...register("catatan")}
                rows={4}
                placeholder="Ketik catatan"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* File Agenda */}
            <div>
              <FieldLabel optional>File Agenda</FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  {...register("fileAgenda")}
                  placeholder="Masukkan file agenda"
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                >
                  Display Agenda
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.push("/training/manajemen-jadwal-training")}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}