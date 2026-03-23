export { USER_ROLES } from "./roles";
export { AUTH_STORAGE_KEYS, type AuthStorageKey } from "./auth-storage";
export {
  type VacationBalance,
  VACATION_ATTACHMENT_ALLOWED_FILE_TYPES,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_MB,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_BYTES,
  getYearsOfService,
  getAnnualVacationEntitlement,
  getVacationDaysBetween,
  computeVacationBalanceForEmployee,
} from "./vacations";

export const AUTH_DEBUG = false as const;

export const API_BASE_URL = import.meta.env.DEV //true if in development mode, false in production
  ? ""
  : (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");  ///DOESNT WORK IN PRODUCTION due to cors, THOUGH

export const EMPLOYEE_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  VACATION: "vacation",
  AVAILABLE: "available",
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export const VACATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/login/staff",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/refresh",
    PROFILE: "/api/v1/auth/profile",
  },
  // Endpoints del contrato con backend.
  // Se agregan sin reemplazar la estructura AUTH actual para priorizar la arquitectura vigente del frontend.
  AUTH_CONTRACT: {
    LOGIN_PATIENT: "/api/v1/login/patient",
    LOGIN_STAFF: "/api/v1/login/staff",
    FORGOT_PASSWORD: "/api/v1/forgot_password",
    REGISTER: "/api/v1/register",
    VERIFY: "/api/v1/verify",
    RESET_PASSWORD: "/api/v1/reset_password",
    REGISTER_USER: "/api/v1/register_user",
  },
  EMPLOYEES: {
    LIST: "/api/v1/employees",
    DETAIL: (id: string) => `/api/v1/employees/${id}`,
    CREATE: "/api/v1/employees",
    UPDATE: (id: string) => `/api/v1/employees/${id}`,
    DELETE: (id: string) => `/api/v1/employees/${id}`,
  },
  PATIENTS: {
    LIST: "/api/v1/patients",
    DETAIL: (id: string) => `/api/v1/patients/${id}`,
    CREATE: "/api/v1/patients",
    UPDATE: (id: string) => `/api/v1/patients/${id}`,
    DELETE: (id: string) => `/api/v1/patients/${id}`,
  },
  APPOINTMENTS: {
    LIST: "/api/v1/appointments",
    DETAIL: (id: string) => `/api/v1/appointments/${id}`,
    CREATE: "/api/v1/appointments",
    UPDATE: (id: string) => `/api/v1/appointments/${id}`,
    DELETE: (id: string) => `/api/v1/appointments/${id}`,
  },
  VACATIONS: {
    EMPLOYEE: {
      LIST: (staffId: string) => `/api/v1/myprofile/requestvacation/${staffId}`,
      DETAIL: (staffId: string, requestId: string) =>
        `/api/v1/myprofile/requestvacation/${staffId}/${requestId}`,
      CREATE: "/api/v1/myprofile/requestvacation",
      UPDATE: (requestId: string) => `/api/v1/myprofile/requestvacation/${requestId}`,
      CANCEL: (requestId: string) =>
        `/api/v1/myprofile/requestvacation/${requestId}/cancel`,
      BALANCE: (staffId: string) => `/api/v1/myprofile/requestvacation/balance/${staffId}`,
    },
    HR: {
      LIST: "/api/v1/human-resources/vacation-management",
      DETAIL: (requestId: string) =>
        `/api/v1/human-resources/vacation-management/${requestId}`,
      UPDATE: (requestId: string) =>
        `/api/v1/human-resources/vacation-management/${requestId}`,
    },
    // Legacy endpoints kept during migration.
    LIST: "/api/v1/vacations",
    DETAIL: (id: string) => `/api/v1/vacations/${id}`,
    CREATE: "/api/v1/vacations",
    UPDATE: (id: string) => `/api/v1/vacations/${id}`,
    APPROVE: (id: string) => `/api/v1/vacations/${id}/approve`,
    REJECT: (id: string) => `/api/v1/vacations/${id}/reject`,
    CANCEL: (id: string) => `/api/v1/vacations/${id}/cancel`,
    PENDING: (id: string) => `/api/v1/vacations/${id}/pending`,
    BALANCE: (employeeId: string) => `/api/v1/vacations/balance/${employeeId}`,
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  DISPLAY_WITH_TIME: "DD/MM/YYYY HH:mm",
  API: "YYYY-MM-DD",
  API_WITH_TIME: "YYYY-MM-DDTHH:mm:ss",
} as const;

// Simple helper to convert an API date (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
// to the DISPLAY format configured above. Currently supports DD/MM/YYYY.
export function formatDisplayDate(value: string): string {
  if (!value) return value;

  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return value;

  if (DATE_FORMATS.DISPLAY === "DD/MM/YYYY") {
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }

  return value;
}

// Helper to convert an API datetime (YYYY-MM-DDTHH:mm:ss)
// to the DISPLAY_WITH_TIME format (e.g. DD/MM/YYYY HH:mm).
export function formatDisplayDateTime(value: string): string {
  if (!value) return value;

  const [datePart, timePart = ""] = value.split("T");
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return value;

  const [hour = "00", minute = "00"] = timePart.split(":");

  if (DATE_FORMATS.DISPLAY_WITH_TIME === "DD/MM/YYYY HH:mm") {
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }

  return value;
}
