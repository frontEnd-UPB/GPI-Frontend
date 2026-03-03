import React, { createContext, useContext, useMemo, useState } from "react";
import type { VacationRequest } from "../../../core/mocks/data";
import { mockVacationRequests, mockEmployees } from "../../../core/mocks/data";
import { specialties as specialtyConstants } from "../constants/specialties";
import { vacationEvents as moduleVacationEvents } from "../mocks/events";
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
  // Include module-local mock events as approved requests so they appear in requests state
  const moduleMockRequests: VacationRequest[] = moduleVacationEvents.map((me, idx) => {
    const matched = mockEmployees.find((m) => m.name === me.doctorName);
    const employeeId = matched ? matched.id : "";
    const start = new Date(me.startDate);
    const end = new Date(me.endDate);
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      id: `mod-${me.id}-${idx}`,
      employeeId,
      employeeName: me.doctorName,
      startDate: me.startDate,
      endDate: me.endDate,
      days,
      reason: "Imported mock event",
      status: VACATION_STATUS.APPROVED,
      requestDate: me.startDate,
    } as VacationRequest;
  });

  const [requests, setRequests] = useState<VacationRequest[]>([...mockVacationRequests, ...moduleMockRequests]);
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
      // Normalize employee.department to one of the canonical specialty names
      const empMap: Record<string, string> = {};
      const normalize = (dept?: string) => {
        if (!dept) return "";
        const d = dept.toLowerCase();
        // try exact or contained match against canonical specialties
        for (const s of specialtyConstants) {
          const name = s.name.toLowerCase();
          if (d === name || d.includes(name)) return s.name;
        }
        return dept; // fallback to original
      };

      mockEmployees.forEach((e) => {
        if (e.department) empMap[e.id] = normalize(e.department);
      });

      // Only include approved requests in calendar events (table continues to show pending)
      const fromRequests = requests
        .filter((r) => r.status === VACATION_STATUS.APPROVED)
        .map((r) => ({
          id: r.id,
          doctorName: r.employeeName,
          specialty: empMap[r.employeeId] ?? "",
          startDate: r.startDate,
          endDate: r.endDate,
        }));

      // Include module-local mock events so the calendar shows additional approved vacations
      const fromModuleMocks = moduleVacationEvents.map((me) => {
        // Try to resolve specialty from core mockEmployees by name when possible
        const matched = mockEmployees.find((m) => m.name === me.doctorName);
        const resolvedSpecialty = matched ? normalize(matched.department) : me.specialty;

        return {
          id: `mod-${me.id}`,
          doctorName: me.doctorName,
          specialty: resolvedSpecialty,
          startDate: me.startDate,
          endDate: me.endDate,
        };
      });

      const allEvents = [...fromRequests, ...fromModuleMocks];

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
