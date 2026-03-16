import { type VacationRequest } from "../../../core/mocks/data";

const API_BASE = "http://localhost:3002";

/* =========================
   BACKEND TYPES
========================= */

interface BackendVacationRequest {
  start_date: string;
  end_date: string;
  comment: string | null;
  reason: string | null;
  status: string;
  id: number;
  staff_id: number;
  requestDate?: string;
  attachmentUrl?: string | null;
}

/* =========================
   STATUS MAPPERS
========================= */

function mapBackendStatus(status: string) {
  switch (status) {
    case "accepted":
      return "approved";

    case "pending":
      return "pending";

    case "rejected":
      return "rejected";

    case "cancelled":
      return "cancelled";

    default:
      return "pending";
  }
}

function mapFrontendStatus(status: string) {
  switch (status) {
    case "approved":
      return "accepted";

    case "pending":
      return "pending";

    case "rejected":
      return "rejected";

    case "cancelled":
      return "cancelled";

    default:
      return "pending";
  }
}

/* =========================
   MAPPER BACKEND → FRONTEND
========================= */

function mapBackendToFrontend(
  data: BackendVacationRequest
): VacationRequest {

  return {
    id: String(data.id),
    employeeId: String(data.staff_id),
    startDate: data.start_date,
    endDate: data.end_date,
    reason: data.reason ?? "",
    status: mapBackendStatus(data.status),
    requestDate: data.requestDate ?? new Date().toISOString().slice(0, 10),
    comment: data.comment ?? null,
    attachmentUrl: data.attachmentUrl ?? null
  };
}

/* =========================
   GET VACATION REQUESTS
========================= */

export async function listEmployeeVacationRequests(
  employeeId: string
): Promise<VacationRequest[]> {

  const response = await fetch(
    `${API_BASE}/human-resources/vacation-managment`
  );

  if (!response.ok) {
    throw new Error("Failed to load vacation requests");
  }

  const data: BackendVacationRequest[] = await response.json();

  return data
    .filter((req) => String(req.staff_id) === employeeId)
    .map(mapBackendToFrontend);
}

/* =========================
   GET ONE REQUEST
========================= */

export async function getVacationRequest(
  requestId: string
): Promise<VacationRequest> {

  const response = await fetch(
    `${API_BASE}/myprofile/requestvacation/${requestId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load vacation request");
  }

  const data: BackendVacationRequest = await response.json();

  return mapBackendToFrontend(data);
}

/* =========================
   SUBMIT VACATION REQUEST
========================= */

export interface SubmitVacationData {
  startDate: Date;
  endDate: Date;
  reason: string;
  comment?: string;
}

function toLocalIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function submitVacationRequest(
  employeeId: string,
  submitData: SubmitVacationData
): Promise<VacationRequest> {

  const response = await fetch(
    `${API_BASE}/myprofile/requestvacation?staff_id=${employeeId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        start_date: toLocalIsoDate(submitData.startDate),
        end_date: toLocalIsoDate(submitData.endDate),
        comment: submitData.comment ?? null,
        status: "pending"
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create vacation request");
  }

  const data: BackendVacationRequest = await response.json();

  return mapBackendToFrontend(data);
}

/* =========================
   UPDATE VACATION REQUEST
========================= */

export async function updateVacationRequest(
  requestId: string,
  reason: string,
  status: string
): Promise<VacationRequest> {

  const response = await fetch(
    `${API_BASE}/human-resources/vacation-managment/${requestId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reason,
        status: mapFrontendStatus(status)
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update request");
  }

  const data: BackendVacationRequest = await response.json();

  return mapBackendToFrontend(data);
}

/* =========================
   GET VACATION BALANCE
========================= */

export interface VacationBalance {
  employeeId: string;
  usedDays: number;
  remainingDays: number;
  totalDays: number;
}

function getDaysBetween(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = endDate.getTime() - startDate.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export async function getVacationBalance(
  employeeId: string
): Promise<VacationBalance> {

  const requests = await listEmployeeVacationRequests(employeeId);

  const approvedRequests = requests.filter(
    (r) => r.status === "approved"
  );

  const usedDays = approvedRequests.reduce((total, req) => {
    return total + getDaysBetween(req.startDate, req.endDate);
  }, 0);

  const totalDays = 15; // puedes cambiar esto si tu lógica es diferente

  return {
    employeeId,
    usedDays,
    remainingDays: totalDays - usedDays,
    totalDays
  };
}

/* =========================
   CANCEL VACATION REQUEST
========================= */

export async function cancelVacationRequest(
  requestId: string
): Promise<VacationRequest> {

  const response = await fetch(
    `${API_BASE}/human-resources/vacation-managment/${requestId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "cancelled"
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel vacation request");
  }

  const data: BackendVacationRequest = await response.json();

  return mapBackendToFrontend(data);
}


