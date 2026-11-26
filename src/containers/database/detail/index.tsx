"use client";

import { useParams, useRouter } from "next/navigation";
import { X, Save, Users, ShieldCheck } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import CardDetailPerusahaan, { type AkunStatus } from "./components/card-overview";
import TabPeserta from "./components/tab-peserta";
import TabContactPerson from "./components/tab-contact-person";
import TabDaily from "./components/tab-daily";
import TabRiwayat from "./components/tab-riwayat";
import ModalKirimPos from "./components/modal-pos";
import ModalRequestPosisi from "./components/modal-request";
import { useDetailInstansiManage, type TabKey } from "./manage";
import DetailPerusahaan from "@/app/database/perusahaan/(tabs)/tab-detail-perusahaan";
import DetailPemda from "@/app/database/pemda/(tabs)/tab-detail-perusahaan";
import DetailRumahSakit from "@/app/database/rumah-sakit/(tabs)/tab-detail-perusahaan";
import DetailInstansiDaerah from "@/app/database/instansi-daerah/(tabs)/tab-detail-perusahaan";
import DetailSekolah from "@/app/database/sekolah/(tabs)/tab-detail-perusahaan";

const DETAIL = {
  "perusahaan": DetailPerusahaan,
  "pemda": DetailPemda,
  "rumah-sakit": DetailRumahSakit,
  "instansi-daerah": DetailInstansiDaerah,
  "sekolah": DetailSekolah,
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "detail", label: "Detail Perusahaan" },
  { key: "peserta", label: "Peserta" },
  { key: "contact-person", label: "Contact Person" },
  { key: "daily", label: "Daily" },
  { key: "riwayat", label: "Riwayat Perubahan Data" },
];

export default function DetailInstansiContainer({ slug }: { slug: keyof typeof DETAIL }) {
  const { id } = useParams<{ id: string }>();
  return <DetailInstansi key={id} id={id} slug={slug} />;
}

