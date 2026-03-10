import { useState, useEffect } from "react";
import { getVacationBalance } from "../services/vacationDoctorService";
import type { VacationBalance } from "../../../core/constants";

interface UseVacationBalanceResult {
  balance: VacationBalance | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVacationBalance(employeeId: string): UseVacationBalanceResult {
  const [balance, setBalance] = useState<VacationBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBalance() {
      try {
        setLoading(true);
        setError(null);
        const data = await getVacationBalance(employeeId);
        if (!cancelled) {
          setBalance(data ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBalance();
    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  const refetch = () => {
    setBalance(null);
    setLoading(true);
    getVacationBalance(employeeId)
      .then((data) => setBalance(data ?? null))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unknown error")
      )
      .finally(() => setLoading(false));
  };

  return { balance, loading, error, refetch };
}
