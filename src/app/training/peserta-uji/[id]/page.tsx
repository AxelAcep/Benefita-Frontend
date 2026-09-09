"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import {
  getPesertaUjiById,
  assignPesertaUjiPelaksanaan,
  updatePesertaUjiHasil,
  type PesertaUji,
} from "@/lib/services/peserta-uji.service";
import { getTUKList, type TUK } from "@/lib/services/tuk.service";
import { getAsesorList, type Asesor } from "@/lib/services/asesor.service";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
      {children}
      {optional && (
        <span className="ml-1 font-normal text-zinc-400">(opsional)</span>
      )}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300 bg-white";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <p className="font-bold text-zinc-800 text-sm">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "SIAP_UJI"
      ? "bg-emerald-50 text-emerald-600"
      : status === "SUDAH_UJI"
        ? "bg-blue-50 text-blue-600"
        : "bg-zinc-100 text-zinc-500";
  const label =
    status === "SIAP_UJI"
      ? "Siap Uji"
      : status === "SUDAH_UJI"
        ? "Sudah Uji"
        : "Calon";
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function DetailPesertaUjiPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [peserta, setPeserta] = useState<PesertaUji | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [tukOptions, setTukOptions] = useState<TUK[]>([]);
  const [asesorOptions, setAsesorOptions] = useState<Asesor[]>([]);

  // Form assign pelaksanaan
  const [tukId, setTukId] = useState("");
  const [asesorId, setAsesorId] = useState("");
  const [tglUji, setTglUji] = useState("");
  const [isAssignSaving, setIsAssignSaving] = useState(false);

  // Form hasil uji
  const [statusHasil, setStatusHasil] = useState<"K" | "BK" | "">("");
  const [noReg, setNoReg] = useState("");
  const [noSerBNSP, setNoSerBNSP] = useState("");
  const [tglTerbit, setTglTerbit] = useState("");
  const [isHasilSaving, setIsHasilSaving] = useState(false);

  function syncFormFromPeserta(data: PesertaUji) {
    setTukId(data.tukId ? String(data.tukId) : "");
    setAsesorId(data.asesorId ? String(data.asesorId) : "");
    setTglUji(data.tglUji ? data.tglUji.split("T")[0] : "");
    setStatusHasil((data.statusHasil as "K" | "BK") ?? "");
    setNoReg(data.noReg ?? "");
    setNoSerBNSP(data.noSerBNSP ?? "");
    setTglTerbit(data.tglTerbit ? data.tglTerbit.split("T")[0] : "");
  }

  async function loadPeserta() {
    setIsLoading(true);
    try {
      const data = await getPesertaUjiById(id);
      setPeserta(data);
      syncFormFromPeserta(data);
    } catch (err) {
      setNotification({
        message:
          err instanceof Error ? err.message : "Gagal mengambil data peserta",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!id || isNaN(id)) return;
    loadPeserta();
    getTUKList({ limit: 100 })
      .then((res) => setTukOptions(res.data))
      .catch(() => setTukOptions([]));
    getAsesorList({ limit: 100 })
      .then((res) => setAsesorOptions(res.data))
      .catch(() => setAsesorOptions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmitAssign(e: React.FormEvent) {
    e.preventDefault();
    setIsAssignSaving(true);
    try {
      const updated = await assignPesertaUjiPelaksanaan(id, {
        tukId: tukId ? Number(tukId) : "",
        asesorId: asesorId ? Number(asesorId) : "",
        tglUji: tglUji || undefined,
      });
      setPeserta(updated);
      setNotification({
        message: "Pelaksanaan uji berhasil disimpan",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message:
          err instanceof Error ? err.message : "Gagal menyimpan pelaksanaan uji",
        type: "error",
      });
    } finally {
      setIsAssignSaving(false);
    }
  }

  async function handleSubmitHasil(e: React.FormEvent) {
    e.preventDefault();
    if (!statusHasil) {
      setNotification({ message: "Pilih hasil ujian dulu.", type: "error" });
      return;
    }
    setIsHasilSaving(true);
    try {
      const updated = await updatePesertaUjiHasil(id, {
        statusHasil,
        noReg: noReg || undefined,
        noSerBNSP: statusHasil === "K" ? noSerBNSP : undefined,
        tglTerbit: statusHasil === "K" ? tglTerbit : undefined,
      });
      setPeserta(updated);
      syncFormFromPeserta(updated);
      setNotification({ message: "Hasil uji berhasil disimpan", type: "success" });
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : "Gagal menyimpan hasil uji",
        type: "error",
      });
    } finally {
      setIsHasilSaving(false);
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Peserta Uji", href: "/training/peserta-uji" },
        { label: "Detail" },
      ]}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => router.push("/training/peserta-uji")}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali
        </button>

        {isLoading && !peserta ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-10 text-center text-xs text-zinc-400">
            Memuat data...
          </div>
        ) : !peserta ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-10 text-center text-xs text-zinc-400">
            Peserta uji tidak ditemukan.
          </div>
        ) : (
          <>
            {/* Ringkasan peserta */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-6 py-5 flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="font-bold text-zinc-800 text-base">
                  {peserta.nama}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {peserta.instansi ?? "-"} — {peserta.skema.kode} (
                  {peserta.skema.nama})
                </p>
              </div>
              <StatusBadge status={peserta.status} />
            </div>

            {/* Assign Pelaksanaan */}
            <SectionCard title="Assign Pelaksanaan Uji">
              <form
                onSubmit={handleSubmitAssign}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <div>
                  <FieldLabel optional>TUK</FieldLabel>
                  <select
                    value={tukId}
                    onChange={(e) => setTukId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Pilih TUK</option>
                    {tukOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel optional>Asesor</FieldLabel>
                  <select
                    value={asesorId}
                    onChange={(e) => setAsesorId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Pilih Asesor</option>
                    {asesorOptions.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel optional>Tgl Uji</FieldLabel>
                  <input
                    type="date"
                    value={tglUji}
                    onChange={(e) => setTglUji(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isAssignSaving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {isAssignSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Simpan Pelaksanaan
                  </button>
                </div>
              </form>
            </SectionCard>

            {/* Input Hasil Uji */}
            <SectionCard title="Hasil Uji Kompetensi">
              <form onSubmit={handleSubmitHasil} className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Hasil</FieldLabel>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                      <input
                        type="radio"
                        name="statusHasil"
                        value="K"
                        checked={statusHasil === "K"}
                        onChange={() => setStatusHasil("K")}
                      />
                      Kompeten (K)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                      <input
                        type="radio"
                        name="statusHasil"
                        value="BK"
                        checked={statusHasil === "BK"}
                        onChange={() => setStatusHasil("BK")}
                      />
                      Belum Kompeten (BK)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <FieldLabel optional>No Reg</FieldLabel>
                    <input
                      value={noReg}
                      onChange={(e) => setNoReg(e.target.value)}
                      placeholder="No Registrasi"
                      className={inputCls}
                    />
                  </div>

                  {statusHasil === "K" && (
                    <>
                      <div>
                        <FieldLabel>No Sertifikat BNSP</FieldLabel>
                        <input
                          value={noSerBNSP}
                          onChange={(e) => setNoSerBNSP(e.target.value)}
                          placeholder="Masukkan No Sertifikat BNSP"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <FieldLabel>Tgl Terbit</FieldLabel>
                        <input
                          type="date"
                          value={tglTerbit}
                          onChange={(e) => setTglTerbit(e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isHasilSaving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {isHasilSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Simpan Hasil
                  </button>
                </div>
              </form>
            </SectionCard>
          </>
        )}
      </div>
    </AppLayout>
  );
}
