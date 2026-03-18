import { ApiError, apiClient } from "../../../core/services/apiClient";
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
  id: string | number;
  staff_id?: string | number;
  employee_id?: string | number;
  start_date: string;
  end_date: string;
  rejection_reason?: string | null;
  reason: string | null;
  status: string;
  request_date?: string;
  comment: string | null;
  attachment_url?: string | null;
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

function normalizeVacationStatus(
  rawStatus: string
): VacationRequest["status"] {
  const normalized = rawStatus.trim().toLowerCase();

  if (normalized === "accepted") return "approved";
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  if (normalized === "cancelled") return "cancelled";
  return "pending";
}

function toVacationRequest(raw: BackendVacationRequest): VacationRequest {
  const status = normalizeVacationStatus(raw.status);
  const staffId = raw.staff_id ?? raw.employee_id;

  return {
    id: String(raw.id),
    employeeId: staffId != null ? String(staffId) : "",
    startDate: raw.start_date,
    endDate: raw.end_date,
    rejectionReason:
      raw.rejection_reason ?? (status === "rejected" ? raw.reason : null),
    reason: raw.reason ?? "",
    status,
    requestDate: raw.request_date ?? raw.start_date,
    comment: raw.comment,
    attachmentUrl: raw.attachment_url ?? null,
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
 * GET /myprofile/requestvacation/balance/:staffId
 */
export async function getVacationBalance(
  staffId: string
): Promise<VacationBalance | null> {
  const raw = await apiClient.get<BackendVacationBalance>(
    API_ENDPOINTS.VACATIONS.EMPLOYEE.BALANCE(staffId)
  );
  return toVacationBalance(raw);
}

/**
 * Returns all vacation requests submitted by a specific employee, ordered by
 * start date ascending.
 *
 * GET /myprofile/requestvacation?staff_id=:staffId
 */
export async function listEmployeeVacationRequests(
  staffId: string
): Promise<VacationRequest[]> {
  const rawList = await apiClient.get<BackendVacationRequest[]>(
    API_ENDPOINTS.VACATIONS.EMPLOYEE.LIST,
    {
      staff_id: staffId,
      // Helps Mockoon CRUD filtering while preserving backend contract param.
      staff_id_eq: staffId,
    }
  );
  return rawList
    .map(toVacationRequest)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * Creates a new vacation request for an employee. If a file attachment is
 * provided it is sent as `multipart/form-data`; otherwise a JSON body is used.
 *
 * POST /myprofile/requestvacation?staff_id=:staffId
 */
export async function submitVacationRequest(
  staffId: string,
  submitData: SubmitVacationData
): Promise<VacationRequest> {
  const { startDate, endDate, reason, comment, attachment } = submitData;

  let body: FormData | Record<string, unknown>;

  if (attachment) {
    const form = new FormData();
    form.append("staff_id", staffId);
    form.append("start_date", toLocalIsoDate(startDate));
    form.append("end_date", toLocalIsoDate(endDate));
    form.append("reason", reason);
    form.append("status", "pending");
    if (comment != null) form.append("comment", comment);
    form.append("attachment", attachment, attachment.name);
    body = form;
  } else {
    body = {
      staff_id: staffId,
      start_date: toLocalIsoDate(startDate),
      end_date: toLocalIsoDate(endDate),
      reason,
      status: "pending",
      comment: comment ?? null,
    };
  }

  const raw = await apiClient.post<BackendVacationRequest>(
    `${API_ENDPOINTS.VACATIONS.EMPLOYEE.CREATE}?staff_id=${encodeURIComponent(staffId)}`,
    body
  );
  return toVacationRequest(raw);
}

/**
 * Updates an existing vacation request. Supports replacing or removing the
 * file attachment.
 *
 * PATCH /myprofile/requestvacation/:requestId
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
    if (startDate) form.append("start_date", toLocalIsoDate(startDate));
    if (endDate) form.append("end_date", toLocalIsoDate(endDate));
    form.append("reason", reason);
    if (comment != null) form.append("comment", comment);
    if (removeAttachment === true) form.append("remove_attachment", "true");
    form.append("attachment", attachment, attachment.name);
    body = form;
  } else {
    body = {
      ...(startDate ? { start_date: toLocalIsoDate(startDate) } : {}),
      ...(endDate ? { end_date: toLocalIsoDate(endDate) } : {}),
      reason,
      comment: comment ?? null,
      remove_attachment: removeAttachment === true,
    };
  }

  const raw = await apiClient.patch<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.EMPLOYEE.UPDATE(requestId),
    body
  );
  return toVacationRequest(raw);
}

/**
 * Cancels a vacation request by its ID.
 *
 * PATCH /myprofile/requestvacation/:requestId/cancel
 */
export async function cancelVacationRequest(
  requestId: string
): Promise<VacationRequest | null> {
  try {
    const raw = await apiClient.patch<BackendVacationRequest>(
      API_ENDPOINTS.VACATIONS.EMPLOYEE.CANCEL(requestId)
    );
    return toVacationRequest(raw);
  } catch (error) {
    // Compatibility fallback while backend decides between explicit /cancel and status patch.
    if (error instanceof ApiError && error.status === 404) {
      const raw = await apiClient.patch<BackendVacationRequest>(
        API_ENDPOINTS.VACATIONS.EMPLOYEE.UPDATE(requestId),
        { status: "cancelled" }
      );
      return toVacationRequest(raw);
    }

    throw error;
  }
}
