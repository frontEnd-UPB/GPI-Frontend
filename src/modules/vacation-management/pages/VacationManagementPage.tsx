import React, { useState } from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import { VacationRequestsProvider } from "../context/VacationRequestsContext";
import VacationRequestsTable from "../components/VacationRequestsTable";

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
        <div className="container mx-auto px-5 py-8 space-y-8">
          <VacationRequestsTable
            sortKey={sortConfig.key}
            sortDirection={sortConfig.direction}
            onSortChange={handleToggleSort}
          />
        </div>
      </VacationRequestsProvider>
    </MainContainer>
  );
};

export default VacationManagementPage;
