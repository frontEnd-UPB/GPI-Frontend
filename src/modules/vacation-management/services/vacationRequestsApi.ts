import { mockVacationRequests, mockEmployees, type VacationRequest } from "../../../core/mocks/data";
import { VACATION_STATUS } from "../../../core/constants";

// Simula una "base de datos" en memoria usando los mocks actuales.
// Más adelante, este archivo será el lugar donde reemplazar mock logic por
// llamadas HTTP reales a backend (fetch/axios, etc.).

let db: VacationRequest[] = [...mockVacationRequests];

export type VacationStatus = typeof VACATION_STATUS[keyof typeof VACATION_STATUS];

export interface FetchVacationRequestsParams {
  status?: VacationStatus[];
  search?: string;
  departmentByEmployeeId?: Record<string, string | undefined>;
}

export async function fetchVacationRequests(
  params: FetchVacationRequestsParams = {}
): Promise<VacationRequest[]> {
  const { status, search, departmentByEmployeeId } = params;

  // Simula latencia de red pequeña
  await new Promise((resolve) => setTimeout(resolve, 150));

  let result = [...db];

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

  if (departmentByEmployeeId) {
    result = result.filter((r) => {
      const dep = departmentByEmployeeId[r.employeeId];
      // Si no se pasa filtro de departamento desde fuera,
      // simplemente devolvemos todas las requests.
      return dep !== undefined || dep === undefined;
    });
  }

  return result;
}

export async function approveVacationRequest(id: string): Promise<VacationRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  db = db.map((r) =>
    r.id === id
      ? { ...r, status: VACATION_STATUS.APPROVED, rejectionReason: null }
      : r
  );

  return db.find((r) => r.id === id) ?? null;
}

export async function rejectVacationRequest(
  id: string,
  reason: string
): Promise<VacationRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  db = db.map((r) =>
    r.id === id
      ? { ...r, status: VACATION_STATUS.REJECTED, rejectionReason: reason }
      : r
  );

  return db.find((r) => r.id === id) ?? null;
}

export async function setVacationRequestPending(id: string): Promise<VacationRequest | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));

  db = db.map((r) =>
    r.id === id
      ? { ...r, status: VACATION_STATUS.PENDING, rejectionReason: null }
      : r
  );

  return db.find((r) => r.id === id) ?? null;
}

// Utilidad para resetear el "backend" falso (por ejemplo en tests)
export function resetVacationRequestsDb(): void {
  db = [...mockVacationRequests];
}
