"use client";

/** Modal tambah dan ubah role. Khusus halaman ini. */
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { TextArea, TextInput } from "@/components/base/form-field";

export const roleSchema = z.object({
  kode: z.string().min(1, "Kode role wajib diisi"),
  nama: z.string().min(1, "Nama role wajib diisi"),
  deskripsi: z.string().optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

const NILAI_KOSONG: RoleFormValues = { kode: "", nama: "", deskripsi: "" };

export interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  initialData?: RoleFormValues | null;
  isLoading?: boolean;
}

export function RoleForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: RoleFormProps) {
  const isEdit = !!initialData;

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={roleSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Role"
      deskripsi={
        isEdit
          ? "Kode role tidak bisa diubah karena dipakai pada data pengguna."
          : "Role baru dibuat tanpa izin apa pun. Centang izinnya setelah ini."
      }
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextInput
            label="Kode"
            placeholder="Misal: AUDITOR_INTERNAL"
            error={errors.kode?.message}
            // Kode dipakai sebagai nilai role pada data pengguna dan di
            // dalam token, jadi tidak bisa diganti setelah dibuat.
            readOnly={isEdit}
            title={isEdit ? "Kode role tidak bisa diubah" : undefined}
            className={isEdit ? "bg-zinc-50 cursor-not-allowed" : undefined}
            {...register("kode")}
          />
          <TextInput
            label="Nama"
            placeholder="Misal: Auditor Internal"
            error={errors.nama?.message}
            {...register("nama")}
          />
          <TextArea
            label="Deskripsi"
            optional
            placeholder="Untuk apa role ini dipakai"
            {...register("deskripsi")}
          />
        </>
      )}
    </FormModal>
  );
}
