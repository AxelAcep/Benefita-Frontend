"use client";

import React, { useState, useEffect } from "react";
import {
  createUmk,
  updateUmk,
  getUmkById,
} from "@/lib/services/accounting.service";
import { usePegawai } from "@/hooks/use-pegawai-list";

interface ModalUmkProps {
  isOpen: boolean;
  onClose: () => void;
  editId: number | null;
  onSuccess: () => void;
}

export default function ModalUmk({
  isOpen,
  onClose,
  editId,
  onSuccess,
}: ModalUmkProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    noUmk: "",
    tujuanUmk: "",
    picId: "",
    jumlahUmk: 0,
    tglPenyerahanUang: "",
    realisasiUmk: 0,
    ketUmk: "",
  });

  const { data: pegawaiList, loading: loadingPegawai } = usePegawai();

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        const fetchData = async () => {
          try {
            setLoading(true);
            const res = await getUmkById(editId);
            const data = res.data;
            setForm({
              noUmk: data.noUmk,
              tujuanUmk: data.tujuanUmk,
              picId: data.picId || "",
              jumlahUmk: data.jumlahUmk,
              tglPenyerahanUang: data.tglPenyerahanUang || "",
              realisasiUmk: data.realisasiUmk || 0,
              ketUmk: data.ketUmk || "",
            });
          } catch (err) {
            console.error("Gagal fetch detail UMK:", err);
            alert("Gagal mengambil data UMK");
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } else {
        setForm({
          noUmk: "",
          tujuanUmk: "",
          picId: "",
          jumlahUmk: 0,
          tglPenyerahanUang: "",
          realisasiUmk: 0,
          ketUmk: "",
        });
      }
    }
  }, [isOpen, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        tujuanUmk: form.tujuanUmk,
        picId: form.picId,
        jumlahUmk: form.jumlahUmk,
        tglPenyerahanUang: form.tglPenyerahanUang || undefined,
        realisasiUmk: form.realisasiUmk || 0,
        ketUmk: form.ketUmk || undefined,
      };
      if (editId) {
        await updateUmk(editId, payload);
        alert("UMK berhasil diperbarui");
      } else {
        await createUmk({ ...payload, noUmk: form.noUmk });
        alert("UMK berhasil dibuat");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-bold text-zinc-800 mb-4">
          {editId ? "Edit UMK" : "Tambah UMK Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editId && (
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                No. UMK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.noUmk}
                onChange={(e) => setForm({ ...form, noUmk: e.target.value })}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none"
                placeholder="Contoh: 010/UMK-I/24"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Tujuan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.tujuanUmk}
              onChange={(e) => setForm({ ...form, tujuanUmk: e.target.value })}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none"
              placeholder="Tujuan UMK"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              PIC <span className="text-red-500">*</span>
            </label>
            <select
              value={form.picId}
              onChange={(e) => setForm({ ...form, picId: e.target.value })}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none"
              required
              disabled={loadingPegawai}
            >
              <option value="">Pilih PIC</option>
              {pegawaiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.jumlahUmk}
              onChange={(e) =>
                setForm({ ...form, jumlahUmk: parseInt(e.target.value) || 0 })
              }
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Tanggal Penyerahan
            </label>
            <input
              type="text"
              value={form.tglPenyerahanUang}
              onChange={(e) =>
                setForm({ ...form, tglPenyerahanUang: e.target.value })
              }
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none"
              placeholder="DD.MM.YYYY (contoh: 15.07.2024)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Realisasi
            </label>
            <input
              type="number"
              value={form.realisasiUmk}
              onChange={(e) =>
                setForm({
                  ...form,
                  realisasiUmk: parseInt(e.target.value) || 0,
                })
              }
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">
              Keterangan
            </label>
            <textarea
              value={form.ketUmk}
              onChange={(e) => setForm({ ...form, ketUmk: e.target.value })}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-300 outline-none resize-none"
              rows={3}
              placeholder="Keterangan tambahan..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
