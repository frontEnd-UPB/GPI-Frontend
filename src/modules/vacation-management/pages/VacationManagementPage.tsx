import React, { useState } from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import Calendario from "../components/Calendario";
import { VacationRequestsProvider, useVacationRequests } from "../context/VacationRequestsContext";
import VacationRequestsTable from "../components/VacationRequestsTable";
import VacationFilters from "../components/VacationFilters";
import Title from "../components/Title";
import { specialties as specialtyConstants } from "../constants/specialties";

const VacationManagementPage: React.FC = () => {
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
      <VacationRequestsProvider>
        <InnerContent
          sortConfig={sortConfig}
          onToggleSort={handleToggleSort}
        />
      </VacationRequestsProvider>
    </MainContainer>
  );
};

const InnerContent: React.FC<{
  sortConfig: { key: "startDate" | "employeeName"; direction: "asc" | "desc" };
  onToggleSort: (k: "startDate" | "employeeName") => void;
}> = ({ sortConfig, onToggleSort }) => {
  const { search, setSearch, specialtyFilter, setSpecialtyFilter, calendarEvents } = useVacationRequests();

  return (
    <div className="container mx-auto px-5 py-8 space-y-8">
      <Title />

      <VacationFilters
        search={search}
        specialty={specialtyFilter}
        specialties={specialtyConstants.map((s) => s.name)}
        onSearchChange={setSearch}
        onSpecialtyChange={setSpecialtyFilter}
      />

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
