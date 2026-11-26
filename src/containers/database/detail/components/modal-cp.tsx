"use client";

import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import type { ContactPersonItem } from "@/lib/services/perusahaan.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type ContactPersonFormData = {
  nama: string;
  teknisTertinggi: "ya" | "tidak" | "";
  jabatan: string;
  hp: string;
  email: string;
  posisi: "alamat-pusat" | "alamat-factory" | "";
  keuangan: string;
  minat: string;
  keterangan: string;
};

interface ModalContactPersonProps {
  /** Null = mode tambah, diisi = mode edit */
  data: ContactPersonItem | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (form: ContactPersonFormData) => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const EMPTY_FORM: ContactPersonFormData = {
  nama: "",
  teknisTertinggi: "",
  jabatan: "",
  hp: "",
  email: "",
  posisi: "",
  keuangan: "",
  minat: "",
  keterangan: "",
};

function toForm(item: ContactPersonItem): ContactPersonFormData {
  return {
    nama: item.nama ?? "",
    teknisTertinggi: item.teknisTertinggi ? "ya" : "tidak",
    jabatan: item.jabatan ?? "",
    hp: item.hp ?? "",
    email: item.email ?? "",
    posisi: (item.posisi as ContactPersonFormData["posisi"]) ?? "",
    keuangan: item.keuangan ?? "",
    minat: item.minta ?? "", // ← API "minta" → form "minat"
    keterangan: item.ket ?? "", // ← API "ket" → form "keterangan"
  };
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function ModalContactPerson({
  data,
  isLoading = false,
  isSaving = false,
  onClose,
  onSubmit,
}: ModalContactPersonProps) {
  const isEdit = data !== null;

  const [form, setForm] = useState<ContactPersonFormData>(
    isEdit ? toForm(data) : EMPTY_FORM,
  );

  useEffect(() => {
    setForm(isEdit ? toForm(data) : EMPTY_FORM);
  }, [data]);

  const set = <K extends keyof ContactPersonFormData>(
    key: K,
    value: ContactPersonFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    onSubmit(form);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSaving) onClose();
  };

  // ── Loading state (saat fetch data untuk edit) ──
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
              {isEdit ? "Edit Data" : "Tambah Data"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEdit
                ? "Perbarui informasi yang diperlukan."
                : "Isi informasi contact person baru."}
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
          {/* Row 1: Nama + Teknis Tertinggi */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Nama</label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                disabled={isSaving}
                placeholder="Nama lengkap"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Teknis Tertinggi
              </label>
              <select
                value={form.teknisTertinggi}
                onChange={(e) =>
                  set(
                    "teknisTertinggi",
                    e.target.value as ContactPersonFormData["teknisTertinggi"],
                  )
                }
                disabled={isSaving}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white appearance-none disabled:opacity-50 disabled:bg-zinc-50"
              >
                <option value="">Pilih Informasi</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>
          </div>

          {/* Row 2: Jabatan + No. HP/WA + Email */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Jabatan
              </label>
              <input
                type="text"
                value={form.jabatan}
                onChange={(e) => set("jabatan", e.target.value)}
                disabled={isSaving}
                placeholder="Jabatan"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                No. HP/WA
              </label>
              <input
                type="text"
                value={form.hp}
                onChange={(e) => set("hp", e.target.value)}
                disabled={isSaving}
                placeholder="08xx xxxx xxxx"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={isSaving}
                placeholder="email@domain.com"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
          </div>

          {/* Row 3: Posisi + Keuangan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Posisi
              </label>
              <select
                value={form.posisi}
                onChange={(e) =>
                  set(
                    "posisi",
                    e.target.value as ContactPersonFormData["posisi"],
                  )
                }
                disabled={isSaving}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white appearance-none disabled:opacity-50 disabled:bg-zinc-50"
              >
                <option value="">Pilih Posisi</option>
                <option value="alamat-pusat">Alamat Pusat</option>
                <option value="alamat-factory">Alamat Factory</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-600">
                Keuangan
              </label>
              <input
                type="text"
                value={form.keuangan}
                onChange={(e) => set("keuangan", e.target.value)}
                disabled={isSaving}
                placeholder="Pilih Informasi"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
              />
            </div>
          </div>

          {/* Row 4: Minat */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600">Minat</label>
            <input
              type="text"
              value={form.minat}
              onChange={(e) => set("minat", e.target.value)}
              disabled={isSaving}
              placeholder="Belum ada data"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition disabled:opacity-50 disabled:bg-zinc-50"
            />
          </div>

          {/* Row 5: Keterangan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600">
              Keterangan
            </label>
            <textarea
              value={form.keterangan}
              onChange={(e) => set("keterangan", e.target.value)}
              disabled={isSaving}
              placeholder="Belum ada data"
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
