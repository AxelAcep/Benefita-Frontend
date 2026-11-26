"use client";

import { z } from "zod";
import { SelectInput, TextArea, TextInput } from "@/components/base/form-field";
import { FormModal } from "@/components/base/form-modal";
import { useBdoPegawai } from "@/hooks/use-bdo-pegawai";
import { STATUS_TUGAS } from "./data";

const schema = z.object({
  status: z.enum(STATUS_TUGAS),
  picId: z.string().min(1, "PIC wajib dipilih."),
  dueDate: z.union([z.literal(""), z.iso.date()]),
  penerimaId: z.string(),
  kegiatan: z.string().trim().min(1, "Kegiatan wajib diisi."),
});

export type TugasFormValues = z.infer<typeof schema>;

const DEFAULT_FORM: TugasFormValues = {
  status: "Berjalan",
  picId: "",
  dueDate: "",
  penerimaId: "",
  kegiatan: "",
};

const opsiStatus = STATUS_TUGAS.map((value) => ({ label: value, value }));

interface TugasFormProps {
  open: boolean;
  initialData: TugasFormValues | null;
  onClose: () => void;
  onSave: (values: TugasFormValues) => void | Promise<void>;
}

export function TugasForm({ open, initialData, onClose, onSave }: TugasFormProps) {
  const { data: pegawai, loading } = useBdoPegawai();

  const opsiPegawai = pegawai.map((p) => ({
    label: p.userData ? `${p.nama} (${p.userData})` : p.nama,
    value: p.id,
  }));

  return (
    <FormModal
      open={open}
      onClose={onClose}
      schema={schema}
      initialData={initialData}
      defaultValues={DEFAULT_FORM}
      onSubmit={onSave}
      entitas="Tugas"
    >
      {({ register, formState: { errors } }) => (
        <>
          <SelectInput label="Status" opsi={opsiStatus} {...register("status")} />
          <SelectInput
            label="PIC"
            opsi={[
              { label: loading ? "Memuat..." : "Pilih pegawai", value: "" },
              ...opsiPegawai,
            ]}
            {...register("picId")}
            error={errors.picId?.message}
          />
          <TextInput
            label="Tenggat"
            optional
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />
          <SelectInput
            label="Penerima Laporan"
            optional
            opsi={[{ label: "Tanpa penerima", value: "" }, ...opsiPegawai]}
            {...register("penerimaId")}
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
