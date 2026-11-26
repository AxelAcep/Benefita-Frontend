"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import DaftarkanUjiModal from "./components/daftarkan-uji-modal";
import ModalTambahPeserta from "./components/modal-tambah-peserta";
import TableListPeserta from "./components/table-list-peserta";
import { usePesertaJadwalManage } from "./manage";

const tanggal = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "–";

function PesertaJadwal({ noJadwal }: { noJadwal: string }) {
  const href = `/input/${encodeURIComponent(noJadwal)}`;
  const router = useRouter();
  const m = usePesertaJadwalManage(noJadwal);
  const list = m.list;
  const jadwal = list.jadwal;
  const menu = [
    { label: "Rekap Evaluasi", href: `${href}/rekap-evaluasi` },
    { label: "Rekap Nomor Sertifikat", href: `${href}/Recap` },
    {
      label: "Link Pengisian Data",
      href: `/pengumuman/${encodeURIComponent(noJadwal)}`,
    },
    { label: "Pindah Jadwal Peserta", href: `${href}/pindah-peserta` },
    { label: "Perusahaan Target", href: `${href}/perusahaan-target` },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Input Data" },
      ]}
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          Kembali
        </button>
        {jadwal && (
          <section aria-label="Detail kegiatan" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h1 className="mb-5 text-base font-semibold tracking-tight text-zinc-700">Detail Kegiatan</h1>
            <dl className="grid gap-x-6 gap-y-4 text-sm md:grid-cols-2 xl:grid-cols-3">
              {[
                { label: "No. Jadwal", value: jadwal.noJadwal },
                {
                  label: "Kode",
                  value: <>{jadwal.kodePelatihan}{jadwal.batch != null && <span className="mt-1 block text-[13px] text-zinc-500">{jadwal.kodePelatihan} Batch.{jadwal.batch}</span>}</>,
                },
                { label: "Tanggal", value: `${tanggal(jadwal.tglMulai)} s/d ${tanggal(jadwal.tglSelesai)}` },
                { label: "Metode", value: jadwal.metode },
                { label: "Lokasi/Hotel", value: jadwal.lokasiDetail || "–" },
                { label: "Kota", value: jadwal.kota },
                {
                  label: "Biaya",
                  value: <div className="space-y-1 tabular-nums">
                    <p>Online: Rp{jadwal.biayaOnline.toLocaleString("id-ID")}</p>
                    <p>Offline: Rp{jadwal.biayaOffline.toLocaleString("id-ID")}</p>
                    <p>Sertifikasi: {jadwal.biayaSertifikasi == null ? "–" : `Rp${jadwal.biayaSertifikasi.toLocaleString("id-ID")}`}</p>
                  </div>,
                },
                { label: "Judul", value: jadwal.judulLengkap },
                { label: "Status Jadwal", value: jadwal.status },
                {
                  label: "Catatan",
                  value: <div className="space-y-1">
                    <p>Trainer: {jadwal.trainer || "–"}</p>
                    {jadwal.catatan && <p className="whitespace-pre-wrap">{jadwal.catatan}</p>}
                  </div>,
                },
                {
                  label: "Peserta FIX",
                  value: <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-600 tabular-nums">
                    <span>Online: <strong className="font-medium text-zinc-800">{jadwal.pesertaFixOnline}</strong></span>
                    <span>Offline: <strong className="font-medium text-zinc-800">{jadwal.pesertaFixOffline}</strong></span>
                  </div>,
                },
              ].map(({ label, value }) => (
                <div key={label} className={`grid min-w-0 grid-cols-1 content-start items-start gap-1.5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-3 ${label === "Judul" ? "xl:col-span-2" : ""}`}>
                  <dt className="font-medium leading-6 text-zinc-600 sm:pt-2">{label}</dt>
                  <dd className="min-h-10 min-w-0 wrap-anywhere rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-normal leading-6 text-zinc-700">{value || "–"}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <nav aria-label="Menu jadwal" className="flex flex-wrap gap-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {list.error && (
          <div role="alert" className="flex gap-3 text-sm text-red-700">
            <p>{list.error}</p>
            <button
              type="button"
              onClick={list.refetch}
              className="font-medium underline"
            >
              Coba lagi
            </button>
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
        perusahaan={m.detail?.perusahaan}
        tanggalInvoice={m.detail?.tanggalInvoice}
        inputOleh={m.detail?.pegawaiInput?.nama}
        tanggalInput={m.detail?.tglInput?.split("T")[0]}
        updateOleh={m.detail?.pegawaiUpdate?.nama}
        tanggalUpdate={m.detail?.tglUpdate?.split("T")[0]}
      />
      <DaftarkanUjiModal
        open={Boolean(m.pesertaUji)}
        onClose={() => {
          if (!m.registering) m.setPesertaUji(null);
        }}
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
