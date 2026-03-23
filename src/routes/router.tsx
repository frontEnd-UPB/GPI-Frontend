import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  useRoutes,
  type RouteObject,
} from "react-router-dom";

import { USER_ROLES } from "../core/constants/roles"; 

import { EmptyState, MainLayout } from "../core/components";
import NotFoundPage from "../core/pages/NotFoundPage";
import { UnauthorizedPage } from "../core/pages/UnauthorizedPage";
import ComponentsDemoPage from "../core/pages/ComponentsDemoPage";
import StaffDirectoryPage from "../modules/staff-directory/pages/StaffDirectoryPage";
import VacationManagementPage from "../modules/vacation/vacation-management/pages/VacationManagementPage";
import VacationHistoryPage from "../modules/vacation/vacation-management/pages/VacationHistoryPage";
import VacationDetailPage from "../modules/vacation/vacation-management/pages/VacationDetailPage";
import EmployeeVacationPage from "../modules/vacation/vacation-leave/pages/EmployeeVacationPage";
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
import { VacationRequestsProvider } from "../modules/vacation/vacation-management/context/VacationRequestsContext";

const VacationManagementSection: React.FC = () => (
  <VacationRequestsProvider>
    <Outlet />
  </VacationRequestsProvider>
);

const comingSoon = (title: string, description = "Module not implemented yet.") => (
  <EmptyState title={title} description={description} />
);

const vacationManagementRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.ADMIN_VACATION_MANAGER,
    element: <VacationManagementPage />,
  },
  {
    path: `${ROUTE_PATHS.VACATION_MANAGER_DETAIL}/:id`,
    element: <VacationDetailPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_VACATION_HISTORY,
    element: <VacationHistoryPage />,
  },
];

const appRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: ROUTE_PATHS.HR.slice(1),
    element: <Navigate to={ROUTE_PATHS.ADMIN_STAFF_DIRECTORY} replace />,
  },
  {
    path: ROUTE_PATHS.DEMO.slice(1),
    element: <ComponentsDemoPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_STAFF_DIRECTORY.slice(1),
    element: <StaffDirectoryPage />,
  },
  {
    path: ROUTE_PATHS.VACATIONS_ADMIN.slice(1),
    element: <EmployeeVacationPage />,
  },
  {
    path: ROUTE_PATHS.VACATIONS_DOCTOR.slice(1),
    element: <EmployeeVacationPage />,
  },
  {
    element: <VacationManagementSection />,
    children: vacationManagementRoutes.map((route) => ({
      ...route,
      path: route.path?.slice(1),
    })),
  },
  {
    path: ROUTE_PATHS.AGENDA.slice(1),
    element: comingSoon("Agenda"),
  },
  {
    path: ROUTE_PATHS.PATHOLOGY_RESULTS.slice(1),
    element: comingSoon("Pathology Results"),
  },
  {
    path: ROUTE_PATHS.PATIENTS.slice(1),
    element: comingSoon("Patients"),
  },
  {
    path: ROUTE_PATHS.APPOINTMENTS.slice(1),
    element: comingSoon("Appointments"),
  },
  {
    path: ROUTE_PATHS.BILLING.slice(1),
    element: comingSoon("Billing"),
  },
  {
    path: ROUTE_PATHS.INVENTORY.slice(1),
    element: comingSoon("Inventory"),
  },
];

const routes: RouteObject[] = [
  { path: ROUTE_PATHS.LOGIN, element: <AdminLoginPage /> },
  { path: ROUTE_PATHS.SIGN_UP, element: <SignUpPage /> },
  { path: ROUTE_PATHS.RESET_PASSWORD, element: <ResetPasswordPage /> },
  { path: ROUTE_PATHS.PATIENT_LOGIN, element: <PacientLoginPge /> },
  { path: ROUTE_PATHS.OTP_VERIFICATION, element: <OtpVerification /> },
  { path: ROUTE_PATHS.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: "/HomePage", element: <Navigate to={ROUTE_PATHS.HOME} replace /> },
  
  { path: ROUTE_PATHS.UNAUTHORIZED, element: <UnauthorizedPage /> },

  {
    element: <ProtectedRoute />, 
    children: [
      {
        element: <MainLayout />,
        children: appRoutes,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />,
    children: [
      {
        path: ROUTE_PATHS.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]} />,
    children: [
      {
        path: ROUTE_PATHS.DOCTOR_DASHBOARD,
        element: <DoctorDashboard />,
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
];

const RoutesConfig: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  );
};