import React from "react";
import { DoctorNavbar } from "./DoctorNavbar";
import { MainContainer } from "../layout/MainContainer";
import { Footer } from "./Footer";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DoctorNavbar />
      <MainContainer className="flex-1">
        {children}
      </MainContainer>
      <Footer />
    </div>
  );
};
