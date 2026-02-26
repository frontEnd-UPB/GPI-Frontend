import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";

const VacationManagementPage: React.FC = () => {
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
      <div className="container mx-auto px-5 py-8">
        <p className="text-sm text-muted-foreground">
          Admin-only vacation management module (placeholder).
        </p>
      </div>
    </MainContainer>
  );
};

export default VacationManagementPage;
