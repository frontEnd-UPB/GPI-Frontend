import React, { useMemo, useState } from "react";
import { MainContainer, PageHeader } from "../../../../core/components";
import { ROUTE_PATHS } from "../../../../routes/routes";
import { useVacationBalance } from "../hooks/useVacationBalance";
import { useSubmitVacationRequest } from "../hooks/useSubmitVacationRequest";
import { useEmployeeVacationRequests } from "../hooks/useEmployeeVacationRequests";
import VacationBalanceCard from "../components/VacationBalanceCard";
import VacationRequestButton from "../components/VacationRequestButton";
import VacationStatusTable from "../components/VacationStatusTable";
import VacationRequestModal from "../components/VacationRequestModal";
import type { VacationRequest } from "../../../../core/mocks/data";
import type { VacationSubmitData } from "../hooks/vacationRequestForm.types";
import { useAuth } from "../../../../context/AuthContext";
import { ErrorMessage } from "../../../../core/components/feedback/ErrorMessage";
import { Loader } from "../../../../core/components/feedback/Loader";
import { EmptyState } from "../../../../core/components/feedback/EmptyState";
import { Button } from "../../../../ui/button";
import { USER_ROLES } from "../../../../core/constants";

export const EmployeeVacationPage: React.FC = () => {
  const { user } = useAuth();
  const employeeId = user?.id ?? "";

  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useVacationBalance(employeeId);

  const {
    requests,
    loading: requestsLoading,
    actionLoading,
    error: requestsError,
    cancel,
    update,
    addLocally,
  } = useEmployeeVacationRequests(employeeId);

  const {
    submit,
    loading: submitLoading,
    error: submitError,
  } = useSubmitVacationRequest(employeeId, (newRequest) => {
    addLocally(newRequest);
    refetchBalance();
  });

  const [selectedVacation, setSelectedVacation] =
    useState<VacationRequest | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [requestFormOpen, setRequestFormOpen] = useState(false);

  const handleView = (vacation: VacationRequest) => {
    setSelectedVacation(vacation);
    setOpenModal(true);
  };

  const handleCreateRequest = async (data: VacationSubmitData) => {
    const createdRequest = await submit({
      startDate: data.startDate!,
      endDate: data.endDate!,
      reason: data.type,
      comment: data.comment,
      attachment: data.attachment,
    });

    return createdRequest !== null;
  };

  const handleCancelRequest = async (id: string) => {
    const updated = await cancel(id);
    if (updated && selectedVacation?.id === updated.id) {
      setSelectedVacation(updated);
    }

    if (updated) {
      refetchBalance();
    }

    return updated !== null;
  };

  const handleUpdateRequest = async (
    id: string,
    updatedStartDate: Date,
    updatedEndDate: Date,
    updatedReason: string,
    updatedComment: string,
    updatedAttachment?: File | null,
    removeAttachment?: boolean
  ) => {
    const updated = await update(id, {
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      reason: updatedReason,
      comment: updatedComment,
      attachment: updatedAttachment,
      removeAttachment,
    });

    if (updated && selectedVacation?.id === updated.id) {
      setSelectedVacation(updated);
    }

    if (updated) {
      refetchBalance();
    }

    return updated !== null;
  };

  const isLoading =
    balanceLoading || requestsLoading || submitLoading || actionLoading;

  const hasNoRequests = !requestsLoading && requests.length === 0;

  const pageTitle = useMemo(() => {
    if (user?.role === USER_ROLES.ADMIN) {
      return "Request Vacations";
    }

    if (user?.role === USER_ROLES.DOCTOR) {
      return "Request Vacations";
    }

    return "Vacations";
  }, [user?.role]);

  return (
    <MainContainer>
      <PageHeader
        title={pageTitle}
        breadcrumbs={[
          { label: "Home", href: ROUTE_PATHS.HOME },
          { label: "My Profile" },
          { label: "Request Vacations" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
        {isLoading && <Loader text="Loading vacation information..." />}

        {balanceError && (
          <ErrorMessage
            message={`Error loading vacation balance: ${balanceError}`}
          />
        )}

        {requestsError && (
          <ErrorMessage
            message={`Error loading vacation requests: ${requestsError}`}
          />
        )}

        {submitError && (
          <ErrorMessage
            message={`Error submitting request: ${submitError}`}
          />
        )}

        <VacationBalanceCard balance={balance ?? undefined} />

        <VacationRequestButton
          onSubmit={handleCreateRequest}
          availableDays={balance?.available}
          open={requestFormOpen}
          onOpenChange={setRequestFormOpen}
          isSubmitting={submitLoading}
        />

        {hasNoRequests ? (
          <EmptyState
            title="No vacation requests yet"
            description="You haven't requested any vacation days. Use the button above to create your first request."
            action={
              <Button
                variant="secondary"
                onClick={() => setRequestFormOpen(true)}
              >
                Request vacation leave
              </Button>
            }
          />
        ) : (
          <VacationStatusTable vacations={requests} onView={handleView} />
        )}

        <VacationRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          vacation={selectedVacation}
          availableDays={balance?.available}
          isProcessing={actionLoading}
          onCancelRequest={handleCancelRequest}
          onUpdateRequest={handleUpdateRequest}
        />
      </div>
    </MainContainer>
  );
};

export default EmployeeVacationPage;
