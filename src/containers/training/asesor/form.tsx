"use client";

/** Skema dan field formulir Asesor. Kerangka modalnya dari FormModal. */
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { TextInput } from "@/components/base/form-field";

export const asesorSchema = z.object({
  nama: z.string().min(1, "Nama asesor wajib diisi"),
  noRegAsesor: z.string().optional(),
});

export type AsesorFormValues = z.infer<typeof asesorSchema>;

const NILAI_KOSONG: AsesorFormValues = { nama: "", noRegAsesor: "" };

export interface AsesorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AsesorFormValues) => Promise<void>;
  initialData?: AsesorFormValues | null;
  isLoading?: boolean;
}

export function AsesorForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: AsesorFormProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={asesorSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Data Asesor"
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextInput
            label="Nama Asesor"
            placeholder="Masukkan nama asesor"
            error={errors.nama?.message}
            {...register("nama")}
          />
          <TextInput
            label="No Reg Asesor"
            optional
            placeholder="Masukkan No Reg Asesor"
            {...register("noRegAsesor")}
          />
        </>
      )}
    </FormModal>
  );
}
