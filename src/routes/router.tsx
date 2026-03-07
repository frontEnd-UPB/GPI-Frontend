import React, { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Outlet, useRoutes } from "react-router-dom";
import React from "react";
import { BrowserRouter, Navigate, useRoutes } from "react-router-dom";
import { MainLayout } from "../core/components";
import NotFoundPage from "../core/pages/NotFoundPage";
import UnauthorizedPage from "../core/pages/UnauthorizedPage";
import ComponentsDemoPage from "../core/pages/ComponentsDemoPage";
import StaffDirectoryPage from "../modules/staff-directory/pages/StaffDirectoryPage";
import { EmptyState } from "../core/components";
import VacationManagementPage from "../modules/vacation-management/pages/VacationManagementPage";
import VacationHistoryPage from "../modules/vacation-management/pages/VacationHistoryPage";
import VacationDetailPage from "../modules/vacation-management/pages/VacationDetailPage";
import AdminVacationPage from "../modules/vacation-admin/pages/AdminVacationPage";
import DoctorVacationPage from "../modules/vacation-doctor/pages/DoctorVacationPage";
import HomePage from "../modules/home/pages/HomePage";
import AdminLoginPage from "../modules/authentication/pages/AdminLoginPage";
import SignUpPage from "../modules/authentication/pages/SignUpPage";
import PacientLoginPge from "../modules/authentication/pages/PacientLoginPage";
import ResetPasswordPage from "../modules/authentication/pages/ResetPasswordPage";
import OtpVerification from "../modules/authentication/pages/OtpVerification";
import ForgotPasswordPage from "../modules/authentication/pages/ForgotPasswordPage";
import { AdminDashboard, DoctorDashboard } from "../modules/home/pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTE_PATHS } from "./routes";
import { VacationRequestsProvider } from "../modules/vacation-management/context/VacationRequestsContext";

const VacationManagementSection: React.FC = () => (
  <VacationRequestsProvider>
    <Outlet />
  </VacationRequestsProvider>
);


const RoutesConfig: React.FC = () => {
  const element = useRoutes([
    {
      path: ROUTE_PATHS.LOGIN,
      element: <AdminLoginPage />,
    },
    {
      path: ROUTE_PATHS.SIGN_UP,
      element: <SignUpPage />,
    },
    {
      path: ROUTE_PATHS.RESET_PASSWORD,
      element: <ResetPasswordPage />,
    },
    {
      path: ROUTE_PATHS.PATIENT_LOGIN,
      element: <PacientLoginPge />,
    },
    {
      path: ROUTE_PATHS.OTP_VERIFICATION,
      element: <OtpVerification />,
    },
    {
      path: ROUTE_PATHS.FORGOT_PASSWORD,
      element: <ForgotPasswordPage />,
    },
    {
      path: "/HomePage",
      element: <HomePage />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: ROUTE_PATHS.UNAUTHORIZED,
          element: <UnauthorizedPage />,
        },
        {
          path: "admin-dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "doctor-dashboard",
          element: <DoctorDashboard />,
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
            {
              element: <VacationManagementSection />,
              children: [
                { path: "admin/vacation-manager", element: <VacationManagementPage /> },
                { path: "vacation-manager/:id", element: <VacationDetailPage /> },
                { path: "admin/vacation-history", element: <VacationHistoryPage /> },
              ],
            },
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
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  );
};
