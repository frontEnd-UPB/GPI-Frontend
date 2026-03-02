import React, { useState } from "react";
import { MainContainer, PageHeader } from "../../../core/components";
import { ROUTE_PATHS } from "../../../routes/routes";

import VacationStatusTable from "../components/VacationStatusTable";
import VacationRequestModal from "../components/VacationRequestModal";

import { mockVacationRequests } from "../../../core/mocks/data";
import type { VacationRequest } from "../../../core/mocks/data";

const AdminVacationPage: React.FC = () => {
  const [selectedVacation, setSelectedVacation] =
    useState<VacationRequest | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const handleView = (vacation: VacationRequest) => {
    setSelectedVacation(vacation);
    setOpenModal(true);
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

      <div className="container mx-auto px-5 py-8">
        <VacationStatusTable
          vacations={mockVacationRequests}
          onView={handleView}
        />
      </div>

      <VacationRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        vacation={selectedVacation}
      />
    </MainContainer>
  );
};

export default AdminVacationPage;
