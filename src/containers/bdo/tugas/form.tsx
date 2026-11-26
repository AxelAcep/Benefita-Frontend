"use client";

import { z } from "zod";
import { SelectInput, TextArea, TextInput } from "@/components/base/form-field";
import { FormModal } from "@/components/base/form-modal";
import { DATA_CONTOH, STATUS_TUGAS } from "./data";

const schema = z.object({
  status: z.enum(STATUS_TUGAS),
  pic: z.string().min(1, "PIC wajib dipilih."),
  dueDate: z.union([z.literal(""), z.iso.date()]),
  penerimaLaporan: z.string(),
  kegiatan: z.string().trim().min(1, "Kegiatan wajib diisi."),
});

export type TugasFormValues = z.infer<typeof schema>;

const DEFAULT_FORM: TugasFormValues = {
  status: "Tugas",
  pic: "Exel",
  dueDate: "",
  penerimaLaporan: "Nanang",
  kegiatan: "",
};

const PIC_CONTOH = [...new Set(["Exel", ...DATA_CONTOH.map((row) => row.pic)])];
const PENERIMA_CONTOH = ["Nanang", "Axel", "Aldy", "Andi"];
const opsi = (values: readonly string[]) => values.map((value) => ({ label: value, value }));

interface TugasFormProps {
  open: boolean;
  initialData: TugasFormValues | null;
  onClose: () => void;
  onSave: (values: TugasFormValues) => void;
}

export function TugasForm({ open, initialData, onClose, onSave }: TugasFormProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      schema={schema}
      initialData={initialData}
      defaultValues={DEFAULT_FORM}
      onSubmit={onSave}
      entitas="Tugas atau Pelaporan"
    >
      {({ register, formState: { errors } }) => (
        <>
          <SelectInput label="Status" opsi={opsi(STATUS_TUGAS)} {...register("status")} />
          <SelectInput label="PIC" opsi={opsi(PIC_CONTOH)} {...register("pic")} error={errors.pic?.message} />
          <TextInput label="Tenggat" optional type="date" {...register("dueDate")} error={errors.dueDate?.message} />
          <SelectInput
            label="Penerima Laporan"
            optional
            opsi={[{ label: "Tanpa penerima", value: "" }, ...opsi(PENERIMA_CONTOH)]}
            {...register("penerimaLaporan")}
          />
          <TextArea
            label="Kegiatan / Tindak Lanjut"
            rows={4}
            {...register("kegiatan")}
            error={errors.kegiatan?.message}
          />
        </>
      )}
    </FormModal>
  );
}
