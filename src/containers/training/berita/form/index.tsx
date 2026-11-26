"use client";

/**
 * Formulir berita, dipakai dua rute sekaligus:
 *   /training/berita/tambah        tanpa id  -> mode tambah
 *   /training/berita/edit/[id]     ada id    -> mode ubah
 *
 * Dulu keduanya file terpisah yang isinya nyaris sama: bedanya cuma 42
 * baris, dan seluruhnya soal dari mana `isEdit` berasal. Mode sekarang
 * diturunkan dari ada atau tidaknya id di URL, jadi tidak ada lagi dua
 * salinan yang bisa melenceng.
 */
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Newspaper, Send } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { ModuleAccess } from "@/components/base/module-access";
import { SelectInput, TextArea, TextInput } from "@/components/base/form-field";
import { useBeritaAction, useBeritaById } from "@/hooks/use-berita";

const beritaSchema = z.object({
  periode: z.string().min(1, "Periode / Batas wajib diisi"),
  isi: z.string().min(1, "Isi berita wajib diisi"),
  status: z.enum(["aktif", "nonaktif"]).optional(),
});

type BeritaFormValues = z.infer<typeof beritaSchema>;

const STATUS_OPSI = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Tidak Aktif" },
];

export default function BeritaFormContainer() {
  const params = useParams<{ id?: string }>();
  const id = params?.id ?? null;

  return (
    <ModuleAccess modul="training" label="Training" aksi={id ? "update" : "create"}>
      <BeritaForm id={id} />
    </ModuleAccess>
  );
}

function BeritaForm({ id }: { id: string | null }) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const { data: detail, loading: detailLoading } = useBeritaById(id);
  const { simpan, loading: saving, error: saveError } = useBeritaAction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BeritaFormValues>({
    resolver: zodResolver(beritaSchema),
    defaultValues: { periode: "", isi: "", status: "aktif" },
  });

  useEffect(() => {
    if (!detail) return;
    reset({
      // Input type="date" hanya menerima YYYY-MM-DD, bukan ISO lengkap.
      periode: detail.periode ? detail.periode.split("T")[0] : "",
      isi: detail.isi,
      status: detail.status,
    });
  }, [detail, reset]);

  const sedangProses = saving || isSubmitting || detailLoading;

  const onSubmit = async (data: BeritaFormValues) => {
    // status tidak dikirim: backend menentukannya sendiri dari periode.
    const berhasil = await simpan(id, {
      periode: data.periode,
      isi: data.isi,
    });
    if (berhasil) router.push("/training/berita");
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Berita", href: "/training/berita" },
        { label: isEdit ? "Edit Berita" : "Tambah Berita" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              Form {isEdit ? "Perubahan" : "Pengajuan"} Berita
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {isEdit
                ? "Ubah data berita di bawah ini"
                : "Lengkapi data pengajuan di bawah ini"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6 space-y-5">
            {saveError && (
              <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-semibold">
                {saveError}
              </div>
            )}

            <p className="text-xs font-semibold text-zinc-700">
              Detail Pengajuan
            </p>

            <TextInput
              label="Periode / Batas"
              type="date"
              error={errors.periode?.message}
              disabled={sedangProses}
              {...register("periode")}
            />

            <TextArea
              label="Isi"
              rows={5}
              placeholder="Masukkan deskripsi berita"
              error={errors.isi?.message}
              disabled={sedangProses}
              {...register("isi")}
            />

            {isEdit && (
              <SelectInput
                label="Status (Berdasarkan Periode)"
                optional
                opsi={STATUS_OPSI}
                // Dikunci karena backend menghitungnya dari periode;
                // mengubahnya di sini tidak akan berpengaruh.
                disabled
                title="Status mengikuti periode, tidak bisa diubah manual"
                {...register("status")}
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.push("/training/berita")}
              disabled={sedangProses}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sedangProses}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[130px] justify-center"
            >
              <Send className="w-3.5 h-3.5" />
              {sedangProses ? "Memproses..." : isEdit ? "Simpan Perubahan" : "Kirim Pengajuan"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