function DetailInstansi({ id, slug }: { id: string; slug: keyof typeof DETAIL }) {
  const router = useRouter();
  const { isAdmin } = useRole();
  const TabDetailPerusahaan = DETAIL[slug];
  const {
    data, loading, error, refetch, pegawaiOptions, updating, updateError,
    activeTab, setActiveTab, isPosModalOpen, setPosModalOpen, creatingPermohonan,
    isRequestPosisiOpen, setRequestPosisiOpen, notification, setNotification,
    isModalOpen, setModalOpen, formData, setFormData, mapStatus,
    handleRequestPosisiSubmit, handleModalSubmit,
  } = useDetailInstansiManage(id);

  const breadcrumbs = [
    { label: "Database", href: "/database" },
    { label: data?.company ?? id },
  ];

  if (loading || !data) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        {error ? (
          <div role="alert" className="rounded-lg bg-white p-5 text-sm text-red-700">
            <p>{error}</p>
            <button type="button" onClick={refetch} className="mt-2 font-medium underline">Coba lagi</button>
          </div>
        ) : <p role="status" className="py-20 text-center text-sm text-zinc-500">Memuat data...</p>}
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="space-y-4">
        <CardDetailPerusahaan
          kode={data.perusahaanId}
          idSimpel={data.idSimpel ?? ""}
          inputBy={data.inputter?.name ?? "–"}
          namaPerusahaan={data.company}
          akun={{
            env: {
              status: mapStatus(
                data.akses.find((a) => a.jenisAkses === "ENV")?.status,
              ),
              // Ambil kode/prefix dari semua pegawai di akses ENV
              kode: data.akses
                .filter((a) => a.jenisAkses === "ENV")
                .map((a: any) => a.pegawai?.nama || a.pegawai?.kode || ""),
            },
            csr: {
              status: mapStatus(
                data.akses.find((a) => a.jenisAkses === "CSR")?.status,
              ),
              kode: data.akses
                .filter((a) => a.jenisAkses === "CSR")
                .map((a: any) => a.pegawai?.nama || a.pegawai?.kode || ""),
            },
            tsm: {
              status: mapStatus(
                data.akses.find((a) => a.jenisAkses === "TSM")?.status,
              ),
              kode: data.akses
                .filter((a) => a.jenisAkses === "TSM")
                .map((a: any) => a.pegawai?.nama || a.pegawai?.kode || ""),
            },
            epm: {
              status: mapStatus(
                data.akses.find((a) => a.jenisAkses === "EPM")?.status,
              ),
              kode: data.akses
                .filter((a) => a.jenisAkses === "EPM")
                .map((a: any) => a.pegawai?.nama || a.pegawai?.kode || ""),
            },
          }}
          onEdit={() => setModalOpen(true)}
          isAdmin={slug !== "perusahaan" || isAdmin}
        />

        {/* --- MODAL BARU (BLUR & COMPACT) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
            {/* Backdrop dengan Blur */}
            <div
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setModalOpen(false)}
            />

            {/* Kontainer Modal */}
            <div className="relative bg-white w-full max-w-6xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-zinc-800 uppercase">
                      Edit Hak Akses
                    </h2>
                    <p className="text-[10px] text-zinc-500">
                      Atur penanggung jawab sistem
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body (Scrollable) */}
              <div className="flex-1 overflow-x-auto p-6 custom-scrollbar bg-zinc-50/20">
                {/* Gunakan min-w-[80%] atau langsung set min-width yang cukup untuk 4 kolom */}
                <div className="flex flex-row gap-4 min-w-[80%] lg:min-w-full pb-4">
                  {["env", "csr", "tsm", "epm"].map((jenis) => {
                    const currentData =
                      formData[jenis as keyof typeof formData];

                    return (
                      <div
                        key={jenis}
                        className="flex-1 min-w-[220px] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
                      >
                        {/* Header Kategori */}
                        <div className="px-3 py-3 bg-zinc-50 border-b border-zinc-200">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              {jenis}
                            </label>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                currentData.pegawaiIds.length >= 4
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {currentData.pegawaiIds.length}/4
                            </span>
                          </div>

                          <select
                            value={currentData.status}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [jenis]: {
                                  ...currentData,
                                  status: e.target.value as AkunStatus,
                                },
                              }))
                            }
                            className="w-full text-[11px] font-bold bg-white border border-zinc-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-emerald-500/20"
                          >
                            {["MA", "MU", "AM", "-"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* List Pegawai (Vertical Scroll di dalam kolom) */}
                        <div className="flex-1 p-2 space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar">
                          {pegawaiOptions?.map((p) => {
                            const isChecked = currentData.pegawaiIds.includes(
                              p.id,
                            );
                            const isMaxReached =
                              currentData.pegawaiIds.length >= 4;

                            return (
                              <label
                                key={p.id}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all ${
                                  isChecked
                                    ? "bg-emerald-50 border-emerald-200 shadow-sm"
                                    : isMaxReached
                                      ? "opacity-30 cursor-not-allowed border-transparent"
                                      : "bg-transparent border-transparent hover:bg-zinc-100 cursor-pointer"
                                }`}
                              >
                                <div className="relative flex items-center justify-center flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    className="peer appearance-none w-4 h-4 rounded-md border border-zinc-300 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer disabled:cursor-not-allowed"
                                    checked={isChecked}
                                    disabled={!isChecked && isMaxReached}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        if (currentData.pegawaiIds.length < 4) {
                                          setFormData((prev) => ({
                                            ...prev,
                                            [jenis]: {
                                              ...currentData,
                                              pegawaiIds: [
                                                ...currentData.pegawaiIds,
                                                p.id,
                                              ],
                                            },
                                          }));
                                        }
                                      } else {
                                        setFormData((prev) => ({
                                          ...prev,
                                          [jenis]: {
                                            ...currentData,
                                            pegawaiIds:
                                              currentData.pegawaiIds.filter(
                                                (id) => id !== p.id,
                                              ),
                                          },
                                        }));
                                      }
                                    }}
                                  />
                                  <svg
                                    className="absolute w-2.5 h-2.5 pointer-events-none hidden peer-checked:block text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>

                                <div className="flex flex-col min-w-0">
                                  <span
                                    className={`text-[10px] font-bold truncate ${isChecked ? "text-emerald-700" : "text-zinc-700"}`}
                                  >
                                    {p.nama}
                                  </span>
                                  <span className="text-[8px] text-zinc-400 tabular-nums uppercase">
                                    {p.kode}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-zinc-50/80 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleModalSubmit}
                  disabled={updating}
                  className="px-6 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {updating ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Save size={14} /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TABS NAV --- */}
        <div className="flex border-b border-zinc-200 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-600 bg-emerald-50/50"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="animate-in fade-in duration-300">
          <div className="flex w-full justify-end gap-3">
            <Button
              className="mb-2 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setPosModalOpen(true)}
            >
              Kirim pos
            </Button>

            <Button
              className="mb-2 bg-emerald-500 hover:bg-emerald-600"
              onClick={() =>
                router.push(`/database/${slug}/${encodeURIComponent(id)}/penawaran`)
              }
            >
              Buat Penawaran
            </Button>

            <Button
              className="mb-2 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setRequestPosisiOpen(true)}
            >
              Request Posisi
            </Button>
          </div>

          {isPosModalOpen && (
            <ModalKirimPos
              noInduk={id}
              onClose={() => setPosModalOpen(false)}
            />
          )}

          {isRequestPosisiOpen && (
            <ModalRequestPosisi
              perusahaanId={id}
              isSaving={creatingPermohonan}
              onClose={() => setRequestPosisiOpen(false)}
              onSubmit={handleRequestPosisiSubmit}
            />
          )}

          {activeTab === "detail" && (
            <TabDetailPerusahaan
              id={id}
              onSuccess={() =>
                setNotification({
                  message: "Data berhasil diperbarui!",
                  type: "success",
                })
              }
              onError={(msg) =>
                setNotification({ message: msg, type: "error" })
              }
            />
          )}
          {activeTab === "peserta" && <TabPeserta />}
          {activeTab === "contact-person" && <TabContactPerson id={id} />}
          {activeTab === "daily" && <TabDaily id={id} />}
          {activeTab === "riwayat" && <TabRiwayat id={id} />}
        </div>
      </div>
    </AppLayout>
  );
}
