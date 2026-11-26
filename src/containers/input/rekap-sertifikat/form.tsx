"use client";

import { useMemo } from "react";
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { TextInput } from "@/components/base/form-field";
import type { SertifikatPelatihan } from "@/lib/types/rekap-sertifikat";

const schema = z.object({
  noSertifikat: z.string().trim().max(200, "Maksimal 200 karakter."),
  noReg: z.string().trim().max(200, "Maksimal 200 karakter."),
});
export type SertifikatFormValues = z.infer<typeof schema>;
const defaults: SertifikatFormValues = { noSertifikat: "", noReg: "" };

export function SertifikatForm({ row, onClose, onSubmit, saving, error }: {
  row: SertifikatPelatihan | null;
  onClose: () => void;
  onSubmit: (data: SertifikatFormValues) => Promise<void>;
  saving: boolean;
  error: string | null;
}) {
  const initialData = useMemo(() => row ? { noSertifikat: row.noSertifikat ?? "", noReg: row.noReg ?? "" } : null, [row]);
  return (
    <FormModal open={!!row} onClose={onClose} onSubmit={onSubmit} schema={schema} defaultValues={defaults} initialData={initialData} isLoading={saving} entitas="Nomor Sertifikat" deskripsi={row?.nama}>
      {({ register, formState: { errors } }) => (
        <>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <TextInput label="No. Sertifikat" error={errors.noSertifikat?.message} {...register("noSertifikat")} />
          <TextInput label="No. Registrasi" error={errors.noReg?.message} {...register("noReg")} />
        </>
      )}
    </FormModal>
  );
}
