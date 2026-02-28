import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import VacationStatusTable from "../components/VacationStatusTable"; 
import { mockVacationRequests } from "../../../core/mocks/data";
import type { VacationRequest } from "../../../core/mocks/data";
const AdminVacationPage: React.FC = () => {
  const handleView = (vacation: VacationRequest) => {
    console.log("Viewing vacation:", vacation);
  };
  return (
    <MainContainer>
      <PageHeader
        title="Admin Vacations"
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "Vacations" },
          { label: "Admin" },
        ]}
      />
      <div className="container mx-auto px-5 py-8">
        <VacationStatusTable
          vacations={mockVacationRequests}
          onView={handleView}
        />
      </div>
    </MainContainer>
  );
};
export default AdminVacationPage;
