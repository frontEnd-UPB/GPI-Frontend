import { mockEmployees, mockVacationRequests, type VacationRequest } from "../../../core/mocks/data";
import { VACATION_STATUS } from "../../../core/constants";
import {
  getVacationRequestsSnapshot,
  setVacationRequestsSnapshot,
  subscribeToVacationRequestsSnapshot,
} from "../../../core/services/mockVacationRequestsStore";

export type VacationStatus = typeof VACATION_STATUS[keyof typeof VACATION_STATUS];

export interface FetchVacationRequestsParams {
  status?: VacationStatus[];
  search?: string;
}

export function getCachedVacationRequests(): VacationRequest[] {
  return getVacationRequestsSnapshot();
}

export function subscribeToVacationRequests(
  listener: (requests: VacationRequest[]) => void
): () => void {
  return subscribeToVacationRequestsSnapshot(listener);
}

export async function fetchVacationRequests(
  params: FetchVacationRequestsParams = {}
): Promise<VacationRequest[]> {
  const { status, search } = params;

  // Simula latencia de red pequeña
  await new Promise((resolve) => setTimeout(resolve, 150));

  let result = getVacationRequestsSnapshot();

  if (status && status.length > 0) {
    const normalized = status.map((s) => s.toLowerCase());
    result = result.filter((r) => normalized.includes(r.status));
  }

  if (search && search.trim()) {
    const term = search.toLowerCase();
    const nameByEmployeeId: Record<string, string> = {};

    mockEmployees.forEach((employee) => {
      if (!nameByEmployeeId[employee.id]) {
        nameByEmployeeId[employee.id] = `${employee.firstname} ${employee.lastname}`;
      }
    });

    result = result.filter((r) => {
      const name = nameByEmployeeId[r.employeeId]?.toLowerCase() ?? "";
      return name.includes(term);
    });
  }

  return result;
}

export async function approveVacationRequest(id: string): Promise<VacationRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const next = getVacationRequestsSnapshot().map((r) =>
    r.id === id
      ? { ...r, status: VACATION_STATUS.APPROVED, rejectionReason: null }
      : r
  );

  setVacationRequestsSnapshot(next);

  return next.find((r) => r.id === id) ?? null;
}

export async function rejectVacationRequest(
  id: string,
  reason: string
): Promise<VacationRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const next = getVacationRequestsSnapshot().map((r) =>
    r.id === id
      ? { ...r, status: VACATION_STATUS.REJECTED, rejectionReason: reason }
      : r
  );

  setVacationRequestsSnapshot(next);

  return next.find((r) => r.id === id) ?? null;
}

export async function setVacationRequestPending(id: string): Promise<VacationRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const next = getVacationRequestsSnapshot().map((r) =>
    r.id === id
      ? { ...r, status: VACATION_STATUS.PENDING, rejectionReason: null }
      : r
  );

  setVacationRequestsSnapshot(next);

  return next.find((r) => r.id === id) ?? null;
}

// Utilidad para resetear el "backend" falso (por ejemplo en tests)
export function resetVacationRequestsDb(): void {
  setVacationRequestsSnapshot(mockVacationRequests);
}
