"use client";

/** Skema dan field formulir Pengajuan Judul. Kerangka modalnya dari FormModal. */
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { Field, TextArea, TextInput } from "@/components/base/form-field";
import { PerusahaanSelect } from "@/components/base/PerusahaanSelect";

const angkaTidakNegatif = (label: string) =>
  z
    .string()
    .optional()
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      `${label} tidak boleh negatif`,
    );

export const pengajuanSchema = z.object({
  judulTraining: z.string().min(1, "Judul training wajib diisi"),
  jumlahHari: z
    .string()
    .min(1, "Jumlah hari wajib diisi")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      "Jumlah hari tidak boleh negatif",
    ),
  perusahaanId: z.string().optional(),
  namaKontak: z.string().optional(),
  kontak: z.string().optional(),
  jumlahPeserta: angkaTidakNegatif("Jumlah peserta"),
  responMA: z.string().optional(),
});

export type PengajuanFormValues = z.infer<typeof pengajuanSchema>;

const NILAI_KOSONG: PengajuanFormValues = {
  judulTraining: "",
  jumlahHari: "",
  perusahaanId: "",
  namaKontak: "",
  kontak: "",
  jumlahPeserta: "",
  responMA: "",
};

export interface PengajuanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PengajuanFormValues) => Promise<void>;
  initialData?: PengajuanFormValues | null;
  isLoading?: boolean;
}

export function PengajuanForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: PengajuanFormProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={pengajuanSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Pengajuan Judul"
    >
      {({ register, control, formState: { errors } }) => (
        <>
          <TextArea
            label="Judul Lengkap"
            placeholder="Masukkan judul lengkap training..."
            error={errors.judulTraining?.message}
            {...register("judulTraining")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Jumlah Hari"
              type="number"
              inputMode="numeric"
              placeholder="Misal: 3"
              error={errors.jumlahHari?.message}
              {...register("jumlahHari")}
            />
            <TextInput
              label="Jumlah Peserta"
              optional
              type="number"
              inputMode="numeric"
              placeholder="Estimasi peserta"
              error={errors.jumlahPeserta?.message}
              {...register("jumlahPeserta")}
            />
          </div>

          <Field
            label="Perusahaan/Instansi"
            optional
            error={errors.perusahaanId?.message}
          >
            <Controller
              control={control}
              name="perusahaanId"
              render={({ field }) => (
                <PerusahaanSelect
                  value={field.value}
                  // PerusahaanSelect mengirim noInduk dan nama; yang disimpan
                  // hanya noInduk, atau teks manual kalau tidak ada di daftar.
                  onChange={(noInduk, company) =>
                    field.onChange(noInduk || company)
                  }
                  placeholder="Cari perusahaan atau ketik manual"
                />
              )}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Nama Kontak"
              optional
              placeholder="Nama PIC"
              {...register("namaKontak")}
            />
            <TextInput
              label="Kontak"
              optional
              placeholder="No. Telp"
              {...register("kontak")}
            />
          </div>

          <TextArea
            label="Respons MA"
            optional
            placeholder="Masukkan respons MA..."
            {...register("responMA")}
          />
        </>
      )}
    </FormModal>
  );
}
