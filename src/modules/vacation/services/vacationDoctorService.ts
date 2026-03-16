import { type VacationRequest } from "../../../core/mocks/data";
import { type VacationBalance } from "../../../core/constants";

const API_BASE = "http://localhost:3001";

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface SubmitVacationData {
  startDate: Date;
  endDate: Date;
  reason: string;
  comment?: string;
  attachment?: File | null;
}

export interface UpdateVacationRequestData {
  startDate?: Date;
  endDate?: Date;
  reason: string;
  comment?: string;
  attachment?: File | null;
  removeAttachment?: boolean;
}

/* ================================
   GET VACATION BALANCE
================================ */

export async function getVacationBalance(
  employeeId: string
): Promise<VacationBalance | null> {

  const response = await fetch(`${API_BASE}/vacations/balance/${employeeId}`);

  if (!response.ok) {
    throw new Error("Failed to load vacation balance");
  }

  return await response.json();
}

/* ================================
   GET EMPLOYEE VACATION REQUESTS
================================ */

export async function listEmployeeVacationRequests(
  employeeId: string
): Promise<VacationRequest[]> {

  const response = await fetch(`${API_BASE}/vacations/${employeeId}`);

  if (!response.ok) {
    throw new Error("Failed to load vacation requests");
  }

  return await response.json();
}

/* ================================
   SUBMIT VACATION REQUEST
================================ */

export async function submitVacationRequest(
  employeeId: string,
  submitData: SubmitVacationData
): Promise<VacationRequest> {

  const response = await fetch(`${API_BASE}/vacations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeId,
      startDate: toLocalIsoDate(submitData.startDate),
      endDate: toLocalIsoDate(submitData.endDate),
      reason: submitData.reason,
      comment: submitData.comment ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit vacation request");
  }

  return await response.json();
}

/* ================================
   UPDATE VACATION REQUEST
================================ */

export async function updateVacationRequest(
  requestId: string,
  updates: UpdateVacationRequestData
): Promise<VacationRequest | null> {

  const response = await fetch(`${API_BASE}/vacations/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: updates.startDate
        ? toLocalIsoDate(updates.startDate)
        : undefined,
      endDate: updates.endDate
        ? toLocalIsoDate(updates.endDate)
        : undefined,
      reason: updates.reason,
      comment: updates.comment ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update vacation request");
  }

  return await response.json();
}

/* ================================
   CANCEL VACATION REQUEST
================================ */

export async function cancelVacationRequest(
  requestId: string
): Promise<VacationRequest | null> {

  const response = await fetch(`${API_BASE}/vacations/${requestId}/cancel`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to cancel vacation request");
  }

  return await response.json();
}


