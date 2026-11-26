"use client";

/**
 * Modal berisi form: BaseModal + react-hook-form + zod + tombol Simpan/Batal.
 *
 * Yang diurus di sini dan tidak perlu ditulis ulang tiap halaman:
 *  - useForm + zodResolver
 *  - reset nilai form tiap modal dibuka (termasuk saat ganti baris yang diedit)
 *  - keadaan menyimpan: tombol dikunci, modal tidak bisa ditutup sembarangan
 *  - judul dan teks tombol menyesuaikan mode tambah atau ubah
 *
 * Isi field-nya diserahkan ke pemanggil lewat render prop, supaya tiap
 * halaman bebas mengatur tata letaknya.
 */
import React, { useEffect } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { Loader2, Save } from "lucide-react";
import { BaseModal, type UkuranModal } from "@/components/base/base-modal";

export interface FormModalProps<T extends FieldValues> {
  open: boolean;
  onClose: () => void;
  schema: ZodType<T, FieldValues>;
  /** Nilai awal form. Isi = mode ubah, null/undefined = mode tambah. */
  initialData?: DefaultValues<T> | null;
  /** Nilai saat mode tambah; juga dipakai mengosongkan field yang tidak terisi. */
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<void> | void;
  isLoading?: boolean;
  /** Contoh: "Data TUK" -> "Tambah Data TUK" / "Edit Data TUK". */
  entitas: string;
  deskripsi?: React.ReactNode;
  ukuran?: UkuranModal;
  children: (form: UseFormReturn<T, unknown, T>) => React.ReactNode;
}

export function FormModal<T extends FieldValues>({
  open,
  onClose,
  schema,
  initialData,
  defaultValues,
  onSubmit,
  isLoading = false,
  entitas,
  deskripsi,
  ukuran = "md",
  children,
}: FormModalProps<T>) {
  const isEdit = !!initialData;

  // Cast resolver: zodResolver mengembalikan Resolver<FieldValues, ...>,
  // sedangkan useForm di sini sudah dipaku ke T. Keduanya setara saat
  // dipakai, tapi TypeScript tidak bisa menyimpulkannya lewat generic.
  const form = useForm<T, unknown, T>({
    resolver: zodResolver(schema) as unknown as Resolver<T, unknown, T>,
    defaultValues,
  });

  const { handleSubmit, reset } = form;

  // Reset tiap modal dibuka, dan tiap baris yang diedit berganti. Tanpa ini
  // modal menampilkan sisa data baris sebelumnya.
  useEffect(() => {
    if (!open) return;
    reset({ ...defaultValues, ...(initialData ?? {}) } as DefaultValues<T>);
    // defaultValues biasanya objek literal inline, identitasnya berubah tiap
    // render, jadi tidak dimasukkan ke dependensi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      kunci={isLoading}
      ukuran={ukuran}
      judul={`${isEdit ? "Edit" : "Tambah"} ${entitas}`}
      deskripsi={
        deskripsi ??
        `Lengkapi formulir di bawah ini untuk ${
          isEdit ? "memperbarui" : "menambahkan"
        } ${entitas.toLowerCase()}.`
      }
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
      })}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[110px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Simpan Data
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">{children(form)}</div>
    </BaseModal>
  );
}

export default FormModal;
