"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface KodeOption {
  kode: string;
  ket: string;
}

interface ModalNeracaProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: {
    id?: number;
    tanggal?: string;
    kode?: string;
    uraian?: string;
    bukti?: string;
    debit?: number;
    kredit?: number;
  };
  kodeOptions: KodeOption[];
  onSubmit: (payload: any) => Promise<void>;
}

export default function ModalNeraca({
  isOpen,
  onClose,
  mode,
  initialData,
  kodeOptions,
  onSubmit,
}: ModalNeracaProps) {
  // ─── Form State ──────────────────────────────────────────
  const [tanggal, setTanggal] = useState("");
  const [kode, setKode] = useState("");
  const [uraian, setUraian] = useState("");
  const [tipe, setTipe] = useState<"debit" | "kredit">("debit");
  const [jumlah, setJumlah] = useState<string>("");
  const [bukti, setBukti] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Populate form when editing ──────────────────────────
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTanggal(initialData.tanggal?.split("T")[0] || "");
      setKode(initialData.kode || "");
      setUraian(initialData.uraian || "");
      setBukti(initialData.bukti || "");
      // Determine tipe based on debit/kredit
      if (initialData.debit && initialData.debit > 0) {
        setTipe("debit");
        setJumlah(String(initialData.debit));
      } else if (initialData.kredit && initialData.kredit > 0) {
        setTipe("kredit");
        setJumlah(String(initialData.kredit));
      } else {
        setTipe("debit");
        setJumlah("");
      }
    } else {
      // Reset form for create
      setTanggal(new Date().toISOString().split("T")[0]);
      setKode("");
      setUraian("");
      setTipe("debit");
      setJumlah("");
      setBukti("");
    }
    setError(null);
  }, [mode, initialData, isOpen]);

  // ─── Handle Submit ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jumlahNum = parseFloat(jumlah);
      if (isNaN(jumlahNum) || jumlahNum <= 0) {
        throw new Error("Jumlah harus berupa angka positif");
      }

      const payload: any = {
        tanggal,
        kode,
        uraian,
        bukti,
        debit: tipe === "debit" ? jumlahNum : 0,
        kredit: tipe === "kredit" ? jumlahNum : 0,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-800">
            {mode === "create" ? "Tambah Neraca" : "Edit Neraca"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X size={18} className="text-zinc-500" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
              required
            />
          </div>

          {/* Kode */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">
              Kode <span className="text-red-500">*</span>
            </label>
            <select
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 appearance-none bg-white"
              required
            >
              <option value="">Pilih Kode</option>
              {kodeOptions.map((opt) => (
                <option key={opt.kode} value={opt.kode}>
                  {opt.kode} - {opt.ket}
                </option>
              ))}
            </select>
          </div>

          {/* Uraian / Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">
              Keterangan
            </label>
            <input
              type="text"
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
              placeholder="Masukkan keterangan"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          {/* Tipe Debit/Kredit + Jumlah */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Tipe <span className="text-red-500">*</span>
              </label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value as "debit" | "kredit")}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 appearance-none bg-white"
              >
                <option value="debit">Debit</option>
                <option value="kredit">Kredit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Jumlah <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="0"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                required
                min="0"
                step="1000"
              />
            </div>
          </div>

          {/* No Bukti */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">
              No. Bukti
            </label>
            <input
              type="text"
              value={bukti}
              onChange={(e) => setBukti(e.target.value)}
              placeholder="Masukkan nomor bukti"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {mode === "create" ? "Simpan" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
