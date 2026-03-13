import { apiClient } from "../../../core/services/apiClient";
import { API_ENDPOINTS } from "../../../core/constants";
import type { VacationBalance } from "../../../core/constants";
import type { VacationRequest } from "../../../core/mocks/data";

// ---------------------------------------------------------------------------
// Re-exported input interfaces (same contract as the mock service)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Backend response DTOs (snake_case as returned by the REST API)
// ---------------------------------------------------------------------------

interface BackendVacationBalance {
  assigned: number;
  used: number;
  available: number;
}

interface BackendVacationRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  rejection_reason?: string | null;
  reason: string;
  status: string;
  request_date: string;
  comment: string | null;
  attachment_url: string | null;
  attachment_name?: string | null;
}

// ---------------------------------------------------------------------------
// Mappers – backend DTO → UI model
// ---------------------------------------------------------------------------

function toVacationBalance(raw: BackendVacationBalance): VacationBalance {
  return {
    assigned: raw.assigned,
    used: raw.used,
    available: raw.available,
  };
}

function toVacationRequest(raw: BackendVacationRequest): VacationRequest {
  return {
    id: raw.id,
    employeeId: raw.employee_id,
    startDate: raw.start_date,
    endDate: raw.end_date,
    rejectionReason: raw.rejection_reason ?? null,
    reason: raw.reason,
    status: raw.status as VacationRequest["status"],
    requestDate: raw.request_date,
    comment: raw.comment,
    attachmentUrl: raw.attachment_url,
    attachmentName: raw.attachment_name ?? null,
  };
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Fetches the vacation balance (assigned / used / available days) for a
 * given employee.
 *
 * GET /api/vacations/balance/:employeeId
 */
export async function getVacationBalance(
  employeeId: string
): Promise<VacationBalance | null> {
  const raw = await apiClient.get<BackendVacationBalance>(
    API_ENDPOINTS.VACATIONS.BALANCE(employeeId)
  );
  return toVacationBalance(raw);
}

/**
 * Returns all vacation requests submitted by a specific employee, ordered by
 * start date ascending.
 *
 * GET /api/vacations?employeeId=:employeeId
 */
export async function listEmployeeVacationRequests(
  employeeId: string
): Promise<VacationRequest[]> {
  const rawList = await apiClient.get<BackendVacationRequest[]>(
    API_ENDPOINTS.VACATIONS.LIST,
    { employeeId }
  );
  return rawList
    .map(toVacationRequest)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * Creates a new vacation request for an employee. If a file attachment is
 * provided it is sent as `multipart/form-data`; otherwise a JSON body is used.
 *
 * POST /api/vacations
 */
export async function submitVacationRequest(
  employeeId: string,
  submitData: SubmitVacationData
): Promise<VacationRequest> {
  const { startDate, endDate, reason, comment, attachment } = submitData;

  let body: FormData | Record<string, unknown>;

  if (attachment) {
    const form = new FormData();
    form.append("employeeId", employeeId);
    form.append("startDate", toLocalIsoDate(startDate));
    form.append("endDate", toLocalIsoDate(endDate));
    form.append("reason", reason);
    if (comment) form.append("comment", comment);
    form.append("attachment", attachment, attachment.name);
    body = form;
  } else {
    body = {
      employeeId,
      startDate: toLocalIsoDate(startDate),
      endDate: toLocalIsoDate(endDate),
      reason,
      comment: comment ?? null,
    };
  }

  const raw = await apiClient.post<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.CREATE,
    body
  );
  return toVacationRequest(raw);
}

/**
 * Updates an existing vacation request. Supports replacing or removing the
 * file attachment.
 *
 * PUT /api/vacations/:requestId
 */
export async function updateVacationRequest(
  requestId: string,
  updates: UpdateVacationRequestData
): Promise<VacationRequest | null> {
  const { startDate, endDate, reason, comment, attachment, removeAttachment } =
    updates;

  let body: FormData | Record<string, unknown>;

  if (attachment) {
    const form = new FormData();
    if (startDate) form.append("startDate", toLocalIsoDate(startDate));
    if (endDate) form.append("endDate", toLocalIsoDate(endDate));
    form.append("reason", reason);
    if (comment) form.append("comment", comment);
    form.append("attachment", attachment, attachment.name);
    body = form;
  } else {
    body = {
      ...(startDate ? { startDate: toLocalIsoDate(startDate) } : {}),
      ...(endDate ? { endDate: toLocalIsoDate(endDate) } : {}),
      reason,
      comment: comment ?? null,
      removeAttachment: removeAttachment === true,
    };
  }

  const raw = await apiClient.put<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.UPDATE(requestId),
    body
  );
  return toVacationRequest(raw);
}

/**
 * Cancels a vacation request by its ID.
 *
 * PATCH /api/vacations/:requestId/cancel
 */
export async function cancelVacationRequest(
  requestId: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.patch<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.CANCEL(requestId)
  );
  return toVacationRequest(raw);
}
