export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
} as const;

export const ROLES = Object.values(USER_ROLES);

export type UserRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
};
