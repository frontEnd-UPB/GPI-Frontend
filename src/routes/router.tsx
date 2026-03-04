import React from "react";
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter, Navigate, useRoutes } from "react-router-dom";
import { MainLayout } from "../core/components";
import NotFoundPage from "../core/pages/NotFoundPage";
import UnauthorizedPage from "../core/pages/UnauthorizedPage";
import ComponentsDemoPage from "../core/pages/ComponentsDemoPage";
import StaffDirectoryPage from "../modules/staff-directory/pages/StaffDirectoryPage";
import { EmptyState } from "../core/components";
import VacationManagementPage from "../modules/vacation-management/pages/VacationManagementPage";
import AdminVacationPage from "../modules/vacation-admin/pages/AdminVacationPage";
import DoctorVacationPage from "../modules/vacation-doctor/pages/DoctorVacationPage";
import HomePage from "../modules/home/pages/HomePage";
import AdminLoginPage from "../modules/authentication/pages/AdminLoginPage";
import SignUpPage from "../modules/authentication/pages/SignUpPage";
import PacientLoginPge from "../modules/authentication/pages/PacientLoginPage";
import ResetPasswordPage from "../modules/authentication/pages/ResetPasswordPage";
import OtpVerification from "../modules/authentication/pages/OtpVerification";
import ForgotPasswordPage from "../modules/authentication/pages/ForgotPasswordPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTE_PATHS } from "./routes";


const RoutesConfig: React.FC = () => {
  const element = useRoutes([
    {
      path: ROUTE_PATHS.LOGIN,
      element: <AdminLoginPage />,
    },
    {
      path: "/admin-login",
      element: <Navigate to={ROUTE_PATHS.LOGIN} replace />,
    },
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "/patient-login",
      element: <PacientLoginPge />,
    },
    {
      path: "/otp-verification",
      element: <OtpVerification />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: ROUTE_PATHS.UNAUTHORIZED,
          element: <UnauthorizedPage />,
        },
        {
          element: <MainLayout />,
          children: [
            { index: true, element: <HomePage /> },

            // NavBar compatibility / legacy shortcuts
            {
              path: "hr",
              element: <Navigate to={ROUTE_PATHS.ADMIN_STAFF_DIRECTORY} replace />,
            },

            // Admin
            { path: "demo", element: <ComponentsDemoPage /> },
            { path: "admin/staff-directory", element: <StaffDirectoryPage /> },
            { path: "admin/vacation-manager", element: <VacationManagementPage /> },
            { path: "vacations/admin", element: <AdminVacationPage /> },

            // Doctor
            { path: "vacations/doctor", element: <DoctorVacationPage /> },

            // Common links in NavBars (placeholders until modules exist)
            {
              path: "agenda",
              element: <EmptyState title="Agenda" description="Module not implemented yet." />,
            },
            {
              path: "pathology-results",
              element: <EmptyState title="Pathology Results" description="Module not implemented yet." />,
            },
            {
              path: "patients",
              element: <EmptyState title="Patients" description="Module not implemented yet." />,
            },
            {
              path: "appointments",
              element: <EmptyState title="Appointments" description="Module not implemented yet." />,
            },
            {
              path: "billing",
              element: <EmptyState title="Billing" description="Module not implemented yet." />,
            },
            {
              path: "inventory",
              element: <EmptyState title="Inventory" description="Module not implemented yet." />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return element;
};

export const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesConfig />
      </BrowserRouter>
    </AuthProvider>
  );
};
