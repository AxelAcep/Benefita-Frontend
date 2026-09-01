import { useState, useEffect, useCallback, useRef } from "react";
import {
  getBiodataPeserta,
  updateBiodataPeserta,
  BiodataPeserta,
  UpdateBiodataPesertaRequest,
} from "@/lib/services/input.service";

interface UsePesertaBiodataOptions {
  id: string;
}

export function usePesertaBiodata({ id }: UsePesertaBiodataOptions) {
  const [data, setData] = useState<BiodataPeserta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchBiodata = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getBiodataPeserta(id);
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil biodata peserta",
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchBiodata();
  }, [fetchBiodata]);

  const submitBiodata = useCallback(
    async (payload: UpdateBiodataPesertaRequest) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setIsSuccess(false);

      try {
        const updated = await updateBiodataPeserta(id, payload);
        if (isMounted.current) {
          setIsSuccess(true);
        }
        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal mengupdate biodata peserta";
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
    data,
    isLoading,
    error,
    refetch: fetchBiodata,

    submitBiodata,
    isSubmitting,
    submitError,
    isSuccess,
  };
}
