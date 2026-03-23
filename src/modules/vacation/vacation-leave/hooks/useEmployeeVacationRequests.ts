import { useCallback, useEffect, useState } from "react";
import type { VacationRequest } from "../../../../core/mocks/data";
import { ApiError } from "../../../../core/services/httpClient";
import {
  cancelVacationRequest,
  listEmployeeVacationRequests,
  updateVacationRequest,
  type UpdateVacationRequestData,
} from "../services/vacationDoctorService";

function isNoVacationsResponse(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 404) {
    const detail =
      typeof error.data === "object" &&
      error.data !== null &&
      "detail" in error.data &&
      typeof error.data.detail === "string"
        ? error.data.detail
        : "";

    const message = `${detail} ${error.message}`.toLowerCase();
    return (
      message.includes("no vacations") ||
      message.includes("no vacation requests") ||
      message.includes("has no vacations")
    );
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("no vacations") ||
      message.includes("no vacation requests") ||
      message.includes("has no vacations")
    );
  }

  return false;
}

interface UseEmployeeVacationRequestsResult {
  requests: VacationRequest[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  refresh: () => void;
  cancel: (id: string) => Promise<VacationRequest | null>;
  update: (
    id: string,
    updates: UpdateVacationRequestData
  ) => Promise<VacationRequest | null>;
  addLocally: (request: VacationRequest) => void;
}

export function useEmployeeVacationRequests(
  employeeId: string
): UseEmployeeVacationRequestsResult {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!employeeId) {
      setRequests([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listEmployeeVacationRequests(employeeId);
      setRequests(data);
    } catch (err) {
      if (isNoVacationsResponse(err)) {
        setRequests([]);
        setError(null);
        return;
      }

      const message =
        err instanceof Error ? err.message : "Failed to load vacation requests.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => {
    void load();
  };

  const cancel = async (id: string): Promise<VacationRequest | null> => {
    setActionLoading(true);
    setError(null);

    try {
      const updated = await cancelVacationRequest(id);
      if (!updated) return null;

      setRequests((prev) =>
        prev.map((request) => (request.id === updated.id ? updated : request))
      );

      return updated;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to cancel vacation request.";
      setError(message);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const update = async (
    id: string,
    updates: UpdateVacationRequestData
  ): Promise<VacationRequest | null> => {
    setActionLoading(true);
    setError(null);

    try {
      const updated = await updateVacationRequest(id, updates);
      if (!updated) return null;

      setRequests((prev) =>
        prev.map((request) => (request.id === updated.id ? updated : request))
      );

      return updated;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update vacation request.";
      setError(message);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const addLocally = (request: VacationRequest) => {
    setRequests((prev) => [...prev, request]);
  };

  return {
    requests,
    loading,
    actionLoading,
    error,
    refresh,
    cancel,
    update,
    addLocally,
  };
}
