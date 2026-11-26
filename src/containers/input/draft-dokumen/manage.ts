"use client";
import {useEffect,useState} from "react";
import {getDokumenPembayaran} from "@/lib/services/dokumen-pembayaran.service";
import type {JenisDokumen,DokumenPembayaranData} from "@/lib/types/dokumen-pembayaran";

export function useDraftDokumen(noJadwal:string,idPeserta:string|undefined,jenis:JenisDokumen){
  const [revision,setRevision]=useState(0);
  const [state,setState]=useState<{key:string;data:DokumenPembayaranData|null;error:string|null}|null>(null);
  const key=JSON.stringify([noJadwal,idPeserta,jenis,revision]);
  const valid=Boolean(noJadwal&&idPeserta&&/^[1-9]\d*$/.test(idPeserta));
  useEffect(()=>{
    if(!valid||!idPeserta)return;
    let current=true;
    getDokumenPembayaran(noJadwal,idPeserta,jenis).then(
      data=>{if(current)setState({key,data,error:null});},
      (error:unknown)=>{if(current)setState({key,data:null,error:error instanceof Error?error.message:"Gagal mengambil dokumen."});},
    );
    return()=>{current=false;};
  },[key,noJadwal,idPeserta,jenis,valid]);
  const result=state?.key===key?state:null;
  return {data:result?.data??null,error:valid?result?.error??null:"Nomor peserta tidak valid.",loading:valid&&!result,
    canRetry:valid,retry:()=>setRevision(v=>v+1)};
}
