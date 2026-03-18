# Authentication API Contract (Frontend Source of Truth)

This document defines the backend contract required by the authentication frontend module.

Scope:
- Staff sign-in and current-user hydration used by authApi/authModuleService.
- Session persistence behavior expected by frontend.
- Forgot/reset flow currently implemented with mockBackendAuth (local dev behavior), documented to ease backend replacement.

## 1. Goals

1. Keep auth endpoint behavior aligned with frontend services.
2. Prevent regressions in login/session restoration flows.
3. Document real HTTP endpoints separately from mock-only recovery flow.
4. Keep payloads and error semantics stable during backend migration.

## 2. Canonical Models

### 2.1 StaffLoginResponse (API response)

- id: string
- name: string
- role: admin | doctor

Notes:
- Frontend lowercases role and validates it is admin or doctor.
- Frontend creates a synthetic token mockoon-session-${id} for session persistence.

### 2.2 EmployeeProfileResponse (API response)

- id: string
- firstname: string
- lastname: string
- email: string
- role: admin | doctor
- profilePicture: string | null (optional field, defaults to null in frontend)

Notes:
- Frontend builds full name as firstname + lastname.

### 2.3 Session Storage Contract (frontend)

- meddical:user: serialized AuthUser
- meddical:token: session token (currently synthetic)

Behavior:
- On sign-in success, frontend stores base session immediately.
- Frontend then hydrates latest profile via GET /api/employees/{id}.
- If hydration returns 401 or 404, frontend clears session.

## 3. Endpoint Contract

### 3.1 Staff Login (real HTTP)

### POST /api/auth/login

Purpose:
- Authenticate staff user and return core identity payload.

Request body:
- email: string (required)
- password: string (required)

Success:
- 200 OK
- Response: StaffLoginResponse

Errors:
- 400 Bad Request when email/password missing
- 401 Unauthorized when credentials are invalid

Rules:
- No Authorization header required for this endpoint.
- role must be one of admin or doctor for frontend compatibility.

### 3.2 Current User Hydration (real HTTP)

### GET /api/employees/{id}

Purpose:
- Fetch current user profile right after login and on session restoration.

Path params:
- id: string

Success:
- 200 OK
- Response: EmployeeProfileResponse

Errors:
- 401 Unauthorized
- 404 Not Found

Rules:
- Response must include fields required to build AuthUser.
- Frontend treats 401/404 as auth-invalidating errors and clears session.

### 3.3 Password Recovery (mock-only for current frontend behavior)

These operations are currently handled by mockBackendAuth (local storage simulation), not by authApi HTTP calls yet.

### POST /forgot_password

Request body:
- email: string
- from: patient | doctor (frontend source context)

Current expected behavior:
- Returns success boolean and message.
- May include token in dev/mock mode.

### POST /validate_reset_token

Request body:
- token: string

Current expected behavior:
- Returns success boolean and message.
- On success returns associated email and source context.

### POST /reset_password

Request body:
- token: string
- newPassword: string

Current expected behavior:
- Returns success boolean and message.

## 4. Error Contract

Error body should include at least one of:
- message: string
- error: string

Recommended status codes:
- 400 malformed input
- 401 unauthorized
- 403 forbidden
- 404 not found
- 409 conflict
- 422 business validation error

## 5. Integration Notes

1. authApi currently uses /api/auth/login and /api/employees/{id}.
2. forgot/reset services are mock-backed and can be replaced by HTTP endpoints preserving the same response shape.
3. Frontend maps login API errors to user-facing messages:
- 400 -> Email and password are required
- 401 -> Invalid email or password
