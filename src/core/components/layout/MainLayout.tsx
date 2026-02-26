import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import type { UserRole } from "../../constants/roles";
import { AdminLayout } from "./AdminLayout";
import { DoctorLayout } from "./DoctorLayout";
import { PublicLayout } from "./PublicLayout";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const content = children ?? <Outlet />;

  if (!user) {
    return <PublicLayout>{content}</PublicLayout>;
  }

  const ROLE_LAYOUT_MAP: Partial<Record<UserRole, React.ComponentType<{ children: React.ReactNode }>>> = {
    admin: AdminLayout,
    doctor: DoctorLayout,
  };

  const Layout = ROLE_LAYOUT_MAP[user.role] ?? PublicLayout;

  return <Layout>{content}</Layout>;
};
