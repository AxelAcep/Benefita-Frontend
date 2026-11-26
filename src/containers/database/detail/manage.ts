"use client";

import { useEffect, useState } from "react";
import { useHakAksesPerusahaan, usePermohonanHakAkses } from "@/hooks/use-perusahaan";
import { useDropdownSales } from "@/hooks/use-dropdown-sales";
import { useUpdateHakAkses } from "@/hooks/use-update-hak";
import type { AkunStatus } from "./components/card-overview";

export type TabKey = "detail" | "peserta" | "contact-person" | "daily" | "riwayat";

export function useDetailInstansiManage(id: string) {
  const { data, loading, error, refetch } = useHakAksesPerusahaan(id);
  const { data: pegawaiOptions } = useDropdownSales();
  const { update, loading: updating, error: updateError } = useUpdateHakAkses();

  const [activeTab, setActiveTab] = useState<TabKey>("detail");
  const [isPosModalOpen, setPosModalOpen] = useState(false);
  const { create, loading: creatingPermohonan } = usePermohonanHakAkses();
  const [isRequestPosisiOpen, setRequestPosisiOpen] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    env: { status: "MA" as AkunStatus, pegawaiIds: [] as string[] },
    csr: { status: "MU" as AkunStatus, pegawaiIds: [] as string[] },
    tsm: { status: "AM" as AkunStatus, pegawaiIds: [] as string[] },
    epm: { status: "-" as AkunStatus, pegawaiIds: [] as string[] },
  });

  const mapStatus = (status: string | null | undefined): AkunStatus => {
    const validStatuses: AkunStatus[] = ["MA", "MU", "AM", "-"];
    return status && validStatuses.includes(status as AkunStatus)
      ? (status as AkunStatus)
      : "-";
  };

  const handleRequestPosisiSubmit = async (jenisAkses: string) => {
    try {
      await create({ perusahaanId: id, jenisAkses });
      setNotification({
        message: "Permohonan berhasil diajukan!",
        type: "success",
      });
      setRequestPosisiOpen(false);
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : "Gagal mengajukan permohonan.",
        type: "error",
      });
    }
  };

  const handleModalSubmit = async () => {
    const payload = {
      perusahaanId: id!,
      akses: Object.entries(formData).map(([key, val]) => ({
        jenisAkses: key.toUpperCase(),
        pegawaiIds: val.pegawaiIds,
        status: val.status,
      })),
    };

    try {

      await update(payload);

      setNotification({
        message: "Hak akses berhasil diperbarui!",
        type: "success",
      });
      setModalOpen(false);
      refetch();
    } catch (err) {

      setNotification({
        message: err instanceof Error ? err.message : "Gagal memperbarui hak akses.",
        type: "error",
      });

    }
  };

  useEffect(() => {
    if (data && data.akses) {
      const getIdsByJenis = (jenis: string) => {
        return (
          data.akses
            .filter((a) => a.jenisAkses === jenis)

            .map((a) => {
              if (Array.isArray(a.pegawai)) {
                return a.pegawai[0]?.id; // Jika array, ambil index 0
              }
              return (a.pegawai as any)?.id; // Jika object, ambil id
            })
            .filter((id) => id !== undefined) as string[]
        );
      };

      setFormData({
        env: {
          status: mapStatus(
            data.akses.find((a) => a.jenisAkses === "ENV")?.status,
          ),
          pegawaiIds: getIdsByJenis("ENV"),
        },
        csr: {
          status: mapStatus(
            data.akses.find((a) => a.jenisAkses === "CSR")?.status,
          ),
          pegawaiIds: getIdsByJenis("CSR"),
        },
        tsm: {
          status: mapStatus(
            data.akses.find((a) => a.jenisAkses === "TSM")?.status,
          ),
          pegawaiIds: getIdsByJenis("TSM"),
        },
        epm: {
          status: mapStatus(
            data.akses.find((a) => a.jenisAkses === "EPM")?.status,
          ),
          pegawaiIds: getIdsByJenis("EPM"),
        },
      });
    }
  }, [data]);

  return {
    data, loading, error, refetch, pegawaiOptions, updating, updateError,
    activeTab, setActiveTab, isPosModalOpen, setPosModalOpen, creatingPermohonan,
    isRequestPosisiOpen, setRequestPosisiOpen, notification, setNotification,
    isModalOpen, setModalOpen, formData, setFormData, mapStatus,
    handleRequestPosisiSubmit, handleModalSubmit,
  };
}
