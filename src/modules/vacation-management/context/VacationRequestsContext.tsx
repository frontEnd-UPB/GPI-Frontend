import React, { createContext, useContext, useMemo, useState } from "react";
import type { VacationRequest } from "../../../core/mocks/data";
import { mockVacationRequests, mockEmployees } from "../../../core/mocks/data";
import { VACATION_STATUS } from "../../../core/constants";

export interface VacationRequestsContextValue {
  requests: VacationRequest[];
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
  // Filter state shared between header and table
  search: string;
  setSearch: (value: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (value: string) => void;
  // Calendar-friendly events derived from requests and current filters
  calendarEvents: Array<{
    id: string;
    doctorName: string;
    specialty: string;
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
  const [requests, setRequests] = useState<VacationRequest[]>(mockVacationRequests);
  const [search, setSearch] = useState<string>("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");

  const approveRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: VACATION_STATUS.APPROVED, rejectionReason: null }
          : request
      )
    );
  };

  const rejectRequest = (id: string, reason: string) => {
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

  const value = useMemo(
    () => {
      // Derive calendar events from requests and employee data
      const empMap: Record<string, string> = {};
      mockEmployees.forEach((e) => {
        if (e.department) empMap[e.id] = e.department;
      });

      const allEvents = requests.map((r) => ({
        id: r.id,
        doctorName: r.employeeName,
        specialty: empMap[r.employeeId] ?? "",
        startDate: r.startDate,
        endDate: r.endDate,
      }));

      // Apply centralized filtering (search by doctor name and specialty)
      const filteredEvents = allEvents.filter((evt) => {
        if (search.trim()) {
          const term = search.toLowerCase();
          if (!evt.doctorName.toLowerCase().includes(term)) return false;
        }

        if (specialtyFilter) {
          if (evt.specialty !== specialtyFilter) return false;
        }

        return true;
      });

      return {
        requests,
        approveRequest,
        rejectRequest,
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
