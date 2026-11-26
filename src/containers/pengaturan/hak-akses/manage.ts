"use client";

/**
 * Keadaan halaman pengaturan hak akses: matriks centang, daftar role, dan
 * penyimpanannya.
 *
 * Tidak lewat useResource — ini bukan daftar berhalaman, melainkan satu
 * matriks utuh yang disunting lalu disimpan sekaligus.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPermissionMatrix,
  savePermissionMatrix,
} from "@/lib/services/permission.service";
import {
  createRole,
  deleteRole,
  getRoleList,
  updateRole,
} from "@/lib/services/role.service";
import { usePermission } from "@/context/PermissionContext";
import {
  AKSI,
  kunciIzin,
  type ModulePermission,
  type PermissionAction,
  type PermissionRow,
  type Role,
} from "@/lib/types/permission";

interface Notif {
  message: string;
  type: "success" | "error";
  key: number;
}

/** Peta role::modul -> empat izinnya, bentuk yang enak disunting di layar. */
type PetaIzin = Record<string, ModulePermission>;

const keKosong = (): ModulePermission => ({
  create: false,
  read: false,
  update: false,
  delete: false,
});

export function useHakAksesManage() {
  const { reload: reloadIzinSendiri } = usePermission();

  const [roles, setRoles] = useState<Role[]>([]);
  const [modul, setModul] = useState<string[]>([]);
  const [awal, setAwal] = useState<PetaIzin>({});
  const [peta, setPeta] = useState<PetaIzin>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (message: string, type: Notif["type"]) =>
    setNotif({ message, type, key: Date.now() });

  const muat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [baris, daftarRole] = await Promise.all([
        getPermissionMatrix(),
        getRoleList(),
      ]);

      const p: PetaIzin = {};
      baris.forEach((b: PermissionRow) => {
        p[kunciIzin(b.role, b.modul)] = {
          create: b.create,
          read: b.read,
          update: b.update,
          delete: b.delete,
        };
      });

      setRoles(daftarRole);
      setModul([...new Set(baris.map((b) => b.modul))].sort());
      setAwal(p);
      setPeta(p);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil hak akses.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void muat();
  }, [muat]);

  const izin = useCallback(
    (role: string, m: string): ModulePermission =>
      peta[kunciIzin(role, m)] ?? keKosong(),
    [peta],
  );

  const toggle = (role: string, m: string, aksi: PermissionAction) => {
    const k = kunciIzin(role, m);
    setPeta((lama) => {
      const kini = lama[k] ?? keKosong();
      return { ...lama, [k]: { ...kini, [aksi]: !kini[aksi] } };
    });
  };

  /** Centang atau lepas seluruh baris satu modul untuk satu role. */
  const toggleBaris = (role: string, m: string) => {
    const k = kunciIzin(role, m);
    setPeta((lama) => {
      const kini = lama[k] ?? keKosong();
      const semua = AKSI.every((a) => kini[a]);
      const nilai = !semua;
      return {
        ...lama,
        [k]: { create: nilai, read: nilai, update: nilai, delete: nilai },
      };
    });
  };

  /** Hanya baris yang berubah yang dikirim, supaya tidak menimpa sia-sia. */
  const perubahan = useMemo(() => {
    const hasil: PermissionRow[] = [];
    for (const role of roles) {
      for (const m of modul) {
        const k = kunciIzin(role.kode, m);
        const kini = peta[k] ?? keKosong();
        const lama = awal[k] ?? keKosong();
        if (AKSI.some((a) => kini[a] !== lama[a])) {
          hasil.push({ id: k, role: role.kode, modul: m, ...kini });
        }
      }
    }
    return hasil;
  }, [roles, modul, peta, awal]);

  const simpan = async () => {
    if (perubahan.length === 0) return;
    setSaving(true);
    try {
      const hasil = await savePermissionMatrix(
        perubahan.map(({ role, modul: m, create, read, update, delete: del }) => ({
          role,
          modul: m,
          create,
          read,
          update,
          delete: del,
        })),
      );
      setAwal(peta);
      showNotif(`${hasil.tersimpan} baris hak akses tersimpan.`, "success");
      // Izin milik sendiri bisa ikut berubah; muat ulang supaya menu dan
      // tombol di layar langsung menyesuaikan tanpa perlu login ulang.
      await reloadIzinSendiri();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan hak akses.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const batalkanPerubahan = () => setPeta(awal);

  // ── Kelola role ────────────────────────────────────────────────────────

  const [roleSaving, setRoleSaving] = useState(false);

  const tambahRole = async (data: {
    kode: string;
    nama: string;
    deskripsi?: string;
  }) => {
    setRoleSaving(true);
    try {
      await createRole(data);
      showNotif(`Role ${data.nama} dibuat tanpa izin apa pun.`, "success");
      await muat();
      return true;
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal membuat role.",
        "error",
      );
      return false;
    } finally {
      setRoleSaving(false);
    }
  };

  const ubahRole = async (
    kode: string,
    data: { nama?: string; deskripsi?: string | null },
  ) => {
    setRoleSaving(true);
    try {
      await updateRole(kode, data);
      showNotif("Role berhasil diperbarui.", "success");
      await muat();
      return true;
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal mengubah role.",
        "error",
      );
      return false;
    } finally {
      setRoleSaving(false);
    }
  };

  const hapusRole = async (kode: string) => {
    setRoleSaving(true);
    try {
      await deleteRole(kode);
      showNotif("Role berhasil dihapus.", "success");
      await muat();
      return true;
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menghapus role.",
        "error",
      );
      return false;
    } finally {
      setRoleSaving(false);
    }
  };

  return {
    roles,
    modul,
    izin,
    toggle,
    toggleBaris,
    jumlahPerubahan: perubahan.length,
    loading,
    error,
    saving,
    notif,
    clearNotif: () => setNotif(null),
    muat,
    simpan,
    batalkanPerubahan,
    roleSaving,
    tambahRole,
    ubahRole,
    hapusRole,
  };
}
