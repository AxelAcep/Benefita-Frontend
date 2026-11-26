// components/modal-kirim-pos.tsx
"use client";

import { useState } from "react";
import { X, Save, Plus, Trash2, Pencil, Check } from "lucide-react";
import { usePosPerusahaan } from "@/hooks/use-perusahaan";

interface Props {
  noInduk: string;
  onClose: () => void;
}

interface RowEdit {
  nama: string;
  jabatan: string;
  acc: string;
  followUp: string;
}

export default function ModalKirimPos({ noInduk, onClose }: Props) {
  const { data, loading, create, update, remove } = usePosPerusahaan(noInduk);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "edit" | "create";
    id?: string;
  } | null>(null);
  const [editForm, setEditForm] = useState<RowEdit>({
    nama: "",
    jabatan: "",
    acc: "",
    followUp: "",
  });
  const [newRow, setNewRow] = useState<RowEdit | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddRow = () => {
    setNewRow({ nama: "", jabatan: "", acc: "", followUp: "" });
  };

  const handleCreateSaveClick = () => setConfirmAction({ type: "create" });
  const handleCreateSaveConfirm = async () => {
    if (!newRow?.nama || !newRow?.jabatan || !newRow?.acc) return;
    setSaving(true);
    try {
      await create({ ...newRow });
      setNewRow(null);
      setConfirmAction(null);
    } finally {
      setSaving(false);
    }
  };

  const handleEditStart = (row: (typeof data)[0]) => {
    setEditingId(row.id);
    setEditForm({
      nama: row.nama,
      jabatan: row.jabatan,
      acc: row.acc,
      followUp: row.followUp ?? "",
    });
  };

  const handleEditSaveClick = (id: string) =>
    setConfirmAction({ type: "edit", id });
  const handleEditSaveConfirm = async () => {
    if (!confirmAction?.id) return;
    setSaving(true);
    try {
      await update({ id: confirmAction.id, ...editForm });
      setEditingId(null);
      setConfirmAction(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string) =>
    setConfirmAction({ type: "delete", id });
  const handleDeleteConfirm = async () => {
    if (!confirmAction?.id) return;
    await remove(confirmAction.id);
    setConfirmAction(null);
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Kirim Pos</h2>
            <p className="text-[11px] text-zinc-400">
              Menyajikan informasi pengiriman pos pada perusahaan/instansi
              terkait.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Nama
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Jabatan
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  ACC
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-xs text-zinc-400"
                  >
                    Memuat...
                  </td>
                </tr>
              ) : (
                <>
                  {data.map((row, index) => (
                    <tr key={row.id} className="border-b border-zinc-50">
                      <td className="px-3 py-2 text-xs text-zinc-400">
                        {index + 1}
                      </td>

                      {editingId === row.id ? (
                        <>
                          <td className="px-3 py-2">
                            <input
                              className="w-full text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                              value={editForm.nama}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  nama: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-full text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                              value={editForm.jabatan}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  jabatan: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="w-full text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                              value={editForm.acc}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  acc: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleEditSaveClick(row.id)}
                              disabled={saving}
                              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                            >
                              <Check size={13} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2 text-xs text-zinc-700">
                            {row.nama}
                          </td>
                          <td className="px-3 py-2 text-xs text-zinc-600">
                            {row.jabatan}
                          </td>
                          <td className="px-3 py-2 text-xs text-zinc-600">
                            {row.acc}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditStart(row)}
                                className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-emerald-500 rounded-lg transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(row.id)}
                                className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {/* New Row */}
                  {newRow && (
                    <tr className="border-b border-emerald-100 bg-emerald-50/30">
                      <td className="px-3 py-2 text-xs text-zinc-400">
                        {data.length + 1}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          autoFocus
                          placeholder="Nama"
                          className="w-full text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                          value={newRow.nama}
                          onChange={(e) =>
                            setNewRow(
                              (p) => p && { ...p, nama: e.target.value },
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          placeholder="Jabatan"
                          className="w-full text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                          value={newRow.jabatan}
                          onChange={(e) =>
                            setNewRow(
                              (p) => p && { ...p, jabatan: e.target.value },
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          placeholder="ACC"
                          className="w-full text-xs border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                          value={newRow.acc}
                          onChange={(e) =>
                            setNewRow((p) => p && { ...p, acc: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={handleCreateSaveClick}
                          disabled={saving}
                          className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                        >
                          <Check size={13} />
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
            {confirmAction && (
              <tr className="bg-amber-50 border-b border-amber-100">
                <td colSpan={5} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-700 font-medium">
                      {confirmAction.type === "delete" &&
                        "Yakin ingin menghapus data ini?"}
                      {confirmAction.type === "edit" &&
                        "Yakin ingin menyimpan perubahan?"}
                      {confirmAction.type === "create" &&
                        "Yakin ingin menambah data ini?"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-3 py-1 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-200 rounded-lg transition-colors"
                      >
                        Tidak
                      </button>
                      <button
                        onClick={
                          confirmAction.type === "delete"
                            ? handleDeleteConfirm
                            : confirmAction.type === "edit"
                              ? handleEditSaveConfirm
                              : handleCreateSaveConfirm
                        }
                        disabled={saving}
                        className="px-3 py-1 text-[11px] font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Ya, Lanjutkan
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50/80 border-t border-zinc-100 flex justify-between items-center">
          <button
            onClick={handleAddRow}
            disabled={!!newRow}
            className="px-4 py-2 text-xs font-semibold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Plus size={13} /> Tambah
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-200 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
