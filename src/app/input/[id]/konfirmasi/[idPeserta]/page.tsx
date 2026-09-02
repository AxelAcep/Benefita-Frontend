"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, ChevronDown, Paperclip } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";

import { usePesertaTrainingDetail } from "@/hooks/use-input";
import {
  useKonfirmasiList,
  useKonfirmasiDetail,
  useKonfirmasiMutation,
} from "@/hooks/use-konfirmasi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface KonfirmasiFormData {
  metode: string;
  tanggalPelatihan: string; // yyyy-mm-dd
  kepada: string;
  jabatan: string;
  kontak: string;
}

const DEFAULT_FORM: KonfirmasiFormData = {
  metode: "Offline",
  tanggalPelatihan: "",
  kepada: "Pimpinan",
  jabatan: "",
  kontak: "",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function FieldBox({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center border border-zinc-100 rounded-lg overflow-hidden">
      {label && (
        <span className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0 min-w-[100px]">
          {label}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder ?? ""}
        disabled={disabled || !onChange}
        className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all placeholder:text-zinc-300 disabled:text-zinc-400 bg-transparent"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors"
      >
        <span className="text-sm font-bold text-zinc-800">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

function formatRupiah(val: number | null | undefined) {
  if (val === null || val === undefined) return "-";
  return `Rp${val.toLocaleString("id-ID")}`;
}

// Harga yang ditampilkan di konfirmasi = Harga Total peserta dikurangi diskon (kalau ada)
function hitungHargaKonfirmasi(
  hargaTotal: number | null | undefined,
  diskon: number | null | undefined,
): number | null {
  if (hargaTotal === null || hargaTotal === undefined) return null;
  return hargaTotal - (diskon ?? 0);
}

function formatTanggal(val: string | null | undefined) {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function PageKonfirmasi() {
  const router = useRouter();
  const params = useParams<{ id: string; idPeserta: string }>();
  const noJadwal = params.id;
  const idPeserta = params.idPeserta;
  const pesertaTrainingId = Number(idPeserta);

  const [form, setForm] = useState<KonfirmasiFormData>(DEFAULT_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    data: peserta,
    isLoading: isLoadingPeserta,
    fetch: fetchPeserta,
  } = usePesertaTrainingDetail();

  const { data: existingList, fetch: fetchExistingList } = useKonfirmasiList();
  const existingKonfirmasi = existingList[0] ?? null;

  const {
    data: konfirmasiDetail,
    fetch: fetchKonfirmasiDetail,
  } = useKonfirmasiDetail();

  const { handleCreate, handleUpdate, isLoading: isSaving } =
    useKonfirmasiMutation({
      onSuccess: () => {
        setNotification({
          message: existingKonfirmasi
            ? "Konfirmasi berhasil diperbarui"
            : "Konfirmasi berhasil dibuat",
          type: "success",
        });
        setTimeout(() => router.push(`/input/${noJadwal}`), 900);
      },
      onError: (msg) => setNotification({ message: msg, type: "error" }),
    });

  // Muat data peserta + cek apakah sudah pernah dikonfirmasi
  useEffect(() => {
    if (!idPeserta) return;
    fetchPeserta(idPeserta).catch(() => {
      setNotification({
        message: "Gagal mengambil detail peserta",
        type: "error",
      });
    });
    fetchExistingList({ pesertaTrainingId }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPeserta]);

  // Kalau sudah pernah dikonfirmasi, ambil detailnya buat mode edit
  useEffect(() => {
    if (existingKonfirmasi) {
      fetchKonfirmasiDetail(existingKonfirmasi.id).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingKonfirmasi?.id]);

  // Isi form otomatis dari data peserta / jadwal / konfirmasi yang sudah ada
  useEffect(() => {
    if (!peserta) return;
    setForm((prev) => ({
      ...prev,
      metode:
        konfirmasiDetail?.metode ??
        peserta.metode ??
        peserta.jadwalTraining.metode ??
        "Offline",
      tanggalPelatihan:
        konfirmasiDetail?.tanggalPelatihan?.split("T")[0] ??
        peserta.jadwalTraining.tglMulai?.split("T")[0] ??
        "",
      kepada: konfirmasiDetail?.kepada ?? prev.kepada,
      jabatan: konfirmasiDetail?.jabatan ?? peserta.jabatan ?? "",
      kontak: konfirmasiDetail?.kontak ?? peserta.noTelp ?? "",
    }));
  }, [peserta, konfirmasiDetail]);

  function set(field: keyof KonfirmasiFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSimpan() {
    if (!peserta) return;
    if (!form.metode) {
      setNotification({ message: "Metode wajib diisi.", type: "error" });
      return;
    }

    const basePayload = {
      metode: form.metode,
      tanggalPelatihan: form.tanggalPelatihan || undefined,
      kepada: form.kepada || undefined,
      jabatan: form.jabatan || undefined,
      kontak: form.kontak || undefined,
      noIndukInstansi: peserta.perusahaan?.noInduk || undefined,
      namaPeserta: peserta.nama,
      file: file ?? undefined,
    };

    if (existingKonfirmasi) {
      await handleUpdate(existingKonfirmasi.id, basePayload);
    } else {
      await handleCreate({ ...basePayload, pesertaTrainingId });
    }
  }

  const noKonfirmasi =
    konfirmasiDetail?.noKonfirmasi ?? "Otomatis dibuat setelah disimpan";
  const tanggalKonfirmasi = konfirmasiDetail?.tanggalKonfirmasi
    ? formatTanggal(konfirmasiDetail.tanggalKonfirmasi)
    : formatTanggal(new Date().toISOString());
  const existingFileUrl = konfirmasiDetail?.filePath
    ? `${API_URL}/${konfirmasiDetail.filePath.replace(/\\/g, "/")}`
    : null;

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Input Data", href: `/input/${noJadwal}` },
        { label: "Konfirmasi" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col gap-4">
        {/* Back */}
        <div>
          <button
            type="button"
            onClick={() => router.push(`/input/${noJadwal}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </button>
        </div>

        {isLoadingPeserta && !peserta ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-10 text-center text-xs text-zinc-400">
            Memuat data peserta...
          </div>
        ) : (
          <>
            {/* ── Informasi Konfirmasi ── */}
            <SectionCard title="Informasi Konfirmasi">
              <div className="grid grid-cols-4 gap-0 border border-zinc-100 rounded-xl overflow-hidden divide-x divide-zinc-100">
                <div className="flex items-center">
                  <span className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0">
                    Tanggal Konfirmasi
                  </span>
                  <span className="flex-1 px-4 py-3 text-xs text-zinc-700">
                    {tanggalKonfirmasi}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0">
                    Metode
                  </span>
                  <select
                    value={form.metode}
                    onChange={(e) => set("metode", e.target.value)}
                    className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all bg-transparent"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0">
                    Tgl. Pelatihan
                  </span>
                  <input
                    type="date"
                    value={form.tanggalPelatihan}
                    onChange={(e) => set("tanggalPelatihan", e.target.value)}
                    className="flex-1 px-4 py-3 text-xs text-zinc-700 outline-none focus:bg-emerald-50/30 transition-all bg-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50/60 border-r border-zinc-100 whitespace-nowrap shrink-0">
                    No Konfirmasi
                  </span>
                  <span className="flex-1 px-4 py-3 text-xs text-zinc-700 truncate">
                    {noKonfirmasi}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* ── Detail Pelatihan ── */}
            <SectionCard title="Detail Pelatihan">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-4 gap-0 border border-zinc-100 rounded-xl overflow-hidden divide-x divide-zinc-100">
                  <FieldBox
                    label="Tgl. Training"
                    value={
                      peserta
                        ? `${formatTanggal(peserta.jadwalTraining.tglMulai)} - ${formatTanggal(peserta.jadwalTraining.tglSelesai)}`
                        : "-"
                    }
                  />
                  <FieldBox
                    label="Kode"
                    value={peserta?.jadwalTraining.kodePelatihan ?? "-"}
                  />
                  <FieldBox
                    label="Harga"
                    value={formatRupiah(
                      hitungHargaKonfirmasi(
                        peserta?.hargaTotal,
                        peserta?.diskon,
                      ),
                    )}
                  />
                  <FieldBox
                    label="Lokasi"
                    value={peserta?.jadwalTraining.kota ?? "-"}
                  />
                </div>
                <div className="border border-zinc-100 rounded-xl overflow-hidden">
                  <FieldBox
                    label="Judul Pelatihan"
                    value={peserta?.jadwalTraining.judulLengkap ?? "-"}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── Data Penerima ── */}
            <SectionCard title="Data Penerima">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-4 gap-0 border border-zinc-100 rounded-xl overflow-hidden divide-x divide-zinc-100">
                  <FieldBox
                    label="Kepada"
                    value={form.kepada}
                    onChange={(v) => set("kepada", v)}
                    placeholder="Pimpinan"
                  />
                  <FieldBox
                    label="Jabatan"
                    value={form.jabatan}
                    onChange={(v) => set("jabatan", v)}
                    placeholder="Masukkan jabatan"
                  />
                  <FieldBox
                    label="Instansi"
                    value={peserta?.perusahaan?.company ?? "-"}
                  />
                  <FieldBox
                    label="Kontak"
                    value={form.kontak}
                    onChange={(v) => set("kontak", v)}
                    placeholder="Masukkan kontak"
                  />
                </div>

                <div className="border border-zinc-100 rounded-xl overflow-hidden">
                  <FieldBox label="Nama Peserta" value={peserta?.nama ?? "-"} />
                </div>

                {/* File konfirmasi */}
                <div className="flex items-center gap-3 border border-zinc-100 rounded-xl overflow-hidden px-4 py-3">
                  <span className="text-[11px] font-semibold text-zinc-500 whitespace-nowrap shrink-0 min-w-[100px]">
                    File
                  </span>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-600 cursor-pointer hover:bg-zinc-50 transition-colors">
                    <Paperclip className="w-3.5 h-3.5" />
                    {file ? file.name : "Pilih file"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {existingFileUrl && !file && (
                    <a
                      href={existingFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 font-semibold hover:underline"
                    >
                      Lihat file tersimpan
                    </a>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* ── Action Buttons ── */}
            <div className="flex items-center justify-end gap-2 pb-2">
              <button
                type="button"
                onClick={handleSimpan}
                disabled={isSaving || !peserta}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
