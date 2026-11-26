"use client";

/**
 * Formulir Jadwal Training, dipakai rute tambah dan edit sekaligus.
 *
 * Dulu dua berkas terpisah yang sudah melenceng jauh satu sama lain:
 * 318 baris berbeda, dan hanya versi edit yang punya tombol hapus serta
 * penanganan berkas agenda yang sudah terpasang.
 */
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Loader2, Paperclip, Save, Trash2, X } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import ConfirmModal from "@/components/base/confirm-modal";
import { JudulTrainingSelect } from "@/components/base/JudulTrainingSelect";
import { TrainerSelect } from "@/components/base/TrainerSelect";
import {
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/base/form-field";
import { urlFileAgenda } from "@/lib/types/jadwal-training";
import { jadwalSchema, NILAI_KOSONG, type JadwalFormValues } from "./form-schema";
import { useJadwalFormManage } from "./manage";

export default function JadwalFormContainer() {
  const m = useJadwalFormManage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [namaBerkas, setNamaBerkas] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JadwalFormValues>({
    resolver: zodResolver(jadwalSchema),
    defaultValues: NILAI_KOSONG,
  });

  // Mode ubah: isi dari detail yang baru tiba.
  useEffect(() => {
    if (m.nilaiAwal) reset(m.nilaiAwal);
  }, [m.nilaiAwal, reset]);

  // Mode tambah: isi nomor jadwal yang dibuatkan backend.
  useEffect(() => {
    if (!m.isEdit && m.noJadwalBaru) setValue("noJadwal", m.noJadwalBaru);
  }, [m.isEdit, m.noJadwalBaru, setValue]);

  const sedangProses = m.saving || m.detailLoading;
  const urlAgendaLama = urlFileAgenda(m.detail?.fileAgenda ?? null);

  const opsi = (daftar: string[]) =>
    daftar.map((v) => ({ value: v, label: v }));

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Jadwal Training", href: "/training/jadwal" },
        { label: m.isEdit ? "Edit Jadwal" : "Tambah Jadwal" },
      ]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="font-bold text-zinc-800 text-sm">
                {m.isEdit ? "Edit Jadwal Training" : "Tambah Jadwal Training"}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {m.isEdit
                  ? "Ubah data jadwal di bawah ini"
                  : "Lengkapi data jadwal di bawah ini"}
              </p>
            </div>
          </div>

          {m.isEdit && (
            <button
              type="button"
              onClick={m.bukaKonfirmasiHapus}
              disabled={sedangProses || m.deleting}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(m.simpan)}>
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextInput
                label="No. Jadwal"
                error={errors.noJadwal?.message}
                // Saat menambah, nomor dibuatkan backend. Saat mengubah,
                // nomor itu identitas barisnya, jadi tidak boleh diganti.
                readOnly
                title={
                  m.isEdit
                    ? "Nomor jadwal tidak bisa diubah"
                    : "Nomor dibuat otomatis"
                }
                className="bg-zinc-50 cursor-not-allowed"
                placeholder={m.noJadwalLoading ? "Memuat nomor..." : ""}
                {...register("noJadwal")}
              />

              <Field
                label="Kode Pelatihan"
                error={errors.kodePelatihan?.message}
              >
                <Controller
                  name="kodePelatihan"
                  control={control}
                  render={({ field }) => (
                    <JudulTrainingSelect
                      value={field.value}
                      onChange={(kode, judul) => {
                        field.onChange(kode);
                        // Judul ikut terisi dari pilihan, supaya tidak
                        // perlu diketik ulang.
                        if (judul) setValue("judulLengkap", judul);
                      }}
                    />
                  )}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextInput
                label="Tgl. Mulai"
                optional
                type="date"
                {...register("tglMulai")}
              />
              <TextInput
                label="Tgl. Selesai"
                optional
                type="date"
                {...register("tglSelesai")}
              />
            </div>

            <TextArea
              label="Judul Lengkap"
              optional
              rows={2}
              placeholder="Judul lengkap training"
              {...register("judulLengkap")}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextInput
                label="Judul Pendek"
                optional
                placeholder="Judul ringkas"
                {...register("judulPendek")}
              />
              <SelectInput
                label="Metode"
                optional
                placeholder="Pilih Metode"
                opsi={opsi(m.opsi.metode)}
                {...register("metode")}
              />
              <SelectInput
                label="Jenis Training"
                optional
                placeholder="Pilih Jenis"
                opsi={opsi(m.opsi.jenisTraining)}
                {...register("jenisTraining")}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <TextInput
                label="Kota"
                optional
                placeholder="Kota pelaksanaan"
                {...register("kota")}
              />
              <TextInput
                label="Lokasi / Hotel / LSP"
                optional
                placeholder="Nama lokasi"
                {...register("lokasiDetail")}
              />
              <TextInput
                label="Biaya (Rupiah)"
                optional
                inputMode="numeric"
                placeholder="Masukkan nominal"
                {...register("biaya")}
              />
            </div>

            <Field label="Trainer" optional error={errors.trainerKodes?.message}>
              <Controller
                name="trainerKodes"
                control={control}
                render={({ field }) => (
                  <TrainerSelect
                    value={field.value ?? []}
                    onChange={(kodes) => field.onChange(kodes)}
                  />
                )}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SelectInput
                label="Status Jadwal"
                optional
                placeholder="Pilih Status"
                // Nilainya datang dari database. Daftar lama memakai
                // "TENTATIVE" dan "SELESAI", yang tidak pernah tersimpan.
                opsi={opsi(m.opsi.status)}
                {...register("status")}
              />
            </div>

            <TextArea
              label="Catatan"
              optional
              rows={4}
              placeholder="Ketik catatan"
              {...register("catatan")}
            />

            <Field label="File Agenda" optional>
              <div className="space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const berkas = e.target.files?.[0] ?? null;
                    m.setFileAgenda(berkas);
                    setNamaBerkas(berkas?.name ?? null);
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    Pilih berkas
                  </button>

                  {namaBerkas ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                      {namaBerkas}
                      <button
                        type="button"
                        aria-label="Batalkan berkas"
                        onClick={() => {
                          m.setFileAgenda(null);
                          setNamaBerkas(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ) : urlAgendaLama ? (
                    <a
                      href={urlAgendaLama}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Lihat agenda saat ini
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-400">
                      Belum ada file agenda
                    </span>
                  )}
                </div>

                {urlAgendaLama && namaBerkas && (
                  <p className="text-[10px] text-amber-600">
                    File agenda lama akan diganti berkas baru ini.
                  </p>
                )}
              </div>
            </Field>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={m.batal}
              disabled={sedangProses}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sedangProses}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[130px] justify-center"
            >
              {sedangProses ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  {m.isEdit ? "Simpan Perubahan" : "Simpan Jadwal"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={m.konfirmasiHapus}
        title="Hapus Jadwal Training"
        message={`Jadwal ${m.noJadwalAsli ?? ""} akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={m.hapus}
        onCancel={m.tutupKonfirmasiHapus}
        loading={m.deleting}
      />
    </AppLayout>
  );
}
