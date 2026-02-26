import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";

const StaffDirectoryPage: React.FC = () => {
  return (
    <MainContainer>
      <PageHeader
        title="Staff Directory"
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "Human Resources" },
          { label: "Staff Directory" },
        ]}
      />
      <div className="container mx-auto px-5 py-8">
        <p className="text-sm text-muted-foreground">
          Staff Directory admin module (placeholder).
        </p>
      </div>
    </MainContainer>
  );
};

export default StaffDirectoryPage;
