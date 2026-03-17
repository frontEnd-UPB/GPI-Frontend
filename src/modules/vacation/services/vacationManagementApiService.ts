import { apiClient } from "../../../core/services/apiClient";
import { API_ENDPOINTS, VACATION_STATUS } from "../../../core/constants";
import type { VacationRequest } from "../../../core/mocks/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VacationStatus =
  (typeof VACATION_STATUS)[keyof typeof VACATION_STATUS];

export interface FetchVacationRequestsParams {
  status?: VacationStatus[];
  search?: string;
}

// ---------------------------------------------------------------------------
// Backend response DTO (snake_case as returned by the REST API)
// ---------------------------------------------------------------------------

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
// Mapper – backend DTO → UI model
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Fetches all vacation requests, optionally filtered by status and/or
 * employee name search term.
 *
 * GET /api/vacations[?status=pending&status=approved&search=term]
 */
export async function fetchVacationRequests(
  params: FetchVacationRequestsParams = {}
): Promise<VacationRequest[]> {
  const { status, search } = params;

  const queryParams: Record<string, string | string[]> = {};
  if (status && status.length > 0) {
    queryParams["status"] = status;
  }
  if (search && search.trim()) {
    queryParams["search"] = search.trim();
  }

  const rawList = await apiClient.get<BackendVacationRequest[]>(
    API_ENDPOINTS.VACATIONS.LIST,
    queryParams
  );
  return rawList.map(toVacationRequest);
}

/**
 * Approves a vacation request.
 *
 * POST /api/vacations/:id/approve
 */
export async function approveVacationRequest(
  id: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.post<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.APPROVE(id)
  );
  return toVacationRequest(raw);
}

/**
 * Rejects a vacation request with a mandatory rejection reason.
 *
 * POST /api/vacations/:id/reject
 */
export async function rejectVacationRequest(
  id: string,
  reason: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.post<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.REJECT(id),
    { reason }
  );
  return toVacationRequest(raw);
}

/**
 * Reverts a vacation request back to pending status.
 *
 * PATCH /api/vacations/:id/pending
 */
export async function setVacationRequestPending(
  id: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.patch<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.PENDING(id)
  );
  return toVacationRequest(raw);
}
