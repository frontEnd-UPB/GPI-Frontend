import React from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";
//core
import { ErrorMessage } from "../../../core/components/feedback/ErrorMessage";
//vacation balance
import { useVacationBalance } from "../hooks/useVacationBalance";
import VacationBalanceCard from "../components/VacationBalanceCard";
import VacationRequestForm from "../components/VacationRequestForm";

const DoctorVacationPage: React.FC = () => {
  const doctorId = "1";
  const { balance, loading, error, refetch } = useVacationBalance(doctorId);
  if (error) {
    return (
      <div>
        <ErrorMessage message={`Error loading vacation balance: ${error}`} />
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

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
        <div>
            <VacationBalanceCard balance={balance} />
        </div>
      </div>
      <div className="container mx-auto px-5 py-8">
        <div>
            <VacationRequestForm visible={true} onSubmit={() => {}} onCancel={() => {}} />
        </div>
      </div>
    </MainContainer>
  );
};

export default DoctorVacationPage;
