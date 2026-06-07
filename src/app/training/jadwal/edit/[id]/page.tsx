"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, CalendarDays, Paperclip, X, Trash2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { JudulTrainingSelect } from "@/components/base/JudulTrainingSelect";
import { TrainerSelect } from "@/components/base/TrainerSelect";
import {
  useJadwalTrainingDetail,
  useJadwalTrainingMutation,
} from "@/hooks/use-jadwal-training";
import Notification from "@/components/base/notifications";

// ─────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────

const jadwalSchema = z.object({
  noJadwal: z.string().min(1, "No. Jadwal wajib diisi"),
  kodePelatihan: z.string().min(1, "Kode pelatihan wajib dipilih"),
  tglMulai: z.string().optional(),
  tglSelesai: z.string().optional(),
  judulLengkap: z.string().optional(),
  judulPendek: z.string().optional(),
  metode: z.string().optional(),
  jenisTraining: z.string().optional(),
  kota: z.string().optional(),
  lokasiDetail: z.string().optional(),
  biaya: z.string().optional(),
  trainerKodes: z.array(z.string()).optional(),
  status: z.string().optional(),
  catatan: z.string().optional(),
});

type JadwalFormValues = z.infer<typeof jadwalSchema>;

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const METODE_OPTIONS = ["Online", "Offline", "Hybrid"];
const JENIS_OPTIONS = [
  "REG",
  "Regular",
  "Refreshment",
  "In House",
  "Uji Kompetensi",
  "Konsultasi",
];
const STATUS_JADWAL_OPTIONS = [
  "R - Rencana",
  "C - Confirmed",
  "D - Done",
  "X - Cancel",
];

// ─────────────────────────────────────────────
// FIELD HELPERS
// ─────────────────────────────────────────────

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
  "w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300 bg-white";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ─────────────────────────────────────────────
// CONFIRM DELETE MODAL
// ─────────────────────────────────────────────

