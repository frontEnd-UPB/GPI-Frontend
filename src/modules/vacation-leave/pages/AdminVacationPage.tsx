import React, { useState,useEffect } from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
import { useVacationBalance } from "../hooks/useVacationBalance";
import { useSubmitVacationRequest } from "../hooks/useSubmitVacationRequest";
import VacationStatusTable from "../components/VacationStatusTable";
import VacationRequestModal from "../components/VacationRequestModal";
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
import { mockVacationRequests } from "../../../core/mocks/data";
import type { VacationRequest } from "../../../core/mocks/data";
import { useAuth } from "../../../context/AuthContext";
import VacationBalanceCard from "../components/VacationBalanceCard";
import VacationRequestButton from "../components/VacationRequestButton";
import { VacationReason } from "../../../core/mocks/data";



const AdminVacationPage: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.id ?? "";
  const { balance, error, refetch } = useVacationBalance(doctorId);
  const { submit, error: submitError } = useSubmitVacationRequest(doctorId, (newRequest) => {
    setVacations((prev) => [...prev, newRequest]);
    refetch();
  });

  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  
  useEffect(() => {
      if (doctorId) {
        setVacations(mockVacationRequests.filter((v) => v.employeeId === doctorId));
      }
    }, [doctorId]);
  const [selectedVacation, setSelectedVacation] =
    useState<VacationRequest | null>(null);
  const [openModal, setOpenModal] = useState(false);

  if (error) {
    return (
      <div>
        <ErrorMessage message={`Error loading vacation balance: ${error}`} />
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  const handleView = (vacation: VacationRequest) => {
      setSelectedVacation(vacation);
      setOpenModal(true);
    };
  const handleCancelRequest = (id: string) => {
    setVacations(prev =>
      prev.map(v =>
        v.id === id ? { ...v, status: "canceled" } : v
      )
    );

    setSelectedVacation(prev =>
      prev && prev.id === id ? { ...prev, status: "canceled" } : prev
    );
  };

  const handleResendRequest = (
    id: string,
    updatedReason: VacationReason,
    updatedComment: string
  ) => {
    setVacations((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              reason: updatedReason,
              comment: updatedComment,
              status: "pending", // sigue siendo pending
            }
          : v
      )
    );

    setSelectedVacation((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            reason: updatedReason,
            comment: updatedComment,
            status: "pending",
          }
        : prev
    );
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
  <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
        <VacationBalanceCard balance={balance ?? undefined} />
        {submitError && (
          <ErrorMessage message={`Error submitting request: ${submitError}`} />
        )}
        <VacationRequestButton
          onSubmit={(data) => submit({ ...data, startDate: data.startDate!, endDate: data.endDate! })}
          availableDays={balance?.available}
        />
        
        <VacationStatusTable
          vacations={vacations}
          onView={handleView}
        />

        <VacationRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          vacation={selectedVacation}
          onCancelRequest={handleCancelRequest}
          onResendRequest={handleResendRequest}
          
        />
      </div>
    </MainContainer>
  );
};

export default AdminVacationPage;
