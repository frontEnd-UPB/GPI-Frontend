import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useVacationRequests } from "../context/VacationRequestsContext";
import { VacationRequestDetails } from "../components/VacationRequestDetails";
import Decision from "../components/Decision";

const VacationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests } = useVacationRequests();

  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <MainContainer>
        <PageHeader
          title="Vacation Request"
          breadcrumbs={[
            { label: "Home", href: ROUTE_PATHS.HOME },
            { label: "Human Resources" },
            { label: "Vacation Manager", href: ROUTE_PATHS.ADMIN_VACATION_MANAGER },
          ]}
        />
        <div className="container mx-auto px-5 py-8">
          <p className="text-sm text-muted-foreground">Vacation request not found.</p>
          <button
            type="button"
            className="mt-4 text-sm font-medium text-primary hover:underline"
            onClick={() => navigate(ROUTE_PATHS.ADMIN_VACATION_MANAGER)}
          >
            Back to Vacation Manager
          </button>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <PageHeader
        title="Vacation Request"
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "Human Resources" },
          { label: "Vacation Manager", href: ROUTE_PATHS.ADMIN_VACATION_MANAGER },
          { label: request.employeeName },
        ]}
      />

      <div className="container mx-auto px-5 py-8 space-y-10">
        <VacationRequestDetails request={request} />
        <Decision requestId={request.id} />
      </div>
    </MainContainer>
  );
};

export default VacationDetailPage;
