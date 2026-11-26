"use client";

import { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import type { Penawaran } from "@/lib/services/perusahaan.service";

interface Props {
  penawaran: Penawaran;
  loading: boolean;
  onClose: () => void;
  onSave: (payload: { kodePelatihan?: string[]; file?: File }) => Promise<void>;
}

export default function ModalEditPenawaran({
  penawaran,
  loading,
  onClose,
  onSave,
}: Props) {
  const [kodes, setKodes] = useState<string[]>(penawaran.kodePelatihan);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddKode = () => setKodes((p) => [...p, ""]);
  const handleKodeChange = (i: number, val: string) =>
    setKodes((p) => p.map((k, idx) => (idx === i ? val : k)));
  const handleRemoveKode = (i: number) =>
    setKodes((p) => p.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const cleaned = kodes.map((k) => k.trim()).filter(Boolean);
    if (!cleaned.length) return;
    setSaving(true);
    try {
      await onSave({ kodePelatihan: cleaned, ...(file ? { file } : {}) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Edit Penawaran</h2>
            <p className="text-[11px] text-zinc-400">
              Ubah kode pelatihan atau upload file.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Kode Pelatihan */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              Kode Pelatihan
            </label>
            {kodes.map((k, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={k}
                  onChange={(e) => handleKodeChange(i, e.target.value)}
                  className="flex-1 text-xs border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-emerald-500/20"
                  placeholder="Kode pelatihan"
                />
                {kodes.length > 1 && (
                  <button
                    onClick={() => handleRemoveKode(i)}
                    className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddKode}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Plus size={13} /> Tambah Kode
            </button>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
              File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100"
            />
            {penawaran.filePath && !file && (
              <p className="text-[11px] text-zinc-400">
                File saat ini: {penawaran.filePath.split("/").pop()}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50/80 border-t border-zinc-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
