import React, { useMemo } from "react";
import { useVacationRequests } from "../context/VacationRequestsContext";
import { VACATION_STATUS } from "../../../core/constants";
import { mockEmployees } from "../../../core/mocks/data";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../../../core/components";
// Title and VacationFilters are rendered by the page to avoid duplication

interface VacationRequestsTableProps {
  sortKey: "startDate" | "employeeName";
  sortDirection: "asc" | "desc";
  onSortChange: (key: "startDate" | "employeeName") => void;
}

const VacationRequestsTable: React.FC<VacationRequestsTableProps> = ({
  sortKey,
  sortDirection,
  onSortChange,
}) => {
  const { requests, search, specialtyFilter } = useVacationRequests();
  const navigate = useNavigate();

  const { specialtyByEmployeeId, nameByEmployeeId, specialties } = useMemo(() => {
    const specialtyMap: Record<string, string> = {};
    const nameMap: Record<string, string> = {};

    mockEmployees.forEach((employee) => {
      if (!nameMap[employee.id]) {
        nameMap[employee.id] = `${employee.firstname} ${employee.lastname}`;
      }

      if (employee.department && !specialtyMap[employee.id]) {
        specialtyMap[employee.id] = employee.department;
      }
    });

    const uniqueSpecialties = Array.from(new Set(Object.values(specialtyMap))).sort();

    return {
      specialtyByEmployeeId: specialtyMap,
      nameByEmployeeId: nameMap,
      specialties: uniqueSpecialties,
    };
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = requests.filter(
      (request) => request.status === VACATION_STATUS.PENDING
    );

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((r) => {
        const name = nameByEmployeeId[r.employeeId]?.toLowerCase() ?? "";
        return name.includes(term);
      });
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
        const nameA = nameByEmployeeId[a.employeeId] ?? "";
        const nameB = nameByEmployeeId[b.employeeId] ?? "";
        const compare = nameA.localeCompare(nameB);
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

  return (
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
            {filteredAndSorted.length === 0 ? (
              <EmptyState
                title="No pending vacation requests"
                description="There are currently no vacation requests awaiting your review."
              />
            ) : (
            filteredAndSorted.map((request, index) => {
              const isEven = index % 2 === 0;
              const isLast = index === filteredAndSorted.length - 1;

              const handleRowClick = () => {
                navigate(`/vacation-manager/${request.id}`);
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
                        {nameByEmployeeId[request.employeeId] ?? "Unknown employee"}
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
                      <div className="flex h-[25px] min-w-[120px] items-center justify-center rounded-full bg-status-pending-foreground">
                        <span className="text-sm font-medium text-status-pending">
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isLast && <div className="h-px bg-border" />}
                </div>
              );
            }))}
          </div>

        </div>
      </div>
  );
};

export default VacationRequestsTable;