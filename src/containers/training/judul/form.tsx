"use client";

/** Skema dan field formulir Judul Training, termasuk unggah brosur. */
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { Paperclip, X } from "lucide-react";
import { FormModal } from "@/components/base/form-modal";
import { Field, SelectInput, TextArea, TextInput } from "@/components/base/form-field";
import { urlBrosur } from "@/lib/types/judul-training";

const angkaWajib = (label: string) =>
  z
    .string()
    .min(1, `${label} wajib diisi`)
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      `${label} tidak boleh negatif`,
    );

export const judulSchema = z.object({
  kode: z.string().min(1, "Kode wajib diisi"),
  judulTraining: z.string().min(1, "Judul training wajib diisi"),
  tipe: z.string().min(1, "Tipe wajib dipilih"),
  hari: angkaWajib("Hari"),
  biayaOnline: angkaWajib("Biaya online"),
  biayaOffline: angkaWajib("Biaya offline"),
  batch: angkaWajib("Batch"),
  /** Berkas brosur baru. Kosong berarti brosur lama dipertahankan. */
  brosur: z.instanceof(File).nullable().optional(),
});

export type JudulFormValues = z.infer<typeof judulSchema>;

const NILAI_KOSONG: JudulFormValues = {
  kode: "",
  judulTraining: "",
  tipe: "",
  hari: "",
  biayaOnline: "",
  biayaOffline: "",
  batch: "",
  brosur: null,
};

export interface JudulFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JudulFormValues) => Promise<void>;
  initialData?: JudulFormValues | null;
  isLoading?: boolean;
  tipeList: string[];
  /** Path brosur yang sudah tersimpan, untuk ditampilkan saat mode edit. */
  brosurLama?: string | null;
}

export function JudulForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  tipeList,
  brosurLama,
}: JudulFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [namaBerkas, setNamaBerkas] = useState<string | null>(null);

  // Tipe yang sedang dipakai baris ini harus tetap muncul walau tidak ada
  // di daftar dari API.
  const opsiTipe = [
    ...new Set([...(initialData?.tipe ? [initialData.tipe] : []), ...tipeList]),
  ].map((t) => ({ value: t, label: t }));

  const urlLama = urlBrosur(brosurLama ?? null);

  return (
    <FormModal
      open={open}
      onClose={() => {
        setNamaBerkas(null);
        onClose();
      }}
      onSubmit={onSubmit}
      schema={judulSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Judul Training"
      ukuran="lg"
    >
      {({ register, control, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextInput
              label="Kode"
              placeholder="Misal: CSR-12"
              error={errors.kode?.message}
              {...register("kode")}
            />
            <SelectInput
              label="Tipe"
              placeholder="Pilih tipe"
              opsi={opsiTipe}
              error={errors.tipe?.message}
              {...register("tipe")}
            />
            <TextInput
              label="Batch"
              type="number"
              inputMode="numeric"
              placeholder="Misal: 1"
              error={errors.batch?.message}
              {...register("batch")}
            />
          </div>

          <TextArea
            label="Judul Training"
            placeholder="Masukkan judul lengkap"
            error={errors.judulTraining?.message}
            {...register("judulTraining")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextInput
              label="Hari"
              type="number"
              inputMode="numeric"
              placeholder="Misal: 3"
              error={errors.hari?.message}
              {...register("hari")}
            />
            <TextInput
              label="Biaya Online (Rp)"
              type="number"
              inputMode="numeric"
              placeholder="Masukkan nominal"
              error={errors.biayaOnline?.message}
              {...register("biayaOnline")}
            />
            <TextInput
              label="Biaya Offline (Rp)"
              type="number"
              inputMode="numeric"
              placeholder="Masukkan nominal"
              error={errors.biayaOffline?.message}
              {...register("biayaOffline")}
            />
          </div>

          <Field label="Brosur" optional error={errors.brosur?.message}>
            <Controller
              control={control}
              name="brosur"
              render={({ field }) => (
                <div className="space-y-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const berkas = e.target.files?.[0] ?? null;
                      field.onChange(berkas);
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
                            field.onChange(null);
                            setNamaBerkas(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="text-zinc-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ) : urlLama ? (
                      <a
                        href={urlLama}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Lihat brosur saat ini
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">
                        Belum ada brosur
                      </span>
                    )}
                  </div>

                  {urlLama && namaBerkas && (
                    <p className="text-[10px] text-amber-600">
                      Brosur lama akan diganti berkas baru ini.
                    </p>
                  )}
                </div>
              )}
            />
          </Field>
        </>
      )}
    </FormModal>
  );
}
