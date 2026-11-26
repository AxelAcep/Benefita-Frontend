"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import DaftarkanUjiModal from "./components/daftarkan-uji-modal";
import ModalTambahPeserta from "./components/modal-tambah-peserta";
import TableListPeserta from "./components/table-list-peserta";
import { usePesertaJadwalManage } from "./manage";

const tanggal = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "–";

function PesertaJadwal({ noJadwal }: { noJadwal: string }) {
  const href = `/input/${encodeURIComponent(noJadwal)}`;
  const router = useRouter();
  const m = usePesertaJadwalManage(noJadwal);
  const list = m.list;
  const jadwal = list.jadwal;
  const menu = [
    { label: "Rekap Evaluasi", href: `${href}/rekap-evaluasi` },
    { label: "Rekap Nomor Sertifikat", href: `${href}/Recap` },
    { label: "Link Pengisian Data", href: `/pengumuman/${encodeURIComponent(noJadwal)}` },
    { label: "Pindah Jadwal Peserta", href: `${href}/pindah-peserta` },
    { label: "Perusahaan Target", href: `${href}/perusahaan-target` },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Perusahaan", href: "/perusahaan" }, { label: "Input Data" }]}>
      <div className="space-y-4">
        <button type="button" onClick={() => router.back()} className="text-sm font-medium text-emerald-700 hover:underline">
          Kembali
        </button>
        {jadwal && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-500">{jadwal.noJadwal} · {jadwal.kodePelatihan}</p>
            <h1 className="font-semibold">{jadwal.judulLengkap}</h1>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-zinc-500">Tanggal</dt><dd>{tanggal(jadwal.tglMulai)} – {tanggal(jadwal.tglSelesai)}</dd></div>
              <div><dt className="text-zinc-500">Metode dan lokasi</dt><dd>{[jadwal.metode, jadwal.kota, jadwal.lokasiDetail].filter(Boolean).join(" · ") || "–"}</dd></div>
              <div><dt className="text-zinc-500">Status</dt><dd>{jadwal.status}</dd></div>
              <div><dt className="text-zinc-500">Biaya</dt><dd>Rp{jadwal.biaya.toLocaleString("id-ID")}</dd></div>
              <div><dt className="text-zinc-500">Peserta FIX online</dt><dd>{jadwal.pesertaFixOnline}</dd></div>
              <div><dt className="text-zinc-500">Peserta FIX offline</dt><dd>{jadwal.pesertaFixOffline}</dd></div>
              {jadwal.catatan && <div className="sm:col-span-2"><dt className="text-zinc-500">Catatan</dt><dd>{jadwal.catatan}</dd></div>}
            </dl>
          </section>
        )}
        <nav aria-label="Menu jadwal" className="flex flex-wrap gap-2">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
              {item.label}
            </Link>
          ))}
        </nav>
        {list.error && (
          <div role="alert" className="flex gap-3 text-sm text-red-700">
            <p>{list.error}</p>
            <button type="button" onClick={list.refetch} className="font-medium underline">Coba lagi</button>
          </div>
        )}
        <TableListPeserta
          data={list.rows}
          totalData={list.meta?.total ?? 0}
          currentPage={list.page}
          totalPages={Math.max(1, list.meta?.totalPages ?? list.page)}
          onPageChange={list.setPage}
          onSearchChange={list.changeSearch}
          searchValue={list.search}
          isLoading={list.loading}
          onTambah={jadwal ? m.add : undefined}
          jenisTraining={jadwal?.jenisTraining}
          aksiHandlers={{
            onEdit: m.edit,
            onKonfirmasi: (p) => router.push(`${href}/konfirmasi/${p.id}`),
            onCetakKwitansi: (p) => router.push(`${href}/kwitansi/${p.id}`),
            onCetakInvoice: (p) => router.push(`${href}/invoice/${p.id}`),
            onPesertaFinal: m.toggleFinal,
            onDaftarkanUji: m.setPesertaUji,
          }}
        />
      </div>

      <ModalTambahPeserta
        isOpen={m.modal !== null}
        onClose={m.close}
        onSimpan={m.save}
        isLoading={m.loadingDetail || m.saving}
        isEditMode={m.modal === "edit"}
        initialData={m.initialForm}
        inputOleh={m.detail?.pegawaiInput?.nama}
        tanggalInput={m.detail?.tglInput?.split("T")[0]}
        updateOleh={m.detail?.pegawaiUpdate?.nama}
        tanggalUpdate={m.detail?.tglUpdate?.split("T")[0]}
      />
      <DaftarkanUjiModal
        open={Boolean(m.pesertaUji)}
        onClose={() => { if (!m.registering) m.setPesertaUji(null); }}
        onSubmit={m.daftarUji}
        namaPeserta={m.pesertaUji?.nama}
        isLoading={m.registering}
      />
    </AppLayout>
  );
}

export default function PesertaJadwalContainer() {
  const { id } = useParams<{ id: string }>();
  return <PesertaJadwal key={id} noJadwal={id} />;
}
