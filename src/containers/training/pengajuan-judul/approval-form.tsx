"use client";
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { SelectInput, TextArea } from "@/components/base/form-field";
import type { PengajuanListItem } from "@/lib/types/pengajuan-judul";

const schema = z.object({ responMA: z.enum(["DISETUJUI","DITOLAK"]), catatanMA: z.string().max(10000) })
  .refine((v) => v.responMA !== "DITOLAK" || Boolean(v.catatanMA.trim()), { message: "Alasan penolakan wajib diisi", path: ["catatanMA"] });
export type ApprovalValues = z.infer<typeof schema>;

export function ApprovalForm({ row, onClose, onSubmit, isLoading }: {
  row: PengajuanListItem; onClose: () => void; onSubmit: (data: ApprovalValues) => Promise<void>; isLoading: boolean;
}) {
  return <FormModal open onClose={onClose} onSubmit={onSubmit} schema={schema} entitas="Keputusan Pengajuan"
    defaultValues={{ responMA: "DISETUJUI", catatanMA: row.catatanMA || "" }} isLoading={isLoading}>
    {({ register, formState: { errors } }) => <>
      <p className="text-sm font-semibold">{row.judulTraining}</p>
      <SelectInput label="Keputusan" opsi={[{ value: "DISETUJUI", label: "Setujui" },{ value: "DITOLAK", label: "Tolak" }]}
        {...register("responMA")} />
      <TextArea label="Catatan / alasan penolakan" {...register("catatanMA")} error={errors.catatanMA?.message} />
    </>}
  </FormModal>;
}
