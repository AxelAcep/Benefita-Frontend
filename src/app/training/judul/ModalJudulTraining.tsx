"use client";

import React, { useState, useEffect, useRef } from "react";
import { Paperclip, X } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface JudulTrainingFormData {
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number | "";
  biayaOffline: number | "";
  biayaOnline: number | "";
  batch: number | "";
  brosur: File | null;
}

export interface JudulTrainingModalData {
  id?: number;
  kode?: string;
  judulTraining?: string;
  tipe?: string;
  hari?: number;
  biayaOffline?: number;
  biayaOnline?: number;
  batch?: number;
  brosur?: string | null; // existing file url/path
}

interface ModalJudulTrainingProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "buat" | "edit";
  data?: JudulTrainingModalData;
  onSubmit: (form: JudulTrainingFormData) => void;
  isLoading?: boolean;
}

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────

const initialForm = (): JudulTrainingFormData => ({
  kode: "",
  judulTraining: "",
  tipe: "",
  hari: "",
  biayaOffline: "",
  biayaOnline: "",
  batch: "",
  brosur: null,
});

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────

export default function ModalJudulTraining({
  isOpen,
  onClose,
  mode,
  data = {},
  onSubmit,
  isLoading = false,
}: ModalJudulTrainingProps) {
  const [form, setForm] = useState<JudulTrainingFormData>(initialForm());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const TIPE_OPTIONS = ["ENV", "CSR", "TSM", "EPM"];

  useEffect(() => {
    if (isOpen) {
      setForm({
        kode: data.kode ?? "",
        judulTraining: data.judulTraining ?? "",
        tipe: data.tipe ?? "",
        hari: data.hari ?? "",
        biayaOffline: data.biayaOffline ?? "",
        biayaOnline: data.biayaOnline ?? "",
        batch: data.batch ?? "",
        brosur: null, // file selalu reset, existing ditampilkan terpisah
      });
    }
  }, [
    isOpen,
    data.kode,
    data.judulTraining,
    data.tipe,
    data.hari,
    data.biayaOffline,
    data.biayaOnline,
    data.batch,
  ]);

  if (!isOpen) return null;

  const title =
    mode === "buat" ? "Tambah Judul Training" : "Edit Judul Training";
  const subtitle =
    mode === "buat"
      ? "Lengkapi formulir untuk menambahkan judul training baru."
      : "Ubah data judul training yang diperlukan.";

  const isValid =
    form.kode.trim() !== "" &&
    form.judulTraining.trim() !== "" &&
    form.tipe.trim() !== "" &&
    form.hari !== "" &&
    form.biayaOffline !== "" &&
    form.biayaOnline !== "" &&
    form.batch !== "";

  const set = (key: keyof JudulTrainingFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNumeric = (key: keyof JudulTrainingFormData, val: string) => {
    const parsed = parseInt(val.replace(/\D/g, ""));
    set(key, isNaN(parsed) ? "" : parsed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    set("brosur", file);
  };

  const handleRemoveFile = () => {
    set("brosur", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputClass =
    "w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white";
  const labelClass = "block text-xs font-medium text-zinc-600 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-800">{title}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors ml-4 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form - scrollable */}
        <div className="px-6 pb-4 space-y-4 overflow-y-auto flex-1">
          {/* Kode & Tipe */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Kode</label>
              <input
                type="text"
                placeholder="Contoh: CSR-01"
                value={form.kode}
                onChange={(e) => set("kode", e.target.value.toUpperCase())}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tipe</label>
              <div className="relative">
                <select
                  value={form.tipe}
                  onChange={(e) => set("tipe", e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Pilih Tipe</option>
                  {TIPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Judul Training */}
          <div>
            <label className={labelClass}>Judul Training</label>
            <input
              type="text"
              placeholder="Masukkan judul training"
              value={form.judulTraining}
              onChange={(e) => set("judulTraining", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Hari & Batch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Hari</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Jumlah hari"
                value={form.hari}
                onChange={(e) => handleNumeric("hari", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Batch</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Nomor batch"
                value={form.batch}
                onChange={(e) => handleNumeric("batch", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Biaya Online & Offline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Biaya Online (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={
                  form.biayaOnline !== ""
                    ? form.biayaOnline.toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) => handleNumeric("biayaOnline", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Biaya Offline (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={
                  form.biayaOffline !== ""
                    ? form.biayaOffline.toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) => handleNumeric("biayaOffline", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Brosur Upload */}
          <div>
            <label className={labelClass}>Brosur</label>

            {/* Existing file (edit mode) */}
            {mode === "edit" && data.brosur && !form.brosur && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                <Paperclip className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-xs text-zinc-500 truncate flex-1">
                  File terpasang saat ini
                </span>

                <a
                  href={data.brosur}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-500 hover:text-emerald-700 font-medium shrink-0"
                >
                  Lihat
                </a>
              </div>
            )}

            {/* New file selected */}
            {form.brosur ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Paperclip className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-emerald-700 truncate flex-1">
                  {form.brosur.name}
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="text-zinc-400 hover:text-red-400 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-zinc-300 rounded-lg px-3 py-3 text-xs text-zinc-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
              >
                <Paperclip className="w-3.5 h-3.5" />
                {mode === "edit" && data.brosur
                  ? "Ganti file brosur"
                  : "Upload brosur (PDF / DOC / XLS)"}
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              if (isValid && !isLoading) onSubmit(form);
            }}
            disabled={!isValid || isLoading}
            className={`px-5 py-2 text-xs font-medium rounded-lg transition-colors ${
              isValid && !isLoading
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {isLoading
              ? "Menyimpan..."
              : mode === "buat"
                ? "Tambahkan"
                : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
