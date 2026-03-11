import { useState } from "react";
import {
  submitVacationRequest,
  type SubmitVacationData,
} from "../services/vacationDoctorService";
import type { VacationRequest } from "../../../../core/mocks/data";

interface UseSubmitVacationRequestResult {
  submit: (data: SubmitVacationData) => Promise<VacationRequest | null>;
  loading: boolean;
  error: string | null;
}

export function useSubmitVacationRequest(
  employeeId: string,
  onSuccess?: (newRequest: VacationRequest) => void
): UseSubmitVacationRequestResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    data: SubmitVacationData
  ): Promise<VacationRequest | null> => {
    if (!data.startDate || !data.endDate) return null;

    setLoading(true);
    setError(null);
    try {
      const newRequest = await submitVacationRequest(employeeId, data);
      onSuccess?.(newRequest);
      return newRequest;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit request.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
