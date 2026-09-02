"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Loader2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TrainerSelect } from "@/components/base/TrainerSelect";
import Notification from "@/components/base/notifications";
import { useJadwalTrainerHari } from "@/hooks/use-jadwal-trainer-harian";

interface TrainerHariModalProps {
  noJadwal: string | null;
  judulFallback?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTanggalPanjang(iso: string) {
  return new Date(`${iso}T00:00:00.000Z`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function TrainerHariModal({
  noJadwal,
  judulFallback,
  open,
  onOpenChange,
}: TrainerHariModalProps) {
  const { jadwal, data, isLoading, isSaving, fetch, save, reset } =
    useJadwalTrainerHari();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string[]>>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (open && noJadwal) {
      setIsEditing(false);
      fetch(noJadwal).catch((err) => {
        setNotification({
          message:
            err instanceof Error
              ? err.message
              : "Gagal mengambil assignment trainer",
          type: "error",
        });
      });
    }
    if (!open) {
      reset();
      setIsEditing(false);
      setDraft({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, noJadwal]);

  function startEdit() {
    const initialDraft: Record<string, string[]> = {};
    data.forEach((d) => {
      initialDraft[d.tanggal] = d.trainers.map((t) => t.kode);
    });
    setDraft(initialDraft);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setDraft({});
  }

  async function handleSave() {
    if (!noJadwal) return;
    try {
      await save(noJadwal, {
        hari: data.map((d) => ({
          tanggal: d.tanggal,
          trainerKodes: draft[d.tanggal] ?? d.trainers.map((t) => t.kode),
        })),
      });
      setIsEditing(false);
      setDraft({});
      setNotification({
        message: "Assignment trainer berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan assignment trainer",
        type: "error",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign Trainer per Hari</DialogTitle>
          <DialogDescription>
            {jadwal?.judulLengkap ?? judulFallback ?? noJadwal}
            {jadwal ? ` — ${jadwal.noJadwal}` : ""}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-xs text-zinc-400 py-10">
            Tidak ada data tanggal untuk jadwal ini.
          </p>
        ) : (
          <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {data.map((d) => (
              <div
                key={d.tanggal}
                className="border border-zinc-100 rounded-xl px-3 py-2.5"
              >
                <p className="text-[11px] font-semibold text-zinc-600 mb-1.5">
                  {formatTanggalPanjang(d.tanggal)}
                </p>

                {isEditing ? (
                  <TrainerSelect
                    value={draft[d.tanggal] ?? []}
                    onChange={(kodes) =>
                      setDraft((prev) => ({ ...prev, [d.tanggal]: kodes }))
                    }
                    placeholder="Pilih trainer untuk hari ini..."
                  />
                ) : d.trainers.length === 0 ? (
                  <span className="text-xs text-zinc-300">
                    Belum ada trainer
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {d.trainers.map((t) => (
                      <span
                        key={t.kode}
                        className="inline-flex items-center bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
                      >
                        {t.nama}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </>
          ) : (
            !isLoading &&
            data.length > 0 && (
              <button
                type="button"
                onClick={startEdit}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
