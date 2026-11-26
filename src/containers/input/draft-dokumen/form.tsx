"use client";
import {useState} from "react";
import {TextInput} from "@/components/base/form-field";
import {useCan} from "@/hooks/use-can";
import {saveDokumenPembayaran} from "@/lib/services/dokumen-pembayaran.service";
import type {JenisDokumen,IsianDokumen,DokumenPembayaranData} from "@/lib/types/dokumen-pembayaran";
export type {JenisDokumen};
const uang=(value:string)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value)||0);
const tanggal=(value:string)=>new Date(value+"T00:00:00Z").toLocaleDateString("id-ID",{timeZone:"Asia/Jakarta",dateStyle:"long"});
const monetary=["harga","ppn","diskon","total","dibayar"];
type Field=[keyof IsianDokumen,string];
function terbilang(n:number):string {
  const a=["","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"];
  if(n===0)return "nol";
  if(n<12)return a[n];if(n<20)return terbilang(n-10)+" belas";
  if(n<100)return terbilang(Math.floor(n/10))+" puluh"+(n%10?" "+terbilang(n%10):"");
  if(n<200)return "seratus"+(n%100?" "+terbilang(n%100):"");
  if(n<1000)return terbilang(Math.floor(n/100))+" ratus"+(n%100?" "+terbilang(n%100):"");
  if(n<2000)return "seribu"+(n%1000?" "+terbilang(n%1000):"");
  for(const [scale,label]of [[1e9,"miliar"],[1e6,"juta"],[1e3,"ribu"]] as const){if(n>=scale)return terbilang(Math.floor(n/scale))+" "+label+(n%scale?" "+terbilang(n%scale):"");}
  return "";
}
export function DraftDokumenForm({data,jenis,noJadwal,idPeserta}:{data:DokumenPembayaranData;jenis:JenisDokumen;noJadwal:string;idPeserta:string}){
  const [isian,setIsian]=useState(data.isian),[saved,setSaved]=useState(data);
  const [saving,setSaving]=useState(false),[error,setError]=useState<string|null>(null),[message,setMessage]=useState<string|null>(null);
  const editable=useCan("input","update"),dirty=JSON.stringify(isian)!==JSON.stringify(saved.isian);
  const title=jenis==="invoice"?"Invoice":"Kwitansi";
  const set=(name:keyof IsianDokumen,value:string)=>{setIsian(v=>({...v,[name]:value}));setError(null);setMessage(null);};
  function fields(items:Field[]){return items.map(([name,label])=>{
    const readOnly=!editable||name==="nomor"||name==="kode"||(jenis==="invoice"&&name==="dibayar")||(jenis==="kwitansi"&&["harga","ppn","diskon","total"].includes(name));
    return <TextInput key={name} label={label} aria-label={label} value={isian[name]} readOnly={readOnly}
      type={name==="tanggal"?"date":monetary.includes(name)?"number":"text"} min={0} step={1}
      placeholder={name==="nomor"?"Nomor dibuat saat simpan":undefined}
      onChange={e=>set(name,e.target.value)} />;
  });}
  async function save(event:React.FormEvent){event.preventDefault();if(saving)return;setSaving(true);setError(null);setMessage(null);
    try{const result=await saveDokumenPembayaran(noJadwal,idPeserta,jenis,isian,saved.dokumen?.versi??0);setSaved(result);setIsian(result.isian);setMessage(`${title} tersimpan: ${result.dokumen?.nomor}`);}
    catch(e){setError(e instanceof Error?e.message:"Gagal menyimpan dokumen.");}finally{setSaving(false);}}
  const paper=saved.isian;
  return <>
    <form onSubmit={save} className="billing-editor grid gap-5">
      <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="mb-3 font-semibold">Identitas Dokumen</h2>
        <div className="grid gap-3 sm:grid-cols-2">{fields([["nomor",`No. ${title}`],["tanggal","Tanggal Dokumen"],["noPO","No. PO"],["namaPeserta","Nama Peserta"],["instansi","Instansi"],["alamat","Alamat"]])}</div></section>
      <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="mb-3 font-semibold">Pelatihan dan Pembayaran</h2>
        <div className="grid gap-3 sm:grid-cols-2">{fields([["kode","Kode Pelatihan"],["judul","Judul Pelatihan"],["kota","Kota"],["periode","Periode Pelatihan"],["harga","Biaya (Rp)"],["diskon","Diskon (Rp)"],["ppn","PPN (Rp)"],["total","Total Tagihan (Rp)"],["dibayar",jenis==="kwitansi"?"Uang Diterima (Rp)":"Pembayaran saat Penyimpanan (Rp)"]])}</div>
        {jenis==="invoice"&&editable&&<button type="button" className="mt-3 text-xs font-medium text-emerald-700 underline" onClick={()=>set("total",String(Math.max(0,Number(isian.harga||0)-Number(isian.diskon||0)+Number(isian.ppn||0))))}>Hitung biaya − diskon + PPN</button>}
        <p className="mt-2 text-xs text-zinc-500">PPN dan diskon dalam rupiah. Total tagihan mengikuti nilai yang disimpan pada invoice.</p></section>
      <section className="rounded-xl border border-zinc-200 bg-white p-5"><h2 className="mb-3 font-semibold">Petugas Dokumen</h2>
        <div className="grid gap-3 sm:grid-cols-2">{fields([["administrasi","Nama Administrasi"],["jabatan","Jabatan"]])}</div></section>
      {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}{message&&<p role="status" className="text-sm text-emerald-700">{message}</p>}
      <div className="flex flex-wrap gap-3">
        {editable&&<button disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving?"Menyimpan...":`Simpan ${title}`}</button>}
        <button type="button" disabled={!saved.dokumen||dirty||saving} onClick={()=>window.print()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-40">Cetak / Simpan PDF</button>
        {dirty&&<span className="self-center text-xs text-zinc-500">Ada perubahan yang belum disimpan.</span>}
      </div>
    </form>
    {saved.dokumen&&<article className="billing-print hidden">
      <header className="mb-8 border-b-2 border-zinc-900 pb-4"><h1 className="text-2xl font-bold">BENEFITA</h1><h2 className="mt-2 text-xl font-semibold uppercase">{title}</h2><p>{paper.nomor}</p></header>
      <div className="mb-6 grid grid-cols-2 gap-5"><div><p className="font-semibold">{jenis==="kwitansi"?"Diterima dari":"Ditagihkan kepada"}</p><p>{paper.instansi}</p><p>{paper.alamat}</p><p>Peserta: {paper.namaPeserta}</p></div><div><p>Tanggal: {tanggal(paper.tanggal)}</p>{paper.noPO&&<p>No. PO: {paper.noPO}</p>}</div></div>
      <table className="mb-6 w-full border-collapse"><thead><tr className="border-b border-zinc-900"><th className="py-2 text-left">Keterangan</th><th className="py-2 text-right">Jumlah</th></tr></thead><tbody><tr className="border-b border-zinc-300"><td className="py-3">{paper.kode} — {paper.judul}<br/>{paper.periode}<br/>{paper.kota}</td><td className="text-right">{uang(jenis==="kwitansi"?paper.dibayar:paper.harga)}</td></tr></tbody></table>
      {jenis==="invoice"?<dl className="ml-auto grid w-80 grid-cols-2 gap-2"><dt>Biaya</dt><dd className="text-right">{uang(paper.harga)}</dd><dt>Diskon</dt><dd className="text-right">{uang(paper.diskon)}</dd><dt>PPN</dt><dd className="text-right">{uang(paper.ppn)}</dd>{Number(paper.total)-Number(paper.harga)+Number(paper.diskon)-Number(paper.ppn)!==0&&<><dt>Penyesuaian total</dt><dd className="text-right">{uang(String(Number(paper.total)-Number(paper.harga)+Number(paper.diskon)-Number(paper.ppn)))}</dd></>}<dt className="font-bold">Total Tagihan</dt><dd className="text-right font-bold">{uang(paper.total)}</dd></dl>:<p className="rounded border border-zinc-300 p-3">Terbilang: {terbilang(Number(paper.dibayar))} rupiah</p>}
      <div className="ml-auto mt-14 w-64 text-center"><p>{paper.kota}{paper.kota?", ":""}{tanggal(paper.tanggal)}</p><div className="h-20"/><p className="font-semibold">{paper.administrasi||"________________"}</p><p>{paper.jabatan}</p></div>
    </article>}
    <style>{`@media print { @page {size:A4; margin:15mm} body * {visibility:hidden} .billing-print,.billing-print * {visibility:visible} .billing-print {display:block!important;position:absolute;left:0;top:0;width:100%;color:#000;background:#fff;font-size:11pt} .billing-print header {display:block!important} .billing-editor {display:none!important} }`}</style>
  </>;
}
