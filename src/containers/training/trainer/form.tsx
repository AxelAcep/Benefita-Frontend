"use client";

/** Skema dan field formulir Trainer. Kerangka modalnya dari FormModal. */
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { TextArea, TextInput } from "@/components/base/form-field";

export const trainerSchema = z.object({
  kode: z.string().min(1, "Kode wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  hp: z.string().optional(),
  email: z.string().optional(),
  alamat: z.string().optional(),
  kantor: z.string().optional(),
  alamatKantor: z.string().optional(),
  noTelpKantor: z.string().optional(),
  /** Dipisah koma. Backend menyimpannya sebagai satu string. */
  referensi: z.string().optional(),
  subyekKhusus: z.string().optional(),
  keterangan: z.string().optional(),
  tugas: z.string().optional(),
  statusAktif: z.boolean().optional(),
});

export type TrainerFormValues = z.infer<typeof trainerSchema>;

const NILAI_KOSONG: TrainerFormValues = {
  kode: "",
  nama: "",
  hp: "",
  email: "",
  alamat: "",
  kantor: "",
  alamatKantor: "",
  noTelpKantor: "",
  referensi: "",
  subyekKhusus: "",
  keterangan: "",
  tugas: "",
  statusAktif: true,
};

export interface TrainerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TrainerFormValues) => Promise<void>;
  initialData?: TrainerFormValues | null;
  isLoading?: boolean;
}

export function TrainerForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: TrainerFormProps) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={trainerSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Data Trainer"
      ukuran="lg"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextInput
              label="Kode"
              placeholder="Misal: HH"
              error={errors.kode?.message}
              {...register("kode")}
            />
            <TextInput
              label="Nama"
              placeholder="Masukkan nama trainer"
              error={errors.nama?.message}
              wrapperClassName="sm:col-span-2"
              {...register("nama")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="HP / Telp"
              optional
              placeholder="08xxxxxxxxxx"
              {...register("hp")}
            />
            <TextInput
              label="Email"
              optional
              type="email"
              placeholder="nama@contoh.com"
              {...register("email")}
            />
          </div>

          <TextArea
            label="Alamat"
            optional
            placeholder="Masukkan alamat"
            {...register("alamat")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Kantor"
              optional
              placeholder="Misal: Jakarta"
              {...register("kantor")}
            />
            <TextInput
              label="No Telp Kantor"
              optional
              placeholder="(021) xxxxxx"
              {...register("noTelpKantor")}
            />
          </div>

          <TextArea
            label="Alamat Kantor"
            optional
            placeholder="Masukkan alamat kantor"
            {...register("alamatKantor")}
          />

          <TextArea
            label="Referensi"
            optional
            placeholder="Pisahkan dengan koma, misal: FI-10, FI-11, PR-08"
            {...register("referensi")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Subyek Khusus"
              optional
              placeholder="Misal: Manajemen"
              {...register("subyekKhusus")}
            />
            <TextInput
              label="Tugas"
              optional
              placeholder="Misal: 24 Mar 2025"
              {...register("tugas")}
            />
          </div>

          <TextArea
            label="Keterangan"
            optional
            placeholder="Catatan tambahan"
            {...register("keterangan")}
          />

          <label className="flex items-center gap-2 text-xs text-zinc-600">
            <input
              type="checkbox"
              className="w-4 h-4 accent-emerald-500"
              {...register("statusAktif")}
            />
            Trainer aktif
          </label>
        </>
      )}
    </FormModal>
  );
}