function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-800">
              Hapus Jadwal Training
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-600 mb-5">
          Apakah Anda yakin ingin menghapus jadwal training ini? Semua data
          terkait termasuk trainer yang terdaftar akan ikut terhapus.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function EditJadwalTrainingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileAgenda, setFileAgenda] = useState<File | null>(null);
  const [existingFileAgenda, setExistingFileAgenda] = useState<string | null>(
    null,
  );
  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { id } = useParams<{ id: string }>();

  // ── Detail hook ───────────────────────────
  const {
    data,
    isLoading: isLoadingDetail,
    fetch: fetchDetail,
  } = useJadwalTrainingDetail();

  // ── Form ──────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JadwalFormValues>({
    resolver: zodResolver(jadwalSchema),
    defaultValues: {
      noJadwal: "",
      kodePelatihan: "",
      tglMulai: "",
      tglSelesai: "",
      judulLengkap: "",
      judulPendek: "",
      metode: "",
      jenisTraining: "",
      kota: "",
      lokasiDetail: "",
      biaya: "",
      trainerKodes: [],
      status: "",
      catatan: "",
    },
  });

  // ── Fetch detail & populate form ──────────
  useEffect(() => {
    fetchDetail(id);
  }, [id]);

  useEffect(() => {
    if (!data) return;
    reset({
      noJadwal: data.noJadwal,
      kodePelatihan: data.kodePelatihan,
      tglMulai: data.tglMulai ? data.tglMulai.slice(0, 10) : "",
      tglSelesai: data.tglSelesai ? data.tglSelesai.slice(0, 10) : "",
      judulLengkap: data.judulLengkap,
      judulPendek: data.judulPendek,
      metode: data.metode,
      jenisTraining: data.jenisTraining,
      kota: data.kota,
      lokasiDetail: data.lokasiDetail ?? "",
      biaya: data.biaya ? String(data.biaya) : "",
      trainerKodes: data.trainers.map((t) => t.trainer.kode),
      status: data.status,
      catatan: data.catatan ?? "",
    });
    setExistingFileAgenda(data.fileAgenda ?? null);
  }, [data, reset]);

  // ── Mutation hook ─────────────────────────
  const {
    handleUpdate,
    handleDelete,
    isLoading: isMutating,
  } = useJadwalTrainingMutation({
    onSuccess: () => {
      setNotif({
        message: confirmDelete
          ? "Jadwal Training berhasil dihapus."
          : "Jadwal Training berhasil diperbarui.",
        type: "success",
      });
      setTimeout(() => router.push("/training/jadwal"), 1500);
    },
    onError: (msg) => {
      setNotif({ message: msg, type: "error" });
      setConfirmDelete(false);
    },
  });

  // ── Submit update ─────────────────────────
  const onSubmit = async (values: JadwalFormValues) => {
    await handleUpdate(id, {
      noJadwal: values.noJadwal,
      kodePelatihan: values.kodePelatihan,
      tglMulai: values.tglMulai || null,
      tglSelesai: values.tglSelesai || null,
      judulLengkap: values.judulLengkap || "",
      judulPendek: values.judulPendek || "",
      metode: values.metode || "",
      jenisTraining: values.jenisTraining || "",
      kota: values.kota || "",
      lokasiDetail: values.lokasiDetail || null,
      biaya: values.biaya ? parseInt(values.biaya.replace(/\D/g, "")) : 0,
      trainerKodes: values.trainerKodes ?? [],
      status: values.status || "R - Rencana",
      catatan: values.catatan || null,
      fileAgenda: fileAgenda ?? null,
    });
  };

  // ── Confirm delete ────────────────────────
  const onConfirmDelete = async () => {
    await handleDelete(id);
  };

  // ── Loading state ─────────────────────────
  if (isLoadingDetail) {
    return (
      <AppLayout
        breadcrumbs={[
          { label: "Training", href: "/training" },
          {
            label: "Manajemen Jadwal Training",
            href: "/training/jadwal",
          },
          { label: "Edit Jadwal" },
        ]}
        subtitle="Hari ini: Selasa, 3 Februari 2026"
        userName="Nanang"
        userRole="Super Admin"
      >
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        {
          label: "Manajemen Jadwal Training",
          href: "/training/jadwal",
        },
        { label: "Edit Jadwal" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
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

      <ConfirmDeleteModal
        isOpen={confirmDelete}
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete(false)}
        isLoading={isMutating}
      />

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              Edit Jadwal Training
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Ubah informasi jadwal training
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6 space-y-5">
            {/* No. Jadwal + Kode Pelatihan */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>No. Jadwal</FieldLabel>
                <input
                  {...register("noJadwal")}
                  placeholder="Contoh: 2026142"
                  className={inputCls}
                />
                <FieldError message={errors.noJadwal?.message} />
              </div>
              <div>
                <FieldLabel>Kode Pelatihan</FieldLabel>
                <Controller
                  name="kodePelatihan"
                  control={control}
                  render={({ field }) => (
                    <JudulTrainingSelect
                      value={field.value}
                      onChange={(kode) => field.onChange(kode)}
                      error={errors.kodePelatihan?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Tgl Mulai + Tgl Selesai */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Tgl. Mulai</FieldLabel>
                <input
                  {...register("tglMulai")}
                  type="date"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel optional>Tgl. Selesai</FieldLabel>
                <input
                  {...register("tglSelesai")}
                  type="date"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Judul Lengkap */}
            <div>
              <FieldLabel optional>Judul Lengkap</FieldLabel>
              <input
                {...register("judulLengkap")}
                placeholder="Masukkan judul lengkap training"
                className={inputCls}
              />
            </div>

            {/* Judul Pendek + Metode */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Judul Pendek</FieldLabel>
                <input
                  {...register("judulPendek")}
                  placeholder="Masukkan judul pendek"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel optional>Metode</FieldLabel>
                <div className="relative">
                  <select {...register("metode")} className={selectCls}>
                    <option value="">Pilih Metode</option>
                    {METODE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                    ▾
                  </span>
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
                    {JENIS_OPTIONS.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                    ▾
                  </span>
                </div>
              </div>
              <div>
                <FieldLabel optional>Kota</FieldLabel>
                <input
                  {...register("kota")}
                  placeholder="Contoh: Bandung"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Lokasi + Biaya */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Lokasi / Hotel / LSP</FieldLabel>
                <input
                  {...register("lokasiDetail")}
                  placeholder="Masukkan lokasi"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel optional>Biaya (Rupiah)</FieldLabel>
                <input
                  {...register("biaya")}
                  placeholder="Contoh: 5900000"
                  inputMode="numeric"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Trainer */}
            <div>
              <FieldLabel optional>Trainer</FieldLabel>
              <Controller
                name="trainerKodes"
                control={control}
                render={({ field }) => (
                  <TrainerSelect
                    value={field.value ?? []}
                    onChange={(kodes) => field.onChange(kodes)}
                    error={errors.trainerKodes?.message}
                  />
                )}
              />
            </div>

            {/* Status Jadwal */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Status Jadwal</FieldLabel>
                <div className="relative">
                  <select {...register("status")} className={selectCls}>
                    <option value="">Pilih Status</option>
                    {STATUS_JADWAL_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                    ▾
                  </span>
                </div>
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

              {existingFileAgenda && !fileAgenda && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <Paperclip className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-xs text-zinc-500 truncate flex-1">
                    File agenda terpasang
                  </span>

                  <a
                    href={
                      existingFileAgenda.startsWith("http")
                        ? existingFileAgenda
                        : `${process.env.NEXT_PUBLIC_API_URL}/${existingFileAgenda}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-500 hover:text-emerald-700 font-medium shrink-0"
                  >
                    Lihat
                  </a>
                </div>
              )}

              {fileAgenda ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-emerald-700 truncate flex-1">
                    {fileAgenda.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFileAgenda(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-zinc-300 rounded-xl px-3 py-3 text-xs text-zinc-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  {existingFileAgenda
                    ? "Ganti file agenda"
                    : "Upload file agenda (PDF / DOC / XLS)"}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={(e) => setFileAgenda(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-zinc-100">
            {/* Delete */}
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={isSubmitting || isMutating}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Jadwal
            </button>

            {/* Batal + Simpan */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/training/jadwal")}
                disabled={isSubmitting || isMutating}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isMutating}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
              >
                <Save className="w-3.5 h-3.5" />
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/input/${id}`)}
                disabled={isSubmitting || isMutating}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
              >
                <Save className="w-3.5 h-3.5" />
                {isSubmitting ? "Menyimpan..." : "Input Data"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
