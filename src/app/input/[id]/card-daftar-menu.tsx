"use client";

import React, { useState } from "react";
import { LayoutGrid, ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface DaftarMenuHandlers {
  onEvaluasiKegiatan?: () => void;
  onRekapNomorSertifikat?: () => void;
  onLinkPengisianData?: () => void;
  onCetakFormulir?: () => void;
  onPindahJadwalPeserta?: () => void;
  onPindahJadwal?: () => void;
  onDownloadBrosur?: () => void;
  onPerusahaanTarget?: () => void;
  onCetakAbsensi?: () => void;
  onCetakDataPeserta?: () => void;
}

interface CardDaftarMenuProps {
  handlers?: DaftarMenuHandlers;
}

// ─────────────────────────────────────────────
// BUTTON HELPER
// ─────────────────────────────────────────────

function MenuButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap"
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CardDaftarMenu({ handlers = {} }: CardDaftarMenuProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-800">
          <LayoutGrid className="w-4 h-4 text-emerald-500" />
          Daftar Menu
        </span>
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="p-1 hover:bg-zinc-50 rounded-md transition-colors"
        >
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Menu Peserta */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 mb-2">
              Menu Peserta
            </p>
            <div className="flex flex-wrap gap-2">
              <MenuButton
                label="Evaluasi Kegiatan"
                onClick={handlers.onEvaluasiKegiatan}
              />
              <MenuButton
                label="Rekap Nomor Sertifikat"
                onClick={handlers.onRekapNomorSertifikat}
              />
              <MenuButton
                label="Link Pengisian Data"
                onClick={handlers.onLinkPengisianData}
              />
              <MenuButton
                label="Cetak Formulir Pendaftaran"
                onClick={handlers.onCetakFormulir}
              />
              <MenuButton
                label="Pindah Jadwal Peserta"
                onClick={handlers.onPindahJadwalPeserta}
              />
              <MenuButton
                label="Pindah Jadwal"
                onClick={handlers.onPindahJadwal}
              />
              <MenuButton
                label="Download Brosur"
                onClick={handlers.onDownloadBrosur}
              />
              <MenuButton
                label="Perusahaan Target"
                onClick={handlers.onPerusahaanTarget}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100" />

          {/* Menu Kegiatan */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 mb-2">
              Menu Kegiatan
            </p>
            <div className="flex flex-wrap gap-2">
              <MenuButton
                label="Cetak Absensi"
                onClick={handlers.onCetakAbsensi}
              />
              <MenuButton
                label="Cetak Data Peserta"
                onClick={handlers.onCetakDataPeserta}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
