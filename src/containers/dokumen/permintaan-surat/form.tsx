"use client";

import { Controller } from "react-hook-form";
import { z } from "zod";
import { PerusahaanSelect } from "@/components/base/PerusahaanSelect";
import { Field, TextArea } from "@/components/base/form-field";
import { FormModal } from "@/components/base/form-modal";

const schema = z.object({
  keterangan: z.string().trim().min(1, "Keterangan wajib diisi."),
  tujuanNoInduk: z.string().trim().min(1, "Perusahaan tujuan wajib diisi."),
});

export type SuratFormValues = z.infer<typeof schema>;

const NILAI_KOSONG: SuratFormValues = { keterangan: "", tujuanNoInduk: "" };

interface SuratFormProps {
  open: boolean;
  initialData: SuratFormValues | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: SuratFormValues) => Promise<void>;
}

export function SuratForm({ open, initialData, isLoading, error, onClose, onSubmit }: SuratFormProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      schema={schema}
      initialData={initialData}
      defaultValues={NILAI_KOSONG}
      onSubmit={onSubmit}
      isLoading={isLoading}
      entitas="Permintaan Nomor Surat"
    >
      {({ register, control, formState: { errors } }) => (
        <>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <TextArea
            label="Keterangan"
            rows={4}
            {...register("keterangan")}
            disabled={isLoading}
            error={errors.keterangan?.message}
            placeholder="Masukkan keterangan"
          />
          <Controller
            control={control}
            name="tujuanNoInduk"
            render={({ field, fieldState }) => (
              <Field label="Tujuan Surat">
                <PerusahaanSelect
                  value={field.value}
                  onChange={(noInduk, company) => field.onChange(noInduk || company)}
                  disabled={isLoading}
                  error={fieldState.error?.message}
                  placeholder="Pilih perusahaan atau ketik tujuan surat..."
                />
              </Field>
            )}
          />
        </>
      )}
    </FormModal>
  );
}
