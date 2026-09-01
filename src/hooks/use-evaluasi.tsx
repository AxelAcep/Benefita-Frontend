import { useState, useEffect, useCallback, useRef } from "react";
import {
  getEvaluasiContext,
  getJudulTrainingOptions,
  createEvaluasiPelatihan,
  EvaluasiContext,
  CreateEvaluasiPelatihanRequest,
  EvaluasiPelatihan,
  JudulTrainingOption,
} from "@/lib/services/input.service";

interface UseEvaluasiPelatihanOptions {
  id: string;
}

export function useEvaluasiPelatihan({ id }: UseEvaluasiPelatihanOptions) {
  const [context, setContext] = useState<EvaluasiContext | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [contextError, setContextError] = useState<string | null>(null);

  const [judulTrainingOptions, setJudulTrainingOptions] = useState<
    JudulTrainingOption[]
  >([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchContext = useCallback(async () => {
    if (!id) return;

    setIsLoadingContext(true);
    setContextError(null);

    try {
      const result = await getEvaluasiContext(id);
      if (isMounted.current) {
        setContext(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setContextError(
          err instanceof Error ? err.message : "Gagal mengambil data evaluasi",
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoadingContext(false);
      }
    }
  }, [id]);

  const fetchJudulTrainingOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    setOptionsError(null);

    try {
      const result = await getJudulTrainingOptions();
      if (isMounted.current) {
        setJudulTrainingOptions(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setOptionsError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil daftar pelatihan",
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoadingOptions(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchContext();
    fetchJudulTrainingOptions();
  }, [fetchContext, fetchJudulTrainingOptions]);

  const submitEvaluasi = useCallback(
    async (
      payload: CreateEvaluasiPelatihanRequest,
    ): Promise<EvaluasiPelatihan> => {
      setIsSubmitting(true);
      setSubmitError(null);
      setIsSuccess(false);

      try {
        const created = await createEvaluasiPelatihan(id, payload);
        if (isMounted.current) {
          setIsSuccess(true);
        }
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal mengirim evaluasi";
        if (isMounted.current) {
          setSubmitError(message);
        }
        throw err;
      } finally {
        if (isMounted.current) {
          setIsSubmitting(false);
        }
      }
    },
    [id],
  );

  return {
    // context (info peserta + jadwal + status sudah isi atau belum)
    context,
    isLoadingContext,
    contextError,
    refetchContext: fetchContext,

    // opsi pelatihan diminati (checkbox)
    judulTrainingOptions,
    isLoadingOptions,
    optionsError,

    // submit
    submitEvaluasi,
    isSubmitting,
    submitError,
    isSuccess,
  };
}
