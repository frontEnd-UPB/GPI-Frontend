import { useState } from "react";
import { submitVacationRequest } from "../services/vacationDoctorService";

export function useSubmitVacationRequest(
  employeeId,
  onSuccess
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (data) => {
    if (!data.startDate || !data.endDate) return;

    setLoading(true);
    setError(null);
    try {
      await submitVacationRequest(employeeId, data);
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit request.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
