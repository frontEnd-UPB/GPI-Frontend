import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import Calendario from '../components/Calendario';

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
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 min-h-screen">
      <Calendario />
      </div>
    </MainContainer>
  );
};

export default VacationManagementPage;
