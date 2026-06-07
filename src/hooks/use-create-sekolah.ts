// hooks/use-create-sekolah.ts
"use client";

import { useState } from "react";
import { createTabPerusahaan } from "@/lib/services/new.perusahaan.service";
import type { InstansiSekolahFormData } from "@/app/database/sekolah/(form)/card-instansi-sekolah";
import type { KontakFormData } from "@/app/database/sekolah/(form)/card-kontak";
import type { LokasiSekolahFormData } from "@/app/database/sekolah/(form)/card-lokasi-sekolah";
import type { KlasifikasiFormData } from "@/app/database/sekolah/(form)/card-klasifikasi";
import type { InformasiSekolahDetailFormData } from "@/app/database/sekolah/(form)/card-infromasi-sekolah-detail";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface CreateSekolahForm {
  instansiSekolah: InstansiSekolahFormData;
  kontak: KontakFormData;
  lokasi: LokasiSekolahFormData;
  klasifikasi: KlasifikasiFormData;
  informasiSekolahDetail: InformasiSekolahDetailFormData;
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useCreateSekolah() {
  const [form, setForm] = useState<CreateSekolahForm>({
    instansiSekolah: { instansi: "", kode: "" },
    kontak: { telpon: "", fax: "", email: "" },
    lokasi: { alamat: "" },
    klasifikasi: {
      kategoriCpn: "",
      lineBisnis: "",
      lineBisnisSub: "",
      permodalan: "",
    },
    informasiSekolahDetail: {
      pemilik: "",
      fasilitas: "",
      yayasan: "",
      akreditasi: "",
      group: "",
      cp: "",
      keterangan: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSection<K extends keyof CreateSekolahForm>(
    section: K,
    data: CreateSekolahForm[K],
  ) {
    setForm((prev) => ({ ...prev, [section]: data }));
  }

  async function submit(): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      await createTabPerusahaan({
        // CORE
        jenisInstansi: "SEKOLAH",
        noInduk: form.instansiSekolah.kode,
        company: form.instansiSekolah.instansi,
        instansi: form.instansiSekolah.instansi,
        kode: form.instansiSekolah.kode,

        // KONTAK
        telp: form.kontak.telpon,
        fax: form.kontak.fax,
        email: form.kontak.email,

        // LOKASI
        alamat: form.lokasi.alamat,

        // KLASIFIKASI
        kategoriCpn: form.klasifikasi.kategoriCpn,
        lineOfBusiness: form.klasifikasi.lineBisnis,
        lineBisnisSub: form.klasifikasi.lineBisnisSub,
        permodalan: form.klasifikasi.permodalan,

        // INFORMASI SEKOLAH DETAIL
        pemilik: form.informasiSekolahDetail.pemilik,
        fasilitas: form.informasiSekolahDetail.fasilitas,
        yayasan: form.informasiSekolahDetail.yayasan,
        akreditasi: form.informasiSekolahDetail.akreditasi,
        group: form.informasiSekolahDetail.group,
        cpSekolah: form.informasiSekolahDetail.cp,
        ket: form.informasiSekolahDetail.keterangan,
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { form, setSection, submit, loading, error };
}
