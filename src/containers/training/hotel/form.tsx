"use client";

/** Skema dan field formulir Hotel. Kerangka modalnya dari FormModal. */
import { z } from "zod";
import { FormModal } from "@/components/base/form-modal";
import { SelectInput, TextArea, TextInput } from "@/components/base/form-field";

export const hotelSchema = z.object({
  kodeHotel: z.string().min(1, "Kode hotel wajib diisi"),
  namaHotel: z.string().min(1, "Nama hotel wajib diisi"),
  alamat: z.string().min(1, "Alamat hotel wajib diisi"),
  kota: z.string().min(1, "Kota wajib dipilih"),
  telepon: z.string().min(1, "Nomor telepon wajib diisi"),
  fax: z.string().optional(),
  pubRate: z.string().optional(),
  corRate: z.string().optional(),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;

const NILAI_KOSONG: HotelFormValues = {
  kodeHotel: "",
  namaHotel: "",
  alamat: "",
  kota: "",
  telepon: "",
  fax: "",
  pubRate: "",
  corRate: "",
};

export interface HotelFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HotelFormValues) => Promise<void>;
  initialData?: HotelFormValues | null;
  isLoading?: boolean;
  /** Pilihan kota, diambil dari tabel hotel lewat API. */
  kotaList: string[];
}

export function HotelForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  kotaList,
}: HotelFormProps) {
  const isEdit = !!initialData;

  // Kota yang sedang dipakai baris ini harus tetap muncul di dropdown,
  // walaupun entah bagaimana tidak ada di daftar dari API.
  const opsiKota = [
    ...new Set([...(initialData?.kota ? [initialData.kota] : []), ...kotaList]),
  ].map((k) => ({ value: k, label: k }));

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      schema={hotelSchema}
      defaultValues={NILAI_KOSONG}
      initialData={initialData}
      isLoading={isLoading}
      entitas="Data Hotel"
      ukuran="lg"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Kode Hotel"
              placeholder="Masukkan kode hotel"
              error={errors.kodeHotel?.message}
              // Kode hotel sekaligus identitas baris di backend
              // (where: { kodeHotel: id }), jadi tidak bisa diubah saat edit.
              readOnly={isEdit}
              title={isEdit ? "Kode hotel tidak bisa diubah" : undefined}
              className={isEdit ? "bg-zinc-50 cursor-not-allowed" : undefined}
              {...register("kodeHotel")}
            />
            <TextInput
              label="Nama Hotel"
              placeholder="Masukkan nama hotel"
              error={errors.namaHotel?.message}
              {...register("namaHotel")}
            />
          </div>

          <TextArea
            label="Alamat Hotel"
            placeholder="Masukkan alamat hotel"
            error={errors.alamat?.message}
            {...register("alamat")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectInput
              label="Kota"
              placeholder="Pilih kota"
              opsi={opsiKota}
              error={errors.kota?.message}
              {...register("kota")}
            />
            <TextInput
              label="Telepon"
              placeholder="021-XXXXX"
              error={errors.telepon?.message}
              {...register("telepon")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextInput
              label="Fax"
              optional
              placeholder="021-XXXXX"
              {...register("fax")}
            />
            <TextInput
              label="Pub. Rate (Rp)"
              optional
              type="number"
              inputMode="numeric"
              placeholder="Masukkan nominal"
              {...register("pubRate")}
            />
            <TextInput
              label="Corporate (Rp)"
              optional
              type="number"
              inputMode="numeric"
              placeholder="Masukkan nominal"
              {...register("corRate")}
            />
          </div>
        </>
      )}
    </FormModal>
  );
}
