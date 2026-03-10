import type { Employee, VacationRequest } from "../mocks/data";
import { VACATION_STATUS } from "./index";

export interface VacationBalance {
  assigned: number;
  used: number;
  available: number;
}

export const VACATION_ATTACHMENT_ALLOWED_FILE_TYPES = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
] as const;

export const VACATION_ATTACHMENT_MAX_FILE_SIZE_MB = 5;
export const VACATION_ATTACHMENT_MAX_FILE_SIZE_BYTES =
  VACATION_ATTACHMENT_MAX_FILE_SIZE_MB * 1024 * 1024;

export function getYearsOfService(
  startDate: string,
  asOf: Date = new Date()
): number {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 0;

  let years = asOf.getFullYear() - start.getFullYear();
  const hasNotReachedAnniversaryYet =
    asOf.getMonth() < start.getMonth() ||
    (asOf.getMonth() === start.getMonth() && asOf.getDate() < start.getDate());

  if (hasNotReachedAnniversaryYet) {
    years -= 1;
  }

  return Math.max(years, 0);
}

export function getAnnualVacationEntitlement(startDate: string): number {
  const years = getYearsOfService(startDate);

  if (years >= 10) return 30;
  if (years >= 5) return 20;
  if (years >= 0) return 15; // Incluye menores de 1 año en el primer tramo

  return 0;
}

export function getVacationDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays + 1 : 0;
}

export function computeVacationBalanceForEmployee(
  employee: Employee,
  requests: VacationRequest[],
  asOf: Date = new Date()
): VacationBalance {
  const assigned = getAnnualVacationEntitlement(employee.start_date);

  const currentYear = asOf.getFullYear();

  const used = requests
    .filter(
      (request) =>
        request.employeeId === employee.id &&
        request.status === VACATION_STATUS.APPROVED &&
        new Date(request.startDate).getFullYear() === currentYear
    )
    .reduce((total, request) => {
      return total + getVacationDaysBetween(request.startDate, request.endDate);
    }, 0);

  const available = Math.max(assigned - used, 0);

  return { assigned, used, available };
}
