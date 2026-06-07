"use client";

import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import type { DailyActivityItem } from "@/lib/services/perusahaan.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type DailyActivityFormData = {
  kontak: string;
  jenisTraining: string;
  keterangan: string;
  kategori: string;
  inout: string;
  tanggal: string;
  dateTarget: string;
};

interface ModalDailyActivityProps {
  data: DailyActivityItem | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (form: DailyActivityFormData) => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const EMPTY_FORM: DailyActivityFormData = {
  kontak: "",
  jenisTraining: "",
  keterangan: "",
  kategori: "",
  inout: "",
  tanggal: "",
  dateTarget: "",
};

function toForm(item: DailyActivityItem): DailyActivityFormData {
  return {
    kontak: item.kontak ?? "",
    jenisTraining: item.jenisTraining ?? "",
    keterangan: item.keterangan ?? "",
    kategori: item.kategori ?? "",
    inout: item.inout ?? "",
    tanggal: item.tanggal ?? "",
    dateTarget: item.dateTarget
      ? new Date(item.dateTarget).toISOString().split("T")[0]
      : "",
  };
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function ModalDailyActivity({
  data,
  isLoading = false,
  isSaving = false,
  onClose,
  onSubmit,
}: ModalDailyActivityProps) {
  const isEdit = data !== null;

  const [form, setForm] = useState<DailyActivityFormData>(
    isEdit ? toForm(data) : EMPTY_FORM,
  );

  useEffect(() => {
    setForm(isEdit ? toForm(data) : EMPTY_FORM);
  }, [data]);

  const set = <K extends keyof DailyActivityFormData>(
    key: K,
    value: DailyActivityFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    onSubmit(form);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSaving) onClose();
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
          <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
            Memuat data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">
              {isEdit ? "Edit Daily Activity" : "Tambah Daily Activity"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEdit
                ? "Perbarui informasi daily activity."
                : "Isi informasi daily activity baru."}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-zinc-400 hover:text-zinc-600 transition-colors mt-0.5 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t border-zinc-100 mx-6" />

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-4">
          {/* Row 1: Kontak + Jenis Training */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Kontak
              </label>
              <input
                type="text"
                value={form.kontak}
                onChange={(e) => set("kontak", e.target.value)}
                disabled={isSaving}
                placeholder="Nomor kontak"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Jenis Training
              </label>
              <select
                value={form.jenisTraining}
                onChange={(e) => set("jenisTraining", e.target.value)}
                disabled={isSaving}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white appearance-none disabled:opacity-50 disabled:bg-zinc-50"
              >
                <option value="">Pilih Jenis Training</option>
                <option value="REG">REG</option>
                <option value="INH_1">INH_1</option>
                <option value="INH_2">INH_2</option>
                <option value="INH_3">INH_3</option>
                <option value="INH_4">INH_4</option>
                <option value="INH_5">INH_5</option>
                <option value="KONS">KONS</option>
              </select>
            </div>
          </div>

          {/* Row 2: Kategori + In/Out */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Kategori
              </label>
              <select
                value={form.kategori}
                onChange={(e) => set("kategori", e.target.value)}
                disabled={isSaving}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white appearance-none disabled:opacity-50 disabled:bg-zinc-50"
              >
                <option value="">Pilih Kategori</option>
                <option value="ENV">ENV</option>
                <option value="CSR">CSR</option>
                <option value="TSM">TSM</option>
                <option value="EPM">EPM</option>
                <option value="KEU">KEU</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                In/Out
              </label>
              <select
                value={form.inout}
                onChange={(e) => set("inout", e.target.value)}
                disabled={isSaving}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white appearance-none disabled:opacity-50 disabled:bg-zinc-50"
              >
                <option value="">Pilih</option>
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
            </div>
          </div>

          {/* Row 3: Tanggal + Date Target */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Tanggal{" "}
                {!isEdit && (
                  <span className="text-zinc-400 font-normal">
                    (otomatis hari ini)
                  </span>
                )}
              </label>
              <input
                type="date"
                value={
                  isEdit ? form.tanggal : new Date().toISOString().split("T")[0]
                }
                onChange={(e) => set("tanggal", e.target.value)}
                disabled={true}
                className={`w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition ${
                  !isEdit
                    ? "bg-zinc-50 text-zinc-500 cursor-not-allowed"
                    : "disabled:opacity-50 disabled:bg-zinc-50"
                }`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Date Target{" "}
                <span className="text-zinc-400 font-normal">(opsional)</span>
              </label>
              <input
                type="date"
                value={form.dateTarget}
                onChange={(e) => set("dateTarget", e.target.value)}
                disabled={isSaving}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
          </div>

          {/* Row 4: Keterangan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600">
              Keterangan
            </label>
            <textarea
              value={form.keterangan}
              onChange={(e) => set("keterangan", e.target.value)}
              disabled={isSaving}
              placeholder="Keterangan aktivitas"
              rows={4}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition resize-none disabled:opacity-50 disabled:bg-zinc-50"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg disabled:opacity-40 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
