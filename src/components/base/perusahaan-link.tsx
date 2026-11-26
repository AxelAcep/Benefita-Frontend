import Anchor from "@/components/base/anchor";

const ROUTES: Record<string, string> = {
  PERUSAHAAN: "perusahaan", RUMAH_SAKIT: "rumah-sakit", PEMDA: "pemda",
  SEKOLAH: "sekolah", INSTANSI_DAERAH: "instansi-daerah",
};

export default function PerusahaanLink({ noInduk, jenisInstansi, label }: {
  noInduk: string; jenisInstansi: string; label: string;
}) {
  return <Anchor name={label} route={`/database/${ROUTES[jenisInstansi] || "perusahaan"}/${encodeURIComponent(noInduk)}`} />;
}
