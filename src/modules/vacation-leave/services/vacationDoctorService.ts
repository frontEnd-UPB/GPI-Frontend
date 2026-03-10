import {
  mockEmployees,
  mockVacationRequests,
  type VacationRequest,
} from "../../../core/mocks/data";
import {
  type VacationBalance,
  computeVacationBalanceForEmployee,
} from "../../../core/constants";
import { VACATION_STATUS } from "../../../core/constants";

const USE_MOCKS = true;

export async function getVacationBalance(
  employeeId: string
): Promise<VacationBalance | null> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const employee = mockEmployees.find((e) => e.id === employeeId);
  if (!employee) return null;

  return computeVacationBalanceForEmployee(employee, mockVacationRequests);
}

export interface SubmitVacationData {
  startDate: Date;
  endDate: Date;
  reason: string;
  comment?: string;
  attachment?: File | null;
}

export async function listEmployeeVacationRequests(
  employeeId: string
): Promise<VacationRequest[]> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  return mockVacationRequests
    .filter((request) => request.employeeId === employeeId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function submitVacationRequest(
  employeeId: string,
  submitData: SubmitVacationData
): Promise<VacationRequest> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const { startDate, endDate, reason, comment } = submitData;

  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required.");
  }

  const newRequest: VacationRequest = {
    id: String(Date.now()),
    employeeId,
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    reason,
    status: VACATION_STATUS.PENDING,
    requestDate: new Date().toISOString().split("T")[0],
    comment: comment ?? null,
    attachmentUrl: null,
  };

  mockVacationRequests.push(newRequest);

  return newRequest;
}

export interface UpdateVacationRequestData {
  reason: string;
  comment?: string;
}

export async function updateVacationRequest(
  requestId: string,
  updates: UpdateVacationRequestData
): Promise<VacationRequest | null> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const requestIndex = mockVacationRequests.findIndex(
    (request) => request.id === requestId
  );

  if (requestIndex === -1) return null;

  const existing = mockVacationRequests[requestIndex];

  const updated: VacationRequest = {
    ...existing,
    reason: updates.reason,
    comment: updates.comment ?? existing.comment,
    status: VACATION_STATUS.PENDING,
  };

  mockVacationRequests[requestIndex] = updated;

  return updated;
}

export async function cancelVacationRequest(
  requestId: string
): Promise<VacationRequest | null> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const requestIndex = mockVacationRequests.findIndex(
    (request) => request.id === requestId
  );

  if (requestIndex === -1) return null;

  const existing = mockVacationRequests[requestIndex];

  const updated: VacationRequest = {
    ...existing,
    status: VACATION_STATUS.CANCELLED,
  };

  mockVacationRequests[requestIndex] = updated;

  return updated;
}
