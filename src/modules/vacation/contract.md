# Vacation Leave API Contract (Frontend Source of Truth)

This document defines the backend contract required by the vacation-leave frontend module.

Related module contract:
- Authentication: [../authentication/contract.md](../authentication/contract.md)

Scope:
- Use backend route naming convention already discussed.
- Preserve current frontend behavior without reducing UX features.
- Staff ID in backend is the same identity used as employee ID in frontend.

## 1. Goals

1. Keep endpoint naming under:
  - /api/v1/myprofile/requestvacation (employee/self-service)
  - /api/v1/human-resources/vacation-management (HR/moderation)
2. Keep API payloads and responses aligned with current frontend usage.
3. Ensure all create/update/cancel/moderation endpoints return a full vacation request object.
4. Avoid frontend workarounds by making backend fields complete and stable.

## 2. Canonical Models

### 2.1 VacationRequest (API response, snake_case)

Required fields in all list/detail/mutation responses:

- id: string
- staff_id: string
- start_date: string (YYYY-MM-DD)
- end_date: string (YYYY-MM-DD)
- reason: string
- status: pending | approved | rejected | cancelled
- request_date: string (YYYY-MM-DD)
- comment: string | null
- rejection_reason: string | null
- attachment_url: string | null
- attachment_name: string | null

Notes:
- staff_id maps to frontend employeeId.
- If DB id is numeric, API should serialize id as string.
- Even when attachment is not used, return attachment_url and attachment_name as null (do not omit keys).

Compatibility notes implemented in frontend services:
- Frontend accepts either staff_id (preferred) or employee_id in responses.
- Frontend normalizes status accepted -> approved.
- Frontend tolerates reason: null and will map it to an empty string for UI.
- Frontend tolerates missing request_date and falls back to start_date in UI.

### 2.2 VacationBalance

- assigned: number
- used: number
- available: number

## 3. Endpoint Contract

## 3.1 Employee Endpoints

### GET /api/v1/myprofile/requestvacation/{staff_id}

Purpose:
- List vacation requests for the current employee history table.

Path params:
- staff_id: string (required)

Success:
- 200 OK
- Response: VacationRequest[]

Rules:
- Return all statuses.
- Sort can be done by backend or frontend; backend should preferably return by start_date ascending.

### GET /api/v1/myprofile/requestvacation/{staff_id}/{request_id}

Purpose:
- Fetch single request detail for employee.

Path params:
- staff_id: string
- request_id: string

Success:
- 200 OK
- Response: VacationRequest

Errors:
- 404 Not Found if request does not exist or is not visible to caller.

### POST /api/v1/myprofile/requestvacation

Purpose:
- Create new vacation request.

Query params:
- staff_id: string (required)

Accepted body (application/json):
- staff_id: string (optional compatibility field; query param remains canonical)
- start_date: string (required)
- end_date: string (required)
- reason: string (required)
- comment: string | null (optional)
- status: optional (frontend may send pending for compatibility, backend must ignore client intent and force pending)

Accepted body (multipart/form-data, optional attachment support):
- staff_id (optional compatibility field; query param remains canonical)
- start_date
- end_date
- reason
- comment (optional)
- attachment (optional file)

Success:
- 201 Created
- Response: VacationRequest

Rules:
- status must be pending at creation time.
- request_date should be set by backend.

### PATCH /api/v1/myprofile/requestvacation/{request_id}

Purpose:
- Employee edits an existing pending request.
- This endpoint is required to preserve current frontend edit flow.

Accepted body (application/json):
- start_date: string (optional)
- end_date: string (optional)
- reason: string (required)
- comment: string | null (optional)
- remove_attachment: boolean (optional)
- status: cancelled (optional, if using same endpoint for cancel)

Accepted body (multipart/form-data):
- start_date (optional)
- end_date (optional)
- reason (optional)
- comment (optional)
- attachment (optional file)
- remove_attachment (optional)

