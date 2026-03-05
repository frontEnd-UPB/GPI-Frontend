import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useVacationRequests } from "../context/VacationRequestsContext";
import { VacationRequestDetails } from "../components/VacationRequestDetails";
import Decision from "../components/Decision";
import { VacationInfoCard } from "../components/VacationInfoCard";
import { AppointmentsCalendar } from "../components/AppointmentsCalendar";
import GoBack from "../../../ui/core/GoBack";
import { mockEmployees } from "../../../core/mocks/data";

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

  const employee = mockEmployees.find((e) => e.id === request?.employeeId);
  const displayName = employee
    ? employee.function === "Doctor"
      ? `Dr. ${request.employeeName}`
      : `${request.employeeName} (${employee.function})`
    : request.employeeName;

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

      <div className="container mx-auto px-5">
        <div className="w-full max-w-[1100px] mx-auto mt-6 mb-4">
          <div className="mb-4">
            <GoBack />
          </div>
          <h2 className="text-2xl font-bold text-secondary">
            Vacation Management - {displayName}
          </h2>
        </div>

        <VacationInfoCard
          request={request}
          doctorName={request.employeeName}
          employeeFunction={employee?.function}
          department={employee?.department}
          doctorRole={employee?.function}
          avatarUrl={employee?.profilePicture ?? undefined}
          status={request.status}
        />

        <div className="w-full max-w-[1100px] mx-auto space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-secondary">
            {displayName}'s Agenda
          </h2>
        </div>

        <div className="w-full max-w-[1100px] mx-auto mt-4">
          <AppointmentsCalendar doctorId={employee?.id} />
        </div>
      </div>

      <div className="container mx-auto px-20 py-8 space-y-10">
        <Decision requestId={request.id} />
      </div>
    </MainContainer>
  );
};

export default VacationDetailPage;
