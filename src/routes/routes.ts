import type { UserRole } from "../core/constants/roles";

export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/admin-login",
  //Debe ver login de pacientes
  UNAUTHORIZED: "/unauthorized",
  ADMIN_DASHBOARD: "/admin-dashboard",
  DOCTOR_DASHBOARD: "/doctor-dashboard",

  SIGN_UP: "/sign-up",
  RESET_PASSWORD: "/reset-password",
  PATIENT_LOGIN: "/patient-login",
  OTP_VERIFICATION: "/otp-verification",
  FORGOT_PASSWORD: "/forgot-password",

  DEMO: "/demo",

  // Admin
  HR: "/hr",
  ADMIN_STAFF_DIRECTORY: "/admin/staff-directory",
  ADMIN_VACATION_MANAGER: "/admin/vacation-manager",
  VACATIONS_ADMIN: "/vacations/admin",

  // Doctor
  VACATIONS_DOCTOR: "/vacations/doctor",
  AGENDA: "/agenda",
  PATHOLOGY_RESULTS: "/pathology-results",

  // Common (NavBars)
  PATIENTS: "/patients",
  APPOINTMENTS: "/appointments",
  BILLING: "/billing",
  INVENTORY: "/inventory",
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export const UNAUTHORIZED_ROUTE: RoutePath = ROUTE_PATHS.UNAUTHORIZED;

export const ALWAYS_ALLOWED_ROUTES: RoutePath[] = [
  ROUTE_PATHS.UNAUTHORIZED,
  ROUTE_PATHS.DEMO,
];

export const ROLE_ROUTE_ACCESS: Record<UserRole, RoutePath[]> = {
  admin: [
    ROUTE_PATHS.HOME,
    ROUTE_PATHS.ADMIN_DASHBOARD,
    ROUTE_PATHS.DEMO,
    ROUTE_PATHS.HR,
    ROUTE_PATHS.ADMIN_STAFF_DIRECTORY,
    ROUTE_PATHS.ADMIN_VACATION_MANAGER,
    ROUTE_PATHS.VACATIONS_ADMIN,
    ROUTE_PATHS.PATIENTS,
    ROUTE_PATHS.APPOINTMENTS,
    ROUTE_PATHS.BILLING,
    ROUTE_PATHS.INVENTORY,
  ],
  doctor: [
    ROUTE_PATHS.HOME,
    ROUTE_PATHS.DOCTOR_DASHBOARD,
    ROUTE_PATHS.DEMO,
    ROUTE_PATHS.VACATIONS_DOCTOR,
    ROUTE_PATHS.AGENDA,
    ROUTE_PATHS.PATIENTS,
    ROUTE_PATHS.PATHOLOGY_RESULTS,
  ],
};
