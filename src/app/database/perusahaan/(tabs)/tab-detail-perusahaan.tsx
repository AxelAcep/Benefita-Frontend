"use client";

import { useState, useEffect } from "react";
import CardPerusahaan from "../(form)/card-perusahaan";
import CardLokasi, { ZonaWaktu, LokasiFormData } from "../(form)/card-lokasi";
import CardSertifikasi, {
  IsoItem,
  ProperItem,
  isoListToLegacy,
  legacyToIsoList,
} from "../(form)/card-sertifikasi";
import CardKlasifikasi from "../(form)/card-klasifikasi";
import CardPropertiFinansial from "../(form)/card-properti";
import CardInformasiLainnya from "../(form)/card-lainya";
import CardSertifikasiBnsp from "../(form)/card-bnsp";
import CardKontak from "../(form)/card-kontak";
import {
  ModalPerusahaan,
  ModalLokasi,
  ModalSertifikasi,
  ModalKlasifikasi,
  ModalPropertiFinansial,
  ModalInformasiLainnya,
  ModalKontak,
} from "../(form)/modal-edit";
import {
  useGetOnePerusahaan,
  useUpdatePerusahaan,
} from "@/hooks/use-instansi-edit-perusahaan";
import { useRole } from "@/hooks/use-role";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface FormState {
  perusahaan: { instansi: string; kode: string; idSimpel: string };
  lokasi: LokasiFormData; // ✅ use LokasiFormData directly — ZonaWaktu is "WIB"|"WITA"|"WIT"|"-"
  sertifikasi: { isoList: IsoItem[]; properList: ProperItem[] };
  klasifikasi: {
    kategoriCpn: string;
    lineBisnis: string;
    lineBisnisSub: string;
    permodalan: string;
  };
  propertiFinansial: {
    subBidangNilai: string;
    subBidangBatasEmas: string;
    subBidangBatasHijau: string;
    fasilitas: string;
    infoKeuangan: string;
    keterangan: string;
    group: string;
    bdoAction: string;
    prioritasMANN: string;
    prioritasAE: string;
    vendor: string;
  };
  informasiLainnya: {
    cabangSite: string;
    pesaing: string;
    kebutuhanTraining: string;
    prosedurPelatihan: string;
  };
  sertifikasiBnsp: {
    pppa: string;
    popal: string;
    pppu: string;
    poippu: string;
    limbahB3: string;
    tpsLb3: string;
    sampah3R: string;
    pSampah: string;
    aEnergi: string;
    mEnergi: string;
    pcua: string;
    lca: string;
  };
  kontak: { telpon: string; fax: string; email: string };
}

export type EditingSection =
  | null
  | "perusahaan"
  | "lokasi"
  | "kontak"
  | "sertifikasi"
  | "klasifikasi"
  | "propertiFinansial"
  | "informasiLainnya"
  | "sertifikasiBnsp";

// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────

