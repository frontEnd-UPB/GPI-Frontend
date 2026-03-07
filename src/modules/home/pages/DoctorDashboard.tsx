import React from "react";
import HomePage from "./HomePage";
import { DoctorLayout } from "../../../core/components/layout/DoctorLayout";

const DoctorDashboard: React.FC = () => {
  return (
    <DoctorLayout>
      <HomePage />
    </DoctorLayout>
  );
};

export default DoctorDashboard;
