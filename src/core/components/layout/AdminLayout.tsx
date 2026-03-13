import React from "react";
import { AdminNavbar } from "./AdminNavbar";
import { MainContainer } from "../layout/MainContainer";
import { Footer } from "./Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <MainContainer className="flex-1">
        {children}
      </MainContainer>
      <Footer />
    </div>
  );
};