interface TabDetailPerusahaanProps {
  id: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Coerce an unknown string from the API into a valid ZonaWaktu, falling back to "-" */
function toZonaWaktu(value: unknown): ZonaWaktu {
  const valid: ZonaWaktu[] = ["WIB", "WITA", "WIT", "-"];
  return valid.includes(value as ZonaWaktu) ? (value as ZonaWaktu) : "-";
}

// ─────────────────────────────────────────────
// EMPTY FORM
// ─────────────────────────────────────────────

const EMPTY_FORM: FormState = {
  perusahaan: { instansi: "", kode: "", idSimpel: "" },
  lokasi: {
    alamatPusat: "",
    zonaWaktuPusat: "-", // "-" is a valid ZonaWaktu
    alamatFactory: "",
    zonaWaktuFactory: "-", // "-" is a valid ZonaWaktu
  },
  sertifikasi: { isoList: [], properList: [] },
  klasifikasi: {
    kategoriCpn: "",
    lineBisnis: "",
    lineBisnisSub: "",
    permodalan: "",
  },
  propertiFinansial: {
    subBidangNilai: "",
    subBidangBatasEmas: "",
    subBidangBatasHijau: "",
    fasilitas: "",
    infoKeuangan: "",
    keterangan: "",
    group: "",
    bdoAction: "",
    prioritasMANN: "",
    prioritasAE: "",
    vendor: "",
  },
  informasiLainnya: {
    cabangSite: "",
    pesaing: "",
    kebutuhanTraining: "",
    prosedurPelatihan: "",
  },
  sertifikasiBnsp: {
    pppa: "",
    popal: "",
    pppu: "",
    poippu: "",
    limbahB3: "",
    tpsLb3: "",
    sampah3R: "",
    pSampah: "",
    aEnergi: "",
    mEnergi: "",
    pcua: "",
    lca: "",
  },
  kontak: { telpon: "", fax: "", email: "" },
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function TabDetailPerusahaan({
  id,
  onSuccess,
  onError,
}: TabDetailPerusahaanProps) {
  const { data, isLoading, refetch } = useGetOnePerusahaan(id);
  const { mutate, isLoading: isSaving } = useUpdatePerusahaan();

  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { role, isAdmin, isFinance, isLoggedIn } = useRole();

  // Sync API response → form state
  // API may return raw strings for ZonaWaktu — coerce them at the boundary
  useEffect(() => {
    if (!data) return;
    setForm({
      perusahaan: data.perusahaan,
      lokasi: {
        alamatPusat: data.lokasi.alamatPusat ?? "",
        zonaWaktuPusat: toZonaWaktu(data.lokasi.zonaWaktuPusat),
        alamatFactory: data.lokasi.alamatFactory ?? "",
        zonaWaktuFactory: toZonaWaktu(data.lokasi.zonaWaktuFactory),
      },
      sertifikasi: {
        isoList: legacyToIsoList([
          data.sertifikasi.iso9001,
          data.sertifikasi.iso14001,
          data.sertifikasi.ohsas18001,
        ]),
        properList: [],
      },
      klasifikasi: data.klasifikasi,
      propertiFinansial: data.propertiFinansial,
      informasiLainnya: data.informasiLainnya,
      sertifikasiBnsp: data.sertifikasiBnsp,
      kontak: data.kontak,
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
        Memuat detail perusahaan...
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // SAVE HANDLER
  // ─────────────────────────────────────────────

  async function handleSaveSection<K extends Exclude<EditingSection, null>>(
    section: K,
    sectionData: FormState[K],
  ) {
    const merged: FormState = { ...form, [section]: sectionData };
    const [iso9000, iso14000, ohsas18001smk3] = isoListToLegacy(
      merged.sertifikasi.isoList,
    );

    await mutate(
      id,
      {
        company: merged.perusahaan.instansi,
        idSimpel: merged.perusahaan.idSimpel,
        alamat: merged.lokasi.alamatPusat,
        // "-" means "no selection" — send undefined to the API
        alamatWaktu:
          merged.lokasi.zonaWaktuPusat === "-"
            ? undefined
            : merged.lokasi.zonaWaktuPusat,
        alamatFactory: merged.lokasi.alamatFactory,
        alamatFactoryWaktu:
          merged.lokasi.zonaWaktuFactory === "-"
            ? undefined
            : merged.lokasi.zonaWaktuFactory,
        iso9000,
        iso14000,
        ohsas18001smk3,
        kategoriCpn: merged.klasifikasi.kategoriCpn,
        lineOfBusiness: merged.klasifikasi.lineBisnis,
        lineBisnisSub: merged.klasifikasi.lineBisnisSub,
        permodalan: merged.klasifikasi.permodalan,
        nilaiSubBidangProper:
          Number(merged.propertiFinansial.subBidangNilai) || undefined,
        batasEmas:
          Number(merged.propertiFinansial.subBidangBatasEmas) || undefined,
        batasHijau:
          Number(merged.propertiFinansial.subBidangBatasHijau) || undefined,
        fasilitas: merged.propertiFinansial.fasilitas,
        infoKeu: merged.propertiFinansial.infoKeuangan,
        ket: merged.propertiFinansial.keterangan,
        group: merged.propertiFinansial.group,
        bdoAction: merged.propertiFinansial.bdoAction,
        prioritasMa: merged.propertiFinansial.prioritasMANN,
        prioritasAe: merged.propertiFinansial.prioritasAE,
        vendor: merged.propertiFinansial.vendor,
        cabangSite: merged.informasiLainnya.cabangSite,
        pesaing: merged.informasiLainnya.pesaing,
        butuhTraining: merged.informasiLainnya.kebutuhanTraining,
        prosedurPelatihan: merged.informasiLainnya.prosedurPelatihan,
        telp: merged.kontak.telpon,
        fax: merged.kontak.fax,
        email: merged.kontak.email,
      },
      {
        onSuccess: () => {
          setEditingSection(null);
          setForm((p: FormState) => ({ ...p, [section]: sectionData }));
          refetch();
          onSuccess();
        },
        onError,
      },
    );
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <>
      <div className="space-y-4">
        <CardPerusahaan
          initialData={form.perusahaan}
          onChange={(val) =>
            setForm((p: FormState) => ({ ...p, perusahaan: val }))
          }
          disabled={isSaving}
          isEdit={role == "ADMIN" || role == "SUPER_ADMIN"}
          onEdit={() => setEditingSection("perusahaan")}
        />
        <CardLokasi
          initialData={form.lokasi}
          onChange={(val) => setForm((p: FormState) => ({ ...p, lokasi: val }))}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("lokasi")}
        />
        <CardKontak
          initialData={form.kontak}
          onChange={(val) => setForm((p: FormState) => ({ ...p, kontak: val }))}
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("kontak")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSertifikasi
            initialData={form.sertifikasi}
            onChange={(val) =>
              setForm((p: FormState) => ({ ...p, sertifikasi: val }))
            }
            disabled={isSaving}
            isEdit={true}
            onEdit={() => setEditingSection("sertifikasi")}
          />
          <CardKlasifikasi
            initialData={form.klasifikasi}
            onChange={(val) =>
              setForm((p: FormState) => ({ ...p, klasifikasi: val }))
            }
            disabled={isSaving}
            isEdit={true}
            onEdit={() => setEditingSection("klasifikasi")}
          />
        </div>
        <CardPropertiFinansial
          initialData={form.propertiFinansial}
          onChange={(val) =>
            setForm((p: FormState) => ({ ...p, propertiFinansial: val }))
          }
          disabled={isSaving}
          isEdit={true}
          onEdit={() => setEditingSection("propertiFinansial")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardInformasiLainnya
            initialData={form.informasiLainnya}
            onChange={(val) =>
              setForm((p: FormState) => ({ ...p, informasiLainnya: val }))
            }
            disabled={isSaving}
            isEdit={true}
            onEdit={() => setEditingSection("informasiLainnya")}
          />
          <CardSertifikasiBnsp
            initialData={form.sertifikasiBnsp}
            isEdit={true}
          />
        </div>
      </div>

      {/* ─── Modals ─── */}
      {editingSection === "perusahaan" && (
        <ModalPerusahaan
          initialData={form.perusahaan}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("perusahaan", val)}
        />
      )}
      {editingSection === "lokasi" && (
        <ModalLokasi
          initialData={form.lokasi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("lokasi", val)}
        />
      )}
      {editingSection === "kontak" && (
        <ModalKontak
          initialData={form.kontak}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("kontak", val)}
        />
      )}
      {editingSection === "sertifikasi" && (
        <ModalSertifikasi
          initialData={form.sertifikasi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("sertifikasi", val)}
        />
      )}
      {editingSection === "klasifikasi" && (
        <ModalKlasifikasi
          initialData={form.klasifikasi}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("klasifikasi", val)}
        />
      )}
      {editingSection === "propertiFinansial" && (
        <ModalPropertiFinansial
          initialData={form.propertiFinansial}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("propertiFinansial", val)}
        />
      )}
      {editingSection === "informasiLainnya" && (
        <ModalInformasiLainnya
          initialData={form.informasiLainnya}
          isSaving={isSaving}
          onClose={() => setEditingSection(null)}
          onSave={(val) => handleSaveSection("informasiLainnya", val)}
        />
      )}
    </>
  );
}
