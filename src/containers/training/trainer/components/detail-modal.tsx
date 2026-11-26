"use client";

/**
 * Modal detail trainer. Khusus halaman ini, jadi tinggal di dalam
 * containernya — bukan di components/base.
 */
import React from "react";
import { BaseModal } from "@/components/base/base-modal";
import type { Trainer } from "@/lib/types/trainer";

function Bagian({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-2">
        {judul}
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Baris({ label, value }: { label: string; value?: React.ReactNode }) {
  const kosong =
    value === null || value === undefined || value === "" ? true : false;
  return (
    <div>
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xs text-zinc-700 mt-0.5 break-words">
        {kosong ? <span className="text-zinc-300">-</span> : value}
      </p>
    </div>
  );
}

export interface TrainerDetailModalProps {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  data: Trainer | null;
  loading?: boolean;
}

export function TrainerDetailModal({
  open,
  onClose,
  onEdit,
  data,
  loading = false,
}: TrainerDetailModalProps) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      ukuran="lg"
      judul={data ? `${data.nama} — ${data.kode}` : "Detail Trainer"}
      deskripsi="Rincian data trainer."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Tutup
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              disabled={!data}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
            >
              Edit Data
            </button>
          )}
        </>
      }
    >
      {loading && !data ? (
        <p className="text-xs text-zinc-400">Memuat detail...</p>
      ) : !data ? (
        <p className="text-xs text-zinc-400">Data tidak tersedia.</p>
      ) : (
        <div className="space-y-5">
          <Bagian judul="Identitas Diri">
            <Baris label="Nama" value={`${data.nama} - ${data.kode}`} />
            <Baris
              label="Status"
              value={
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                    data.statusAktif
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {data.statusAktif ? "Aktif" : "Nonaktif"}
                </span>
              }
            />
            <Baris label="Hp/Telp" value={data.hp} />
            <Baris label="Email" value={data.email} />
            <Baris label="Subyek Khusus" value={data.subyekKhusus} />
            <Baris label="Tugas" value={data.tugas} />
            <Baris
              label="Jumlah Hari"
              value={
                // Endpoint detail tidak mengirim jumlahHari. Dulu diisi 0,
                // jadi modal selalu bilang "0" walau tabel menunjukkan angka
                // lain. Sekarang jujur: tidak tersedia di sini.
                data.jumlahHari === null
                  ? "Lihat di tabel"
                  : `${data.jumlahHari} hari`
              }
            />
            <Baris label="Keterangan" value={data.keterangan} />
          </Bagian>

          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-2">
              Referensi
            </p>
            {data.referensi.length === 0 ? (
              <span className="text-xs text-zinc-300">-</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {data.referensi.map((ref) => (
                  <span
                    key={ref}
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Bagian judul="Alamat">
            <Baris label="Alamat" value={data.alamat} />
            <Baris label="Kantor" value={data.kantor} />
            <Baris label="Alamat Kantor" value={data.alamatKantor} />
            <Baris label="No Telp Kantor" value={data.noTelpKantor} />
          </Bagian>
        </div>
      )}
    </BaseModal>
  );
}
