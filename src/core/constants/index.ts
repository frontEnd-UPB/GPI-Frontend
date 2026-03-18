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
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    PROFILE: "/api/auth/profile",
  },
  // Endpoints del contrato con backend.
  // Se agregan sin reemplazar la estructura AUTH actual para priorizar la arquitectura vigente del frontend.
  AUTH_CONTRACT: {
    LOGIN_PATIENT: "/login/patient",
    LOGIN_STAFF: "/login/staff",
    FORGOT_PASSWORD: "/forgot_password",
    REGISTER: "/register",
    VERIFY: "/verify",
    RESET_PASSWORD: "/reset_password",
    REGISTER_USER: "/register_user",
  },
  EMPLOYEES: {
    LIST: "/api/employees",
    DETAIL: (id: string) => `/api/employees/${id}`,
    CREATE: "/api/employees",
    UPDATE: (id: string) => `/api/employees/${id}`,
    DELETE: (id: string) => `/api/employees/${id}`,
  },
  PATIENTS: {
    LIST: "/api/patients",
    DETAIL: (id: string) => `/api/patients/${id}`,
    CREATE: "/api/patients",
    UPDATE: (id: string) => `/api/patients/${id}`,
    DELETE: (id: string) => `/api/patients/${id}`,
  },
  APPOINTMENTS: {
    LIST: "/api/appointments",
    DETAIL: (id: string) => `/api/appointments/${id}`,
    CREATE: "/api/appointments",
    UPDATE: (id: string) => `/api/appointments/${id}`,
    DELETE: (id: string) => `/api/appointments/${id}`,
  },
  VACATIONS: {
    EMPLOYEE: {
      LIST: "/myprofile/requestvacation",
      DETAIL: (requestId: string) => `/myprofile/requestvacation/${requestId}`,
      CREATE: "/myprofile/requestvacation",
      UPDATE: (requestId: string) => `/myprofile/requestvacation/${requestId}`,
      CANCEL: (requestId: string) =>
        `/myprofile/requestvacation/${requestId}/cancel`,
      BALANCE: (staffId: string) => `/myprofile/requestvacation/balance/${staffId}`,
    },
    HR: {
      LIST: "/human-resources/vacation-managment",
      DETAIL: (requestId: string) =>
        `/human-resources/vacation-managment/${requestId}`,
      UPDATE: (requestId: string) =>
        `/human-resources/vacation-managment/${requestId}`,
    },
    // Legacy endpoints kept during migration.
    LIST: "/api/vacations",
    DETAIL: (id: string) => `/api/vacations/${id}`,
    CREATE: "/api/vacations",
    UPDATE: (id: string) => `/api/vacations/${id}`,
    APPROVE: (id: string) => `/api/vacations/${id}/approve`,
    REJECT: (id: string) => `/api/vacations/${id}/reject`,
    CANCEL: (id: string) => `/api/vacations/${id}/cancel`,
    PENDING: (id: string) => `/api/vacations/${id}/pending`,
    BALANCE: (employeeId: string) => `/api/vacations/balance/${employeeId}`,
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
