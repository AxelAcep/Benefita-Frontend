// components/modal-resi.tsx
"use client";

import React from "react";

interface ModalResiProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "upload" | "lihat" | "edit";
  data?: {
    penerima?: string;
    hp?: string;
    instansi?: string;
    alamat?: string;
    isiDokumen?: string;
    noResi?: string;
    kirimVia?: string;
    tanggalKirim?: string;
    diterimOleh?: string;
    tanggalDiterima?: string;
  };
}

export default function ModalResi({
  isOpen,
  onClose,
  mode,
  data = {},
}: ModalResiProps) {
  const [form, setForm] = React.useState({
    penerima: data.penerima ?? "",
    hp: data.hp ?? "",
    instansi: data.instansi ?? "",
    alamat: data.alamat ?? "",
    isiDokumen: data.isiDokumen ?? "",
    noResi: data.noResi ?? "",
    kirimVia: data.kirimVia ?? "",
    tanggalKirim: data.tanggalKirim ?? "",
    diterimOleh: data.diterimOleh ?? "",
    tanggalDiterima: data.tanggalDiterima ?? "",
  });

  React.useEffect(() => {
    setForm({
      penerima: data.penerima ?? "",
      hp: data.hp ?? "",
      instansi: data.instansi ?? "",
      alamat: data.alamat ?? "",
      isiDokumen: data.isiDokumen ?? "",
      noResi: data.noResi ?? "",
      kirimVia: data.kirimVia ?? "",
      tanggalKirim: data.tanggalKirim ?? "",
      diterimOleh: data.diterimOleh ?? "",
      tanggalDiterima: data.tanggalDiterima ?? "",
    });
  }, [data.penerima, data.noResi, isOpen]);

  if (!isOpen) return null;

  const isReadOnly = false;
  const title =
    mode === "upload"
      ? "Upload Resi"
      : mode === "edit"
        ? "Edit Resi"
        : "Lihat Resi";
  const subtitle = "Lengkapi formulir di bawah ini untuk mengupload resi.";

  const inputClass =
    "w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white";
  const labelClass = "block text-xs font-medium text-zinc-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">{title}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors ml-4 mt-0.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className={labelClass}>Penerima</label>
            <input
              type="text"
              className={inputClass}
              value={form.penerima}
              onChange={(e) => setForm({ ...form, penerima: e.target.value })}
              placeholder="Nama penerima"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>HP</label>
              <input
                type="text"
                className={inputClass}
                value={form.hp}
                onChange={(e) => setForm({ ...form, hp: e.target.value })}
                placeholder="No. HP"
              />
            </div>
            <div>
              <label className={labelClass}>Instansi</label>
              <input
                type="text"
                className={inputClass}
                value={form.instansi}
                onChange={(e) => setForm({ ...form, instansi: e.target.value })}
                placeholder="Nama instansi"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Alamat</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              placeholder="Alamat lengkap"
            />
          </div>

          <div>
            <label className={labelClass}>Isi Dokumen</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.isiDokumen}
              onChange={(e) => setForm({ ...form, isiDokumen: e.target.value })}
              placeholder="Keterangan isi dokumen"
            />
          </div>

          <div>
            <label className={labelClass}>No. Resi</label>
            <input
              type="text"
              className={inputClass}
              value={form.noResi}
              onChange={(e) => setForm({ ...form, noResi: e.target.value })}
              placeholder="Nomor resi pengiriman"
            />
          </div>

          <div>
            <label className={labelClass}>Kirim Via</label>
            <select
              className={inputClass}
              value={form.kirimVia}
              onChange={(e) => setForm({ ...form, kirimVia: e.target.value })}
            >
              <option value="">Pilih Jasa Pengiriman</option>
              <option value="JNE">JNE</option>
              <option value="TIKI">TIKI</option>
              <option value="J&T">J&T</option>
              <option value="SiCepat">SiCepat</option>
              <option value="POS Indonesia">POS Indonesia</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Tanggal Kirim</label>
            <div className="relative">
              <input
                type="date"
                className={inputClass}
                value={form.tanggalKirim}
                onChange={(e) =>
                  setForm({ ...form, tanggalKirim: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Diterima Oleh</label>
            <input
              type="text"
              className={inputClass}
              value={form.diterimOleh}
              onChange={(e) =>
                setForm({ ...form, diterimOleh: e.target.value })
              }
              placeholder="Nama penerima dokumen"
            />
          </div>

          <div>
            <label className={labelClass}>Tanggal Diterima</label>
            <input
              type="date"
              className={inputClass}
              value={form.tanggalDiterima}
              onChange={(e) =>
                setForm({ ...form, tanggalDiterima: e.target.value })
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              // handle save
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
