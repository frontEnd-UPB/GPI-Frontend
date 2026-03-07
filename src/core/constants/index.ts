export { USER_ROLES } from "./roles";
export { AUTH_STORAGE_KEYS, type AuthStorageKey } from "./auth-storage";

export const AUTH_DEBUG = true as const;

export const EMPLOYEE_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  VACATION: "vacation",
  AVAILABLE: "available",
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
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

export const PATIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DISCHARGED: "discharged",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    PROFILE: "/api/auth/profile",
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
    LIST: "/api/vacations",
    DETAIL: (id: string) => `/api/vacations/${id}`,
    CREATE: "/api/vacations",
    UPDATE: (id: string) => `/api/vacations/${id}`,
    APPROVE: (id: string) => `/api/vacations/${id}/approve`,
    REJECT: (id: string) => `/api/vacations/${id}/reject`,
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
