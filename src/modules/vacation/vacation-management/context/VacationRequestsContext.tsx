import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { VacationRequest } from "../../../../core/mocks/data";
import { VACATION_STATUS } from "../../../../core/constants";
import {
  approveVacationRequest,
  fetchVacationRequests,
  rejectVacationRequest,
  setVacationRequestPending,
  fetchEmployeeProfile,
} from "../services/vacationRequestsApi";

export interface VacationRequestsContextValue {
  requests: VacationRequest[];
  error: string | null;
  approveRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
  setRequestPending: (id: string) => Promise<void>;
  // Filter state shared between header and table
  search: string;
  setSearch: (value: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (value: string) => void;
  // Calendar-friendly events derived from requests and current filters
  calendarEvents: Array<{
    id: string;
    employeeName: string;
    department: string;
    startDate: string;
    endDate: string;
  }>;
}

const VacationRequestsContext = createContext<VacationRequestsContextValue | undefined>(
  undefined
);

export const VacationRequestsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [employeeProfiles, setEmployeeProfiles] = useState<
    Record<string, { firstname: string; lastname: string; department?: string }>
  >({});
  const [loadedEmployeeIds, setLoadedEmployeeIds] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");

  // Fetch individual employee profile by ID (same way auth does after login)
  // Using useCallback with NO dependency on employeeProfiles to avoid circular deps
  const fetchAndCacheEmployeeProfile = useCallback(
    async (employeeId: string) => {
      // Skip if already loaded
      if (loadedEmployeeIds.has(employeeId)) return;

      try {
        const profile = await fetchEmployeeProfile(employeeId);
        setEmployeeProfiles((prev) => ({
          ...prev,
          [employeeId]: profile,
        }));
        setLoadedEmployeeIds((prev) => new Set(prev).add(employeeId));
      } catch (err) {
        // Mark as attempted to avoid repeated failures
        setLoadedEmployeeIds((prev) => new Set(prev).add(employeeId));
        // If fetch fails, continue without this employee's profile
      }
    },
    [loadedEmployeeIds]
  );

  const loadRequests = useCallback(async () => {
    try {
      setError(null);
      const nextRequests = await fetchVacationRequests();
      setRequests(nextRequests);

      // Fetch employee profiles for all unique employee IDs in the requests
      const uniqueEmployeeIds = Array.from(
        new Set(nextRequests.map((r) => r.employeeId))
      );
      
      // Fetch all profiles in parallel
      await Promise.allSettled(
        uniqueEmployeeIds.map((id) => fetchAndCacheEmployeeProfile(id))
      );
    } catch (err) {
      setRequests([]);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load vacation requests.";
      setError(message);
    }
  }, [fetchAndCacheEmployeeProfile]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const approveRequest = async (id: string) => {
    try {
      setError(null);
      await approveVacationRequest(id);
      await loadRequests();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to approve vacation request.";
      setError(message);
      throw err;
    }
  };

  const rejectRequest = async (id: string, reason: string) => {
    try {
      setError(null);
      await rejectVacationRequest(id, reason);
      await loadRequests();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reject vacation request.";
      setError(message);
      throw err;
    }
  };

  const setRequestPending = async (id: string) => {
    try {
      setError(null);
      await setVacationRequestPending(id);
      await loadRequests();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update vacation request status.";
      setError(message);
      throw err;
    }
  };

  const value = useMemo(
    () => {
      // Derive calendar events from requests and employee profiles fetched by ID
      const empMap: Record<string, { fullName: string; department: string }> = {};

      Object.entries(employeeProfiles).forEach(([empId, profile]) => {
        const fullName = `${profile.firstname} ${profile.lastname}`.trim();
        empMap[empId] = {
          fullName,
          department: profile.department ?? "",
        };
      });

      // Only include approved requests in calendar events (table continues to show pending)
      const fromRequests = requests
        .filter((r) => r.status === VACATION_STATUS.APPROVED)
        .map((r) => ({
          id: r.id,
          employeeName: empMap[r.employeeId]?.fullName ?? "Unknown employee",
          department: empMap[r.employeeId]?.department ?? "",
          startDate: r.startDate,
          endDate: r.endDate,
        }));
      const allEvents = [...fromRequests];

      // Apply centralized filtering (search by employee name and specialty)
      const filteredEvents = allEvents.filter((evt) => {
        if (search.trim()) {
          const term = search.toLowerCase();
          if (!evt.employeeName.toLowerCase().includes(term)) return false;
        }

        if (specialtyFilter) {
          if (evt.department !== specialtyFilter) return false;
        }

        return true;
      });

      return {
        requests,
        error,
        approveRequest,
        rejectRequest,
        setRequestPending,
        search,
        setSearch,
        specialtyFilter,
        setSpecialtyFilter,
        calendarEvents: filteredEvents,
      };
    },
    [error, requests, search, specialtyFilter, employeeProfiles]
  );

  return (
    <VacationRequestsContext.Provider value={value}>
      {children}
    </VacationRequestsContext.Provider>
  );
};

export const useVacationRequests = (): VacationRequestsContextValue => {
  const context = useContext(VacationRequestsContext);

  if (!context) {
    throw new Error("useVacationRequests must be used within a VacationRequestsProvider");
  }

  return context;
};
