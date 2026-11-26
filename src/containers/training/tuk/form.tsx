"use client";

/** Skema dan field formulir TUK. Kerangka modalnya dari FormModal. */
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { TextArea, TextInput } from "@/components/base/form-field";

export const tukSchema = z.object({
  noSK: z.string().min(1, "No SK wajib diisi"),
  noPenetapan: z.string().optional(),
  tglSanggup: z.string().optional(),
  nama: z.string().min(1, "Nama TUK wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  telp: z.string().optional(),
});

export type TUKFormValues = z.infer<typeof tukSchema>;

const NILAI_KOSONG: TUKFormValues = {
  noSK: "",
  noPenetapan: "",
  tglSanggup: "",
  nama: "",
  alamat: "",
  telp: "",
};

export interface TUKFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TUKFormValues) => Promise<void>;
  initialData?: TUKFormValues | null;
  isLoading?: boolean;
}

export function TUKForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: TUKFormProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={tukSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Data TUK"
      deskripsi={`Lengkapi formulir di bawah ini untuk ${
        initialData ? "memperbarui" : "menambahkan"
      } data Tempat Uji Kompetensi.`}
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="No SK"
              placeholder="Masukkan No SK"
              error={errors.noSK?.message}
              {...register("noSK")}
            />
            <TextInput
              label="No Penetapan"
              optional
              placeholder="Masukkan No Penetapan"
              {...register("noPenetapan")}
            />
          </div>

          <TextInput
            label="Nama TUK"
            placeholder="Masukkan nama TUK"
            error={errors.nama?.message}
            {...register("nama")}
          />

          <TextArea
            label="Alamat"
            placeholder="Masukkan alamat TUK"
            error={errors.alamat?.message}
            {...register("alamat")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Telp"
              optional
              placeholder="021-XXXXX"
              {...register("telp")}
            />
            <TextInput
              label="Tgl Kesanggupan"
              optional
              type="date"
              {...register("tglSanggup")}
            />
          </div>
        </>
      )}
    </FormModal>
  );
}
