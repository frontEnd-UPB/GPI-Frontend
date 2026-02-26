import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";

const DoctorVacationPage: React.FC = () => {
  return (
    <MainContainer>
      <PageHeader
        title="Doctor Vacations"
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "Vacations" },
          { label: "Doctor" },
        ]}
      />
      <div className="container mx-auto px-5 py-8">
        <p className="text-sm text-muted-foreground">
          Base page for doctor vacation requests. Add your module UI here.
        </p>
      </div>
    </MainContainer>
  );
};

export default DoctorVacationPage;
