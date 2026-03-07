import React, { createContext, useContext, useMemo, useState } from "react";
import type { VacationRequest } from "../../../core/mocks/data";
import { mockVacationRequests, mockEmployees } from "../../../core/mocks/data";
import { VACATION_STATUS } from "../../../core/constants";
// Servicio API simulado. Más adelante podrá reemplazarse por llamadas HTTP reales.
// import { approveVacationRequest, rejectVacationRequest, setVacationRequestPending } from "../services/vacationRequestsApi";

export interface VacationRequestsContextValue {
  requests: VacationRequest[];
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
  setRequestPending: (id: string) => void;
  // Filter state shared between header and table
  search: string;
  setSearch: (value: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (value: string) => void;
  // Calendar-friendly events derived from requests and current filters
  calendarEvents: Array<{
    id: string;
    doctorName: string;
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
  const [requests, setRequests] = useState<VacationRequest[]>([...mockVacationRequests]);
  const [search, setSearch] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");

  const approveRequest = (id: string) => {
    // En el futuro, aquí podrías llamar a la API real, por ejemplo:
    // await approveVacationRequest(id);
    // y luego recargar o actualizar el estado con la respuesta.
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: VACATION_STATUS.APPROVED, rejectionReason: null }
          : request
      )
    );
  };

  const rejectRequest = (id: string, reason: string) => {
    // Futuro: await rejectVacationRequest(id, reason);
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: VACATION_STATUS.REJECTED,
              rejectionReason: reason,
            }
          : request
      )
    );
  };

  const setRequestPending = (id: string) => {
    // Futuro: await setVacationRequestPending(id);
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: VACATION_STATUS.PENDING,
              rejectionReason: null,
            }
          : request
      )
    );
  };

  const value = useMemo(
    () => {
      // Derive calendar events from requests and employee data
      const empMap: Record<string, { fullName: string; department: string }> = {};

      mockEmployees.forEach((e) => {
        const fullName = `${e.firstname} ${e.lastname}`;
        empMap[e.id] = {
          fullName,
          department: e.department ?? "",
        };
      });

      // Only include approved requests in calendar events (table continues to show pending)
      const fromRequests = requests
        .filter((r) => r.status === VACATION_STATUS.APPROVED)
        .map((r) => ({
          id: r.id,
          doctorName: empMap[r.employeeId]?.fullName ?? "Unknown employee",
          department: empMap[r.employeeId]?.department ?? "",
          startDate: r.startDate,
          endDate: r.endDate,
        }));
      const allEvents = [...fromRequests];

      // Apply centralized filtering (search by doctor name and specialty)
      const filteredEvents = allEvents.filter((evt) => {
        if (search.trim()) {
          const term = search.toLowerCase();
          if (!evt.doctorName.toLowerCase().includes(term)) return false;
        }

        if (specialtyFilter) {
          if (evt.department !== specialtyFilter) return false;
        }

        return true;
      });

      return {
        requests,
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
    [requests, search, specialtyFilter]
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
