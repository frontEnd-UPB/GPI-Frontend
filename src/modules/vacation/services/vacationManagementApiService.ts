import { ApiError, apiClient } from "../../../core/services/httpClient";
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
// Mapper – backend DTO → UI model
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Fetches employee profile by ID (same pattern as authApi.getCurrentUserById)
 * Returns formatted employee data for use in calendar/table displays
 */
export async function fetchEmployeeProfile(
  id: string
): Promise<{ firstname: string; lastname: string; department?: string }> {
  interface EmployeeResponseDto {
    id: string | number;
    firstname?: string;
    first_name?: string;
    lastname?: string;
    last_name?: string;
    email?: string;
    department?: string;
  }

  const response = await fetchEmployeeProfileByIdWithFallback(id);
  return {
    firstname: response.firstname ?? response.first_name ?? "",
    lastname: response.lastname ?? response.last_name ?? "",
    department: response.department,
  };
}

async function fetchEmployeeProfileByIdWithFallback(
  id: string
): Promise<{
  id: string | number;
  firstname?: string;
  first_name?: string;
  lastname?: string;
  last_name?: string;
  email?: string;
  department?: string;
}> {
  try {
    return await apiClient.get(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error;
    }

    return apiClient.get(`/api/v1/staff/${id}`);
  }
}

/**
 * Fetches all vacation requests, optionally filtered by status and/or
 * employee name search term.
 *
 * GET /human-resources/vacation-management[?status=pending&status=approved&search=term]
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
    API_ENDPOINTS.VACATIONS.HR.LIST,
    { query: queryParams }
  );
  return rawList.map(toVacationRequest);
}

/**
 * Approves a vacation request.
 *
 * PATCH /human-resources/vacation-management/:id { status: approved }
 */
export async function approveVacationRequest(
  id: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.patch<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.HR.UPDATE(id),
    // Backend currently expects "accepted" while frontend normalizes it to "approved".
    { status: "accepted" }
  );
  return toVacationRequest(raw);
}

/**
 * Rejects a vacation request with a mandatory rejection reason.
 *
 * PATCH /human-resources/vacation-management/:id { status: rejected, rejection_reason }
 */
export async function rejectVacationRequest(
  id: string,
  reason: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.patch<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.HR.UPDATE(id),
    {
      status: VACATION_STATUS.REJECTED,
      rejection_reason: reason,
    }
  );
  return toVacationRequest(raw);
}

/**
 * Reverts a vacation request back to pending status.
 *
 * PATCH /human-resources/vacation-management/:id { status: pending }
 */
export async function setVacationRequestPending(
  id: string
): Promise<VacationRequest | null> {
  const raw = await apiClient.patch<BackendVacationRequest>(
    API_ENDPOINTS.VACATIONS.HR.UPDATE(id),
    { status: VACATION_STATUS.PENDING }
  );
  return toVacationRequest(raw);
}
