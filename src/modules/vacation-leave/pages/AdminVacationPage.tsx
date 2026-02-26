import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";

const AdminVacationPage: React.FC = () => {
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
        <p className="text-sm text-muted-foreground">
          Base page for admin vacation management. Add your module UI here.
        </p>
      </div>
    </MainContainer>
  );
};

export default AdminVacationPage;
