"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";

interface TabelContohProps<T> {
  judul: string;
  info?: ReactNode;
  columns: ColumnDef<T>[];
  data: T[];
  pageSize: number;
  searchPlaceholder: string;
  match: (row: T, query: string) => boolean;
}

export function TabelContoh<T>({
  judul, info, columns, data, pageSize, searchPlaceholder, match,
}: TabelContohProps<T>) {
  const { id } = useParams<{ id: string }>();
  const href = `/input/${encodeURIComponent(id)}`;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const rows = data.filter((row) => match(row, query));
  const start = (page - 1) * pageSize;
  const kolom: ColumnDef<T>[] = [
    { key: "no", label: "No", render: (_v, _row, i) => start + i + 1 },
    ...columns,
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Input Data", href }, { label: judul }]}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{judul}</h1>
          <p className="text-sm text-zinc-600">Halaman ini menampilkan data contoh.</p>
          {info}
        </div>
        <Link href={href} className="text-sm font-medium text-emerald-700 hover:underline">Kembali ke Input</Link>
      </div>
      <DataTable
        columns={kolom}
        data={rows.slice(start, start + pageSize)}
        totalData={rows.length}
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(rows.length / pageSize))}
        pageSize={pageSize}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder={searchPlaceholder}
      />
    </AppLayout>
  );
}
