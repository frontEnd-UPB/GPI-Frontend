import React, { useMemo, useState } from "react";
import { MainContainer, PageHeader } from "../../../../core/components";
import { ROUTE_PATHS } from "../../../../routes/routes";
import Calendario from "../components/Calendario";
import { useVacationRequests } from "../context/VacationRequestsContext";
import VacationRequestsTable from "../components/VacationRequestsTable";
import VacationFilters from "../components/VacationFilters";
import Title from "../components/Title";
import { mockEmployees } from "../../../../core/mocks/data";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../../../core/components/feedback/ErrorMessage";

const VacationManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState<{
    key: "startDate" | "employeeName";
    direction: "asc" | "desc";
  }>({
    key: "startDate",
    direction: "asc",
  });

  const handleToggleSort = (key: "startDate" | "employeeName") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });
  };

  return (
    <MainContainer>
      <PageHeader
        title="Vacation Management"
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "Human Resources" },
          { label: "Vacation Manager" },
        ]}
      />
      <InnerContent
        sortConfig={sortConfig}
        onToggleSort={handleToggleSort}
        onViewHistoryClick={() => navigate(ROUTE_PATHS.ADMIN_VACATION_HISTORY)}
      />
    </MainContainer>
  );
};

const InnerContent: React.FC<{
  sortConfig: { key: "startDate" | "employeeName"; direction: "asc" | "desc" };
  onToggleSort: (k: "startDate" | "employeeName") => void;
  onViewHistoryClick: () => void;
}> = ({ sortConfig, onToggleSort, onViewHistoryClick }) => {
  const {
    search,
    setSearch,
    specialtyFilter,
    setSpecialtyFilter,
    calendarEvents,
    error,
  } = useVacationRequests();

  const departments = useMemo(
    () =>
      Array.from(new Set(mockEmployees.map((e) => e.department))).sort(),
    [],
  );

  return (
    <div className="container mx-auto px-5 py-8 space-y-8">
      <Title onViewHistoryClick={onViewHistoryClick} />

      <VacationFilters
        search={search}
        specialty={specialtyFilter}
        specialties={departments}
        onSearchChange={setSearch}
        onSpecialtyChange={setSpecialtyFilter}
      />

      {error && (
        <ErrorMessage
          message={`Error loading vacation management data: ${error}`}
        />
      )}

      <div className="flex flex-col items-center justify-center">
        <Calendario events={calendarEvents} />
      </div>

      <VacationRequestsTable
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSortChange={onToggleSort}
      />
    </div>
  );
};

export default VacationManagementPage;
