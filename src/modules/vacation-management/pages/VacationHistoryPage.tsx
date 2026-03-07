import React, { useMemo, useState } from "react";
import { MainContainer, PageHeader, GoBackButton } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useVacationRequests } from "../context/VacationRequestsContext";
import VacationFilters from "../components/VacationFilters";
import Title from "../components/Title";
import VacationsHistoryTable from "../components/VacationsHistoryTable";
import { mockEmployees } from "../../../core/mocks/data";

const VacationHistoryPage: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: "startDate" | "employeeName";
    direction: "asc" | "desc";
  }>(
    {
      key: "startDate",
      direction: "asc",
    }
  );

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
        title="Requests History"
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "Human Resources" },
          { label: "Vacation Manager" },
          { label: "Requests History" },
        ]}
      />
      <InnerContent
        sortConfig={sortConfig}
        onToggleSort={handleToggleSort}
      />
    </MainContainer>
  );
};

const InnerContent: React.FC<{
  sortConfig: { key: "startDate" | "employeeName"; direction: "asc" | "desc" };
  onToggleSort: (k: "startDate" | "employeeName") => void;
}> = ({ sortConfig, onToggleSort }) => {
  const { search, setSearch, specialtyFilter, setSpecialtyFilter } = useVacationRequests();

  const departments = useMemo(
    () =>
      Array.from(new Set(mockEmployees.map((e) => e.department))).sort(),
    [],
  );

  return (
    <div className="container mx-auto px-5 py-8 space-y-8">
      <div className="w-full max-w-[1100px] mx-auto">
        <GoBackButton />
      </div>

      <Title title="Requests History" />

      <VacationFilters
        search={search}
        specialty={specialtyFilter}
        specialties={departments}
        onSearchChange={setSearch}
        onSpecialtyChange={setSpecialtyFilter}
      />

      <VacationsHistoryTable
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSortChange={onToggleSort}
      />
    </div>
  );
};

export default VacationHistoryPage;
