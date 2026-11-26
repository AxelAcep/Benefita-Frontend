"use client";

import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { PesertaMode, PesertaRow } from "@/lib/types/peserta-laporan";
import { usePesertaLaporanManage } from "./manage";

type Fields = [string, string][];
const IDENTITY: Fields = [["nama","Nama"],["perusahaan","Perusahaan"],["kode","Kode"]];
const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const CONFIG: Record<PesertaMode, { title: string; fields: Fields; note?: string }> = {
  final: { title: "Peserta Final", fields: [...IDENTITY,["jabatan","Jabatan"],["telepon","Telepon"],["email","Email"],["tanggal","Tanggal Pelatihan"],["noSertifikat","No. Sertifikat"],["noReg","No. Registrasi"],["ujian","Ujian"]] },
  "sertifikat-bnsp": { title: "Pemegang Sertifikat BNSP", fields: [...IDENTITY,["email","Email"],["lsp","LSP"],["tanggalUji","Tanggal Uji"],["masaBerlaku","Masa Berlaku"],["sertifikat","Status"],["noSertifikat","No. Sertifikat"]], note: "Menampilkan sertifikat berstatus Terbit atau hasil kompeten dengan nomor sertifikat." },
  "permintaan-offline": { title: "Daftar Permintaan Peserta (Offline)", fields: [...IDENTITY,["ae","AE"],["telepon","Kontak"],["email","Email"],["tanggal","Tanggal Pelatihan"],["metode","Metode"],["status","Status"]], note: "Berdasarkan metode Offline yang tercatat pada peserta." },
  bulanan: { title: "Daftar Peserta (Bulanan)", fields: [...IDENTITY,["ae","AE"],["noJadwal","No. Jadwal"],["tanggal","Tanggal Pelatihan"],["telepon","Telepon"],["email","Email"],["status","Status"],["metode","Metode"],["catatan","Catatan"]] },
  fix: { title: "Daftar Peserta FIX (Bulanan)", fields: [] },
  cancle: { title: "Daftar Peserta Cancel (Bulanan)", fields: [] },
  "rekap-ae": { title: "Rekap Peserta per AE", fields: [["ae","Nama AE"],...MONTHS.map((m,i): [string,string] => [`m${i+1}`,m]),["total","Total Peserta FIX"],["pembayaran","Pembayaran"]], note: "Jumlah peserta berstatus FIX; pembayaran dari nilai bayar yang tersimpan." },
  "rekap-customer": { title: "Rekap Peserta per Customer", fields: [["noInduk","No. Induk"],["perusahaan","Perusahaan"],["total","Peserta FIX"],["reguler","Reguler"],["inhouse","Inhouse"],["env","ENV"],["csr","CSR"],["tsm","TSM"],["epm","EPM"],["lineOfBusiness","Line of Business"]] },
  "rekap-tahunan": { title: "Rekap Peserta Reguler (Tahunan)", fields: [["kode","Kode"],...MONTHS.map((m,i): [string,string] => [`m${i+1}`,m]),["total","Total Peserta FIX"]] },
  "rekap-pelatihan": { title: "Rekap Pelatihan Running (Tahunan)", fields: [["kode","Kode"],["judul","Judul Pelatihan"],["tentatif","Tentatif"],["terkonfirmasi","Terkonfirmasi"],["batal","Batal"],["total","Total Jadwal"],["peserta","Peserta FIX"]], note: "Status jadwal mengikuti data tersimpan; terkonfirmasi tidak berarti pelatihan sudah selesai." },
  "data-uji": { title: "Data Peserta Uji (LSP)", fields: [...IDENTITY,["tanggalUji","Tanggal Uji"],["metode","Metode"],["lsp","LSP"],["sertifikat","Status Sertifikat"],["noSertifikat","No. Sertifikat"],["noResi","No. Resi"]], note: "Riwayat uji dan data LSP tersimpan. Kolom yang belum tercatat ditampilkan kosong." },
  "data-uji-pelatihan": { title: "Data Peserta Uji + Pelatihan (LSP)", fields: [] },
};

function display(value: PesertaRow[string]) {
  if (value === null || value === undefined || value === "") return "–";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}[T ]/.test(value)) {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
  }
  return typeof value === "number" ? value.toLocaleString("id-ID") : value;
}

export default function PesertaLaporanContainer({ mode }: { mode: PesertaMode }) {
  const m = usePesertaLaporanManage(mode), config = CONFIG[mode];
  const fields = mode === "fix" || mode === "cancle" ? CONFIG.bulanan.fields
    : mode === "data-uji-pelatihan" ? [...CONFIG["data-uji"].fields,["tanggalPelatihan","Tanggal Pelatihan"] as [string,string]] : config.fields;
  const columns: ColumnDef<PesertaRow>[] = [
    { key: "no", label: "No.", render: (_value,_row,index) => (m.page-1)*10+index+1 },
    ...fields.map(([key,label]): ColumnDef<PesertaRow> => ({ key, label, className: "whitespace-normal min-w-24",
      render: (_value,row) => key === "perusahaan" && row.noInduk
        ? <Anchor name={String(row.perusahaan || row.noInduk)} route={`/database/perusahaan/${encodeURIComponent(String(row.noInduk))}`} />
        : display(row[key]),
    })),
  ];
  return (
    <AppLayout breadcrumbs={[{ label: "Peserta & Sertifikasi" }, { label: config.title }]}>
      <div className="mb-4"><h1 className="text-lg font-semibold">{config.title}</h1>
        {config.note && <p className="mt-1 text-sm text-zinc-500">{config.note}</p>}</div>
      {(m.error || m.optionsError) && <p role="alert" className="mb-3 text-sm text-red-600">{m.error || m.optionsError}</p>}
      <DataTable columns={columns} data={m.error ? [] : m.data} isLoading={m.loading}
        totalData={m.pagination.total} totalPages={m.pagination.totalPages} currentPage={m.page}
        pageSize={10} onPageChange={m.setPage} searchValue={m.search} onSearchChange={m.changeSearch}
        searchPlaceholder="Cari nama, perusahaan, kode, atau AE..."
        emptyMessage={m.error || "Belum ada data yang cocok di PostgreSQL."}
        filterSlot={<div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
          <label>Tahun <select aria-label="Tahun" value={m.tahun} onChange={(e) => m.changeTahun(e.target.value)} className="ml-1 rounded-lg border border-zinc-200 px-2 py-2">
            <option value="">Semua tahun</option>{m.opsi.tahun.map((y) => <option key={y} value={y}>{y}</option>)}
          </select></label>
          {["bulanan","fix","cancle"].includes(mode) && <label>Bulan <input aria-label="Bulan" type="month" value={m.bulan} onChange={(e) => m.changeBulan(e.target.value)} className="ml-1 rounded-lg border border-zinc-200 px-2 py-2" /></label>}
          <label>Kode <select aria-label="Kode pelatihan" value={m.kode} onChange={(e) => m.changeKode(e.target.value)} className="ml-1 max-w-72 rounded-lg border border-zinc-200 px-2 py-2">
            <option value="">Semua kode</option>{m.opsi.kode.map((k) => <option key={k.kode} value={k.kode}>{k.kode} — {k.judulTraining}</option>)}
          </select></label>
        </div>}
      />
    </AppLayout>
  );
}
