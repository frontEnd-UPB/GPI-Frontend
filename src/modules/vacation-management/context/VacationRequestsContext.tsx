import React, { createContext, useContext, useMemo, useState } from "react";
import type { VacationRequest } from "../../../core/mocks/data";
import { mockVacationRequests } from "../../../core/mocks/data";
import { VACATION_STATUS } from "../../../core/constants";

export interface VacationRequestsContextValue {
  requests: VacationRequest[];
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
}

const VacationRequestsContext = createContext<VacationRequestsContextValue | undefined>(
  undefined
);

export const VacationRequestsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [requests, setRequests] = useState<VacationRequest[]>(mockVacationRequests);

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
    () => ({ requests, approveRequest, rejectRequest }),
    [requests]
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
