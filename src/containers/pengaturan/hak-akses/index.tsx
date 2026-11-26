"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, RotateCcw, Save, ShieldCheck, Trash2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import ConfirmModal from "@/components/base/confirm-modal";
import {
  AKSI,
  LABEL_AKSI,
  type Role,
} from "@/lib/types/permission";
import { RoleForm, type RoleFormValues } from "./components/role-form";
import { useHakAksesManage } from "./manage";

/** Modul yang penjagaannya dipaku di backend, bukan diatur matriks ini. */
const MODUL_TERKUNCI: Record<string, string> = {
  pengaturan:
    "Pengaturan hak akses sengaja dipaku ke SUPER_ADMIN di backend. Centang di sini tidak mengubah siapa yang boleh membukanya.",
};

export default function HakAksesContainer() {
  const m = useHakAksesManage();

  const [formOpen, setFormOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [hapusTarget, setHapusTarget] = useState<Role | null>(null);

  const nilaiForm: RoleFormValues | null = editRole
    ? {
        kode: editRole.kode,
        nama: editRole.nama,
        deskripsi: editRole.deskripsi ?? "",
      }
    : null;

  const simpanRole = async (data: RoleFormValues) => {
    const berhasil = editRole
      ? await m.ubahRole(editRole.kode, {
          nama: data.nama,
          deskripsi: data.deskripsi || null,
        })
      : await m.tambahRole({
          kode: data.kode,
          nama: data.nama,
          deskripsi: data.deskripsi || undefined,
        });

    if (berhasil) {
      setFormOpen(false);
      setEditRole(null);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[{ label: "Pengaturan" }, { label: "Hak Akses" }]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <div className="space-y-4">
        {/* Role */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">Role</span>
            </div>
            <button
              onClick={() => {
                setEditRole(null);
                setFormOpen(true);
              }}
              disabled={m.roleSaving}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Role
            </button>
          </div>

          <div className="px-5 py-3 flex flex-wrap gap-2">
            {m.roles.length === 0 ? (
              <span className="text-xs text-zinc-400">
                {m.loading ? "Memuat role..." : "Belum ada role."}
              </span>
            ) : (
              m.roles.map((r) => (
                <div
                  key={r.kode}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-700">
                      {r.nama}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {r.kode} · {r.jumlahPengguna} pengguna
                      {r.bawaan && " · bawaan"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditRole(r);
                      setFormOpen(true);
                    }}
                    aria-label={`Ubah ${r.nama}`}
                    title="Ubah nama atau deskripsi"
                    className="text-zinc-400 hover:text-emerald-600 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setHapusTarget(r)}
                    // Role bawaan dan role yang masih dipakai ditolak
                    // backend; dimatikan di sini supaya tidak terasa
                    // seperti kegagalan tanpa sebab.
                    disabled={r.bawaan || r.jumlahPengguna > 0}
                    aria-label={`Hapus ${r.nama}`}
                    title={
                      r.bawaan
                        ? "Role bawaan tidak bisa dihapus"
                        : r.jumlahPengguna > 0
                          ? `Masih dipakai ${r.jumlahPengguna} pengguna`
                          : "Hapus role"
                    }
                    className="text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Matriks */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
            <span className="font-bold text-zinc-800 text-sm">
              Matriks Hak Akses
            </span>
            <span className="text-[11px] text-zinc-400">
              {m.jumlahPerubahan > 0
                ? `${m.jumlahPerubahan} perubahan belum disimpan`
                : "Belum ada perubahan"}
            </span>

            <div className="ml-auto flex items-center gap-2">
              {m.jumlahPerubahan > 0 && (
                <button
                  onClick={m.batalkanPerubahan}
                  disabled={m.saving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Batalkan
                </button>
              )}
              <button
                onClick={m.simpan}
                disabled={m.saving || m.jumlahPerubahan === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 min-w-[110px] justify-center"
              >
                {m.saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>

          {m.loading ? (
            <p className="px-5 py-12 text-center text-xs text-zinc-400">
              Memuat matriks hak akses...
            </p>
          ) : m.error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-xs text-red-500">{m.error}</p>
              <button
                onClick={() => void m.muat()}
                className="mt-3 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-white"
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/60">
                    <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left sticky left-0 bg-zinc-50/60 z-10 min-w-[160px]">
                      Modul
                    </th>
                    {m.roles.map((r) => (
                      <th
                        key={r.kode}
                        colSpan={AKSI.length}
                        className="px-2 py-2 text-[10px] font-bold text-zinc-600 text-center border-l border-zinc-100"
                        title={r.deskripsi ?? undefined}
                      >
                        {r.nama}
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <th className="sticky left-0 bg-white z-10" />
                    {m.roles.map((r) =>
                      AKSI.map((a) => (
                        <th
                          key={`${r.kode}-${a}`}
                          className="px-1 py-1.5 text-[9px] font-semibold text-zinc-400 text-center"
                          title={LABEL_AKSI[a]}
                        >
                          {LABEL_AKSI[a]}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {m.modul.map((mod) => {
                    const terkunci = MODUL_TERKUNCI[mod];
                    return (
                      <tr
                        key={mod}
                        className="border-b border-zinc-50 hover:bg-zinc-50/40"
                      >
                        <td
                          className="px-4 py-2 text-xs text-zinc-700 font-medium sticky left-0 bg-white z-10"
                          title={terkunci}
                        >
                          {mod}
                          {terkunci && (
                            <span className="ml-1 text-[9px] text-amber-600">
                              dipaku
                            </span>
                          )}
                        </td>
                        {m.roles.map((r) => {
                          const izin = m.izin(r.kode, mod);
                          return AKSI.map((a) => (
                            <td
                              key={`${r.kode}-${mod}-${a}`}
                              className={`px-1 py-2 text-center ${
                                a === "create" ? "border-l border-zinc-100" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={izin[a]}
                                onChange={() => m.toggle(r.kode, mod, a)}
                                onDoubleClick={() => m.toggleBaris(r.kode, mod)}
                                aria-label={`${LABEL_AKSI[a]} ${mod} untuk ${r.nama}`}
                                title={`${LABEL_AKSI[a]} · ${mod} · ${r.nama}\nKlik ganda untuk centang semua`}
                                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
                              />
                            </td>
                          ));
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RoleForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditRole(null);
        }}
        onSubmit={simpanRole}
        initialData={nilaiForm}
        isLoading={m.roleSaving}
      />

      <ConfirmModal
        isOpen={!!hapusTarget}
        title="Hapus Role"
        message={`Role "${hapusTarget?.nama ?? ""}" akan dihapus permanen beserta seluruh baris izinnya. Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={async () => {
          if (!hapusTarget) return;
          const berhasil = await m.hapusRole(hapusTarget.kode);
          if (berhasil) setHapusTarget(null);
        }}
        onCancel={() => {
          if (!m.roleSaving) setHapusTarget(null);
        }}
        loading={m.roleSaving}
      />
    </AppLayout>
  );
}