Success:
- 200 OK
- Response: VacationRequest

Rules:
- Editing should be allowed only while request is pending (recommended).
- If cancelled is sent here, request status becomes cancelled.

### PATCH /api/v1/myprofile/requestvacation/{request_id}/cancel (recommended explicit cancel)

Purpose:
- Cancel request without mixing with edit payload.

Success:
- 200 OK
- Response: VacationRequest with status cancelled

Alternative:
- If this route is not implemented, PATCH /api/v1/myprofile/requestvacation/{request_id} must support status=cancelled.
- Frontend currently implements this fallback when /cancel responds with 404 (common in mock migration environments).

### GET /api/v1/myprofile/requestvacation/balance/{staff_id}

Purpose:
- Load vacation balance card.

Success:
- 200 OK
- Response: VacationBalance

## 3.2 HR Endpoints

### GET /api/v1/human-resources/vacation-management

Purpose:
- List requests for management views.

Query params:
- status: repeatable enum (optional)
- search: string (optional)

Success:
- 200 OK
- Response: VacationRequest[]

### GET /api/v1/human-resources/vacation-management/{request_id}

Purpose:
- Get request detail for management.

Success:
- 200 OK
- Response: VacationRequest

### PATCH /api/v1/human-resources/vacation-management/{request_id}

Purpose:
- Moderate request status.

Body:
- status: approved | rejected | pending (required)
- rejection_reason: string (required when status=rejected)

Success:
- 200 OK
- Response: VacationRequest

Note:
- 206 is not recommended for this operation; use 200.

## 4. Status and Mapping Rules

Canonical status values required by frontend:
- pending
- approved
- rejected
- cancelled

Compatibility requirement:
- If backend currently stores accepted, it must either:
  1. Return approved at API boundary, or
  2. Provide explicit migration commitment and stable mapping.

## 5. Validation Rules

Backend must enforce:
1. start_date cannot be in the past for new/edited employee requests.
2. end_date must be greater than or equal to start_date.
3. Requested days cannot exceed available balance.
4. Reject invalid status transitions (for example cancelled to approved).
5. If attachment support is enabled:
   - allowed extensions: .pdf, .jpg, .jpeg, .png, .doc, .docx
   - max file size: 5 MB

## 6. Error Contract

Error body format:
- Return JSON with at least one of:
  - message: string
  - error: string

Recommended HTTP codes:
- 400 Bad Request: malformed input
- 401 Unauthorized: missing/invalid auth
- 403 Forbidden: role or ownership violation
- 404 Not Found: unknown request id
- 409 Conflict: invalid transition/state conflict
- 413 Payload Too Large: attachment too large
- 415 Unsupported Media Type: invalid file type/content type
- 422 Unprocessable Entity: business rule validation error

## 7. Response Completeness Rule

For all mutation endpoints (create/update/cancel/moderate), response must include full VacationRequest object, not partial payloads.

Reason:
- Frontend updates local state directly from mutation responses and expects full object shape.

## 8. Minimum Backend-Frontend Acceptance Checklist

1. Employee can create, list, edit, and cancel requests using /api/v1/myprofile/requestvacation routes.
2. HR can list/detail/moderate through /api/v1/human-resources/vacation-management routes.
3. All responses include full canonical fields.
4. status values are frontend-compatible.
5. Error responses include message or error.
6. Balance endpoint returns assigned/used/available.

## 9. Implementation Priority

Phase 1 (blocking for frontend integration):
1. Employee list/create/detail/update/cancel
2. Canonical VacationRequest response shape
3. Status compatibility
4. Error contract

Phase 2:
1. Attachment upload support on create/update
2. Strong transition matrix and audit logging
3. Search/filter optimization in HR list

## 10. Notes for Team Alignment

- Frontend is the source of truth for required behavior.
- Route naming should follow backend convention, but behavior and data shape cannot regress.
- Any temporary backend limitation must be explicit and not silently drop fields.
