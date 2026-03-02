import { useState, useEffect } from "react";
import { getVacationBalance } from "../services/vacationDoctorService";
 
export function useVacationBalance(doctorId) {
  const [balance, setBalance] = useState({
    assigned: null,
    used: null,
    available: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchBalance() {
      try {
        setLoading(true);
        setError(null);
        const data = await getVacationBalance(doctorId);
        if (!cancelled) {
          setBalance(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
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
  }, [doctorId]);

  const refetch = () => {
    setBalance({ assigned: null, used: null, available: null });
    setLoading(true);
    getVacationBalance(doctorId)
      .then(setBalance)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  return { balance, loading, error, refetch };
}