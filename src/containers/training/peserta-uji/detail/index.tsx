"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useCan } from "@/hooks/use-can";
import Notification from "@/components/base/notifications";
import { SelectInput, TextInput } from "@/components/base/form-field";
import { usePesertaUjiDetailManage } from "./manage";

const STATUS: Record<string, { label: string; kelas: string }> = {
  SIAP_UJI: { label: "Siap Uji", kelas: "bg-emerald-50 text-emerald-600" },
  SUDAH_UJI: { label: "Sudah Uji", kelas: "bg-blue-50 text-blue-600" },
};
const STATUS_DEFAULT = { label: "Calon", kelas: "bg-zinc-100 text-zinc-500" };

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS_DEFAULT;
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${s.kelas}`}
    >
      {s.label}
    </span>
  );
}

function Kartu({
  judul,
  children,
}: {
  judul: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <p className="font-bold text-zinc-800 text-sm">{judul}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function TombolSimpan({
  saving,
  label = "Simpan",
}: {
  saving: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 min-w-[120px] justify-center"
    >
      {saving ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </button>
  );
}

export default function PesertaUjiDetailContainer() {
  const router = useRouter();
  const m = usePesertaUjiDetailManage();
  const { assign, hasil } = m;
  const canUpdate = useCan("training", "update");

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Peserta Uji", href: "/training/peserta-uji" },
        { label: "Detail" },
      ]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <button
        type="button"
        onClick={() => router.push("/training/peserta-uji")}
        className="inline-flex items-center gap-1.5 mb-4 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke daftar
      </button>

      {m.loading && !m.peserta ? (
        <p className="text-xs text-zinc-400">Memuat data peserta...</p>
      ) : m.error ? (
        <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-semibold">
          {m.error}
        </div>
      ) : !m.peserta ? (
        <p className="text-xs text-zinc-400">Data peserta tidak ditemukan.</p>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-6 py-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-zinc-800 text-base">
                {m.peserta.nama}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {m.peserta.instansi ?? "-"} — {m.peserta.skema.kode} (
                {m.peserta.skema.nama})
              </p>
            </div>
            <StatusBadge status={m.peserta.status} />
          </div>

          <Kartu judul="Assign Pelaksanaan Uji">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canUpdate) assign.simpan();
              }}
            >
              <fieldset disabled={!canUpdate} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SelectInput
                  label="TUK"
                  optional
                  placeholder="Pilih TUK"
                  value={assign.tukId}
                  onChange={(e) => assign.setTukId(e.target.value)}
                  opsi={m.tukOptions.map((t) => ({
                    value: String(t.id),
                    label: t.nama,
                  }))}
                />
                <SelectInput
                  label="Asesor"
                  optional
                  placeholder="Pilih Asesor"
                  value={assign.asesorId}
                  onChange={(e) => assign.setAsesorId(e.target.value)}
                  opsi={m.asesorOptions.map((a) => ({
                    value: String(a.id),
                    label: a.nama,
                  }))}
                />
                <TextInput
                  label="Tgl Uji"
                  optional
                  type="date"
                  value={assign.tglUji}
                  onChange={(e) => assign.setTglUji(e.target.value)}
                />
              </fieldset>

              {canUpdate && (
                <div className="flex justify-end mt-5">
                  <TombolSimpan saving={assign.saving} label="Simpan" />
                </div>
              )}
            </form>
          </Kartu>

          <Kartu judul="Hasil Uji Kompetensi">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canUpdate) hasil.simpan();
              }}
            >
              <fieldset disabled={!canUpdate} className="space-y-4">
                <div>
                  <p className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
                    Hasil
                  </p>
                  <div className="flex items-center gap-4">
                    {(["K", "BK"] as const).map((v) => (
                      <label
                        key={v}
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="statusHasil"
                          value={v}
                          checked={hasil.statusHasil === v}
                          onChange={() => hasil.setStatusHasil(v)}
                          className="w-3.5 h-3.5 accent-emerald-500"
                        />
                        {v === "K" ? "Kompeten (K)" : "Belum Kompeten (BK)"}
                      </label>
                    ))}
                  </div>
                </div>

                <TextInput
                  label="No Reg"
                  optional
                  placeholder="Nomor registrasi"
                  value={hasil.noReg}
                  onChange={(e) => hasil.setNoReg(e.target.value)}
                />

                {/* Nomor sertifikat dan tanggal terbit hanya berlaku untuk
                    hasil Kompeten, jadi disembunyikan saat BK. */}
                {hasil.statusHasil === "K" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextInput
                      label="No Sertifikat BNSP"
                      placeholder="Nomor sertifikat"
                      value={hasil.noSerBNSP}
                      onChange={(e) => hasil.setNoSerBNSP(e.target.value)}
                    />
                    <TextInput
                      label="Tgl Terbit"
                      type="date"
                      value={hasil.tglTerbit}
                      onChange={(e) => hasil.setTglTerbit(e.target.value)}
                    />
                  </div>
                )}
              </fieldset>

              {canUpdate && (
                <div className="flex justify-end mt-5">
                  <TombolSimpan saving={hasil.saving} label="Simpan Hasil" />
                </div>
              )}
            </form>
          </Kartu>
        </div>
      )}
    </AppLayout>
  );
}
