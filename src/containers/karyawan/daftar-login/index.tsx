"use client";

import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { usePegawaiLogin } from "@/hooks/use-login-pegawai-list";
import type { PegawaiLoginItem } from "@/lib/types/pegawai-login";

const formatWaktu = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function DaftarLoginContainer() {
  const m = usePegawaiLogin();
  const columns: ColumnDef<PegawaiLoginItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.limit + i + 1,
    },
    { key: "nama", label: "Nama", className: "font-medium" },
    {
      key: "lastOnlineAt",
      label: "Terakhir Online",
      render: (_value, row) => {
        const waktu = row.user?.lastOnlineAt;
        return waktu ? formatWaktu.format(new Date(waktu)) : "–";
      },
    },
    {
      key: "lastIpAddress",
      label: "Alamat IP",
      className: "font-mono",
      render: (_value, row) => row.user?.lastIpAddress ?? "–",
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Karyawan & Aktivitas" }, { label: "Daftar Login" }]}>
      <h1 className="mb-4 text-lg font-semibold">Daftar Login</h1>
      {m.error && (
        <div role="alert" className="mb-4 flex gap-3 text-sm text-red-700">
          <p>{m.error}</p>
          <button type="button" onClick={m.refetch} className="font-medium underline">Coba lagi</button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={m.error ? [] : m.data}
        totalData={m.error ? 0 : m.total}
        currentPage={m.page}
        totalPages={Math.max(1, m.totalPages)}
        pageSize={m.limit}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari nama pegawai..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
      />
    </AppLayout>
  );
}
