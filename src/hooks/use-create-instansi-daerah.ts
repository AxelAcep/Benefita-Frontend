// hooks/use-create-instansi-daerah.ts
"use client";

import { useState } from "react";
import { createTabPerusahaan } from "@/lib/services/new.perusahaan.service";
import type { InstansiDaerahFormData } from "../app/database/instansi-daerah/(form)/card-instansi-daerah";
import type { LokasiPemdaFormData } from "../app/database/instansi-daerah/(form)/card-lokasi-pemda";
import type { KontakFormData } from "../app/database/instansi-daerah/(form)/card-kontak";
import type { InformasiInstansiFormData } from "../app/database/instansi-daerah/(form)/card-informasi-instansi";
import type { TrainingFormData } from "../app/database/instansi-daerah/(form)/card-training";
import type { PrioritasFormData } from "../app/database/instansi-daerah/(form)/card-prioritas";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface CreateInstansiDaerahForm {
  instansiDaerah: InstansiDaerahFormData;
  lokasi: LokasiPemdaFormData;
  kontak: KontakFormData;
  informasiInstansi: InformasiInstansiFormData;
  training: TrainingFormData;
  prioritas: PrioritasFormData;
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useCreateInstansiDaerah() {
  const [form, setForm] = useState<CreateInstansiDaerahForm>({
    instansiDaerah: { instansi: "", kode: "" },
    lokasi: { kotaKabupaten: "", provinsi: "", alamat: "" },
    kontak: { telpon: "", fax: "", email: "" },
    informasiInstansi: {
      tender1: "",
      tender2: "",
      tender3: "",
      keterangan: "",
    },
    training: { kebutuhanTraining: "", yangPernahDiikuti: "", fasilitas: "" },
    prioritas: { prioritasMANN: "", prioritasAE: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSection<K extends keyof CreateInstansiDaerahForm>(
    section: K,
    data: CreateInstansiDaerahForm[K],
  ) {
    setForm((prev) => ({ ...prev, [section]: data }));
  }

  async function submit(): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      await createTabPerusahaan({
        // CORE
        jenisInstansi: "INSTANSI_DAERAH",
        noInduk: form.instansiDaerah.instansi, // noInduk wajib — sesuaikan jika ada field khusus
        company: form.instansiDaerah.instansi,

        // INSTANSI DAERAH
        instansi: form.instansiDaerah.instansi,
        kode: form.instansiDaerah.kode,

        // LOKASI
        kotaKabupaten: form.lokasi.kotaKabupaten,
        provinsi: form.lokasi.provinsi,
        alamat: form.lokasi.alamat,

        // KONTAK
        telp: form.kontak.telpon,
        fax: form.kontak.fax,
        email: form.kontak.email,

        // INFORMASI INSTANSI
        tender1: form.informasiInstansi.tender1,
        tender2: form.informasiInstansi.tender2,
        tender3: form.informasiInstansi.tender3,
        ket: form.informasiInstansi.keterangan,

        // TRAINING
        butuhTraining: form.training.kebutuhanTraining,
        pelatihanDiikuti: form.training.yangPernahDiikuti,
        fasilitas: form.training.fasilitas,

        // PRIORITAS
        prioritasMa: form.prioritas.prioritasMANN,
        prioritasAe: form.prioritas.prioritasAE,
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
