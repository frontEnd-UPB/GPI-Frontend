import React, { useMemo, useState } from "react";
import { useVacationRequests } from "../context/VacationRequestsContext";
import { VACATION_STATUS } from "../../../core/constants";
import { mockEmployees, type VacationRequest } from "../../../core/mocks/data";
import { Modal } from "../../../ui/core/Modal";
import { Button } from "../../../ui/core/Button";
import { VacationRequestDetails } from "./VacationRequestDetails";

interface VacationsHistoryTableProps {
  sortKey: "startDate" | "employeeName";
  sortDirection: "asc" | "desc";
  onSortChange: (key: "startDate" | "employeeName") => void;
}

const statusStyles: Record<string, { container: string; text: string; label: string }> = {
  [VACATION_STATUS.PENDING]: {
    container: "bg-status-pending-foreground",
    text: "text-status-pending",
    label: "Pending",
  },
  [VACATION_STATUS.APPROVED]: {
    container: "bg-status-approved-foreground",
    text: "text-status-approved",
    label: "Approved",
  },
  [VACATION_STATUS.REJECTED]: {
    container: "bg-status-rejected-foreground",
    text: "text-status-rejected",
    label: "Denied",
  },
  [VACATION_STATUS.CANCELLED]: {
    container: "bg-status-canceled-foreground",
    text: "text-status-canceled",
    label: "Canceled",
  },
};

const VacationsHistoryTable: React.FC<VacationsHistoryTableProps> = ({
  sortKey,
  sortDirection,
  onSortChange,
}) => {
  const { requests, search, specialtyFilter } = useVacationRequests();
  const [selected, setSelected] = useState<VacationRequest | null>(null);

  const { specialtyByEmployeeId, specialties } = useMemo(() => {
    const map: Record<string, string> = {};

    mockEmployees.forEach((employee) => {
      if (employee.department && !map[employee.id]) {
        map[employee.id] = employee.department;
      }
    });

    const uniqueSpecialties = Array.from(new Set(Object.values(map))).sort();

    return { specialtyByEmployeeId: map, specialties: uniqueSpecialties };
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = requests.filter(
      (request) => request.status !== VACATION_STATUS.PENDING
    );

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((r) =>
        r.employeeName.toLowerCase().includes(term)
      );
    }

    if (specialtyFilter) {
      result = result.filter(
        (r) => specialtyByEmployeeId[r.employeeId] === specialtyFilter
      );
    }

    const sorted = [...result].sort((a, b) => {
      if (sortKey === "startDate") {
        if (a.startDate === b.startDate) return 0;

        if (sortDirection === "asc") {
          return a.startDate < b.startDate ? -1 : 1;
        }

        return a.startDate > b.startDate ? -1 : 1;
      }

      if (sortKey === "employeeName") {
        const compare = a.employeeName.localeCompare(b.employeeName);
        return sortDirection === "asc" ? compare : -compare;
      }

      return 0;
    });

    return sorted;
  }, [
    requests,
    search,
    specialtyFilter,
    sortDirection,
    sortKey,
    specialtyByEmployeeId,
  ]);

  const getStatusStyles = (status: string) => {
    return statusStyles[status] ?? statusStyles[VACATION_STATUS.PENDING];
  };

  const handleCloseModal = () => setSelected(null);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] w-full">
          {/* HEADER */}
          <div className="flex h-[50px] items-center rounded-t-[20px] bg-primary px-10 text-base font-semibold text-primary-foreground shadow-[0_0_20px_rgba(15,23,42,0.16)]">
            <div
              onClick={() => onSortChange("employeeName")}
              className="flex flex-[1] cursor-pointer items-center justify-start gap-1 pl-10"
            >
              Doctor
              {sortKey === "employeeName" && (
                <span className="text-xs">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </div>

            <div className="flex flex-[1.5] items-center justify-center">
              Speciality
            </div>

            <div
              onClick={() => onSortChange("startDate")}
              className="flex flex-[1] cursor-pointer items-center justify-center gap-1"
            >
              From
              {sortKey === "startDate" && (
                <span className="text-xs">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </div>

            <div className="flex flex-[1] items-center justify-center">
              To
            </div>

            <div className="flex flex-[1] items-center justify-center">
              Status
            </div>
          </div>

          {/* BODY */}
          <div className="rounded-b-[20px] bg-card shadow-[0_0_50px_rgba(15,23,42,0.04)]">
            {filteredAndSorted.map((request, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === filteredAndSorted.length - 1;
              const styles = getStatusStyles(request.status);

              const handleRowClick = () => {
                setSelected(request);
              };

              return (
                <div key={request.id}>
                  <div
                    onClick={handleRowClick}
                    className={`flex h-[65px] cursor-pointer items-center px-10 text-base transition-opacity hover:opacity-80 ${
                      isEven ? "bg-muted/40" : "bg-card"
                    } ${isLast ? "rounded-b-[20px]" : ""}`}
                  >
                    <div className="flex flex-[1] items-center justify-start pl-10 font-medium text-primary">
                      {request.employeeName}
                    </div>

                    <div className="flex flex-[1.5] items-center justify-center text-primary">
                      {specialtyByEmployeeId[request.employeeId] ?? "-"}
                    </div>

                    <div className="flex flex-[1] items-center justify-center text-primary">
                      {request.startDate}
                    </div>

                    <div className="flex flex-[1] items-center justify-center text-primary">
                      {request.endDate}
                    </div>

                    <div className="flex flex-[1] items-center justify-center">
                      <div className={`flex h-[25px] min-w-[120px] items-center justify-center rounded-full ${styles.container}`}>
                        <span className={`text-sm font-medium ${styles.text}`}>
                          {styles.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isLast && <div className="h-px bg-border" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={handleCloseModal}
        title="Vacation Request"
        size="xl"
        headerVariant="primary"
        footer={
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        }
      >
        {selected && <VacationRequestDetails request={selected} />}
      </Modal>
    </>
  );
};

export default VacationsHistoryTable;
