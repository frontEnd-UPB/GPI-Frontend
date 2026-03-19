# Vacation Leave Module Flow

This document explains the high-level flow of the Employee Vacation feature.
It focuses on how data moves between page, components, hooks, and services.

Note: this folder mixes direct implementations and adapter files that re-export
shared vacation components/hooks from sibling paths. The runtime flow described
here still applies to the Employee Vacation screen.

## Start Point (Page Orchestrator)

The flow starts in `EmployeeVacationPage`.

Main responsibilities:

- Gets the current authenticated user and employee id.
- Loads initial data using hooks:
  - `useVacationBalance(employeeId)` for assigned/used/available days.
  - `useEmployeeVacationRequests(employeeId)` for the vacation requests list and request actions.
  - `useSubmitVacationRequest(employeeId, onSuccess)` for creating new requests.
- Coordinates UI events:
  - Create new request.
  - Open details modal for a request.
  - Cancel an existing request.
  - Update an existing request.
- Refreshes balance after create, cancel, or update.

Important assumption:

- The page expects a valid authenticated user id (`employeeId`) to drive service calls.

High-level startup flow:

1. Page renders.
2. Balance + request list hooks fetch data.
3. UI shows loaders/errors/empty state/list depending on hook state.
4. User actions trigger hook calls, which call service functions.
5. On success, local state is updated and balance is re-fetched.

---

## Main Component: Balance Status Card

Main component: `VacationBalanceCard`

What it does:

- Receives `balance` from page props.
- Displays three indicators: Assigned, Used, Available.
- Shows skeleton values while balance is still unavailable.

Flow:

1. `EmployeeVacationPage` calls `useVacationBalance(employeeId)`.
2. `useVacationBalance` calls `getVacationBalance(employeeId)` in `vacationDoctorService`.
3. Service returns balance data.
4. Hook stores balance in state.
5. Page passes balance to `VacationBalanceCard`.
6. Card renders the three status metrics.

Refresh behavior:

- When a request is created/cancelled/updated, page calls `refetchBalance()`.
- `useVacationBalance` fetches again.
- Card gets fresh values and re-renders.

---

## Main Component: Request Form

Main components:

- `VacationRequestButton` (controls open/close behavior)
- `VacationRequestForm` (form UI)

Supporting hooks:

- `useVacationRequestForm`
- `useVacationRequestValidation`
- `useSubmitVacationRequest`

What it captures:

- Start date
- End date
- Type of absence (mapped to the `reason` field sent to service)
- Comment
- Optional attachment

Flow from user action to persistence:

1. User clicks "New Vacation Request" in `VacationRequestButton`.
2. Form becomes visible.
3. `VacationRequestForm` delegates form state/submission to `useVacationRequestForm`.
4. `useVacationRequestForm` uses:
   - `react-hook-form` for field state.
   - `useVacationRequestValidation` for date/file validation.
5. On submit, validation checks:
   - start date is not in the past
   - end date is not before start date
   - requested days do not exceed available balance
   - attachment type and size are allowed
6. If valid, page-level submit handler is called through `useSubmitVacationRequest.submit(...)`.
7. `useSubmitVacationRequest` calls `submitVacationRequest(employeeId, payload)` in service.
8. On success:
   - New request is added locally via `addLocally(newRequest)`.
   - Balance is refreshed via `refetchBalance()`.
   - Form resets and closes.

Important design detail:

- The form is mostly controlled by hooks; the page only coordinates what happens after success.

---

## Main Component: Vacation Requests List

Main components:

- `VacationStatusTable` (shows all requests)
- `VacationRequestModal` (view/edit/cancel for a selected request)

Supporting hook:

- `useEmployeeVacationRequests`

What it shows:

- Request rows with start/end/reason/status.
- Pending requests appear first.
- "View" action opens modal with request details.

Read flow:

1. `EmployeeVacationPage` calls `useEmployeeVacationRequests(employeeId)`.
2. Hook runs `listEmployeeVacationRequests(employeeId)` in service.
3. Hook stores list in state.
4. Page passes list to `VacationStatusTable`.
5. Table renders sorted rows and status badges.

Detail/Edit/Cancel flow:

1. User clicks "View" in table.
2. Page stores selected request and opens `VacationRequestModal`.
3. Modal loads selected values into form state.
4. If request is pending, user can enter edit mode and then save changes or cancel.
5. Modal callbacks call page handlers:
   - Cancel path -> `useEmployeeVacationRequests.cancel(id)` -> `cancelVacationRequest(id)` service
   - Update path -> `useEmployeeVacationRequests.update(id, updates)` -> `updateVacationRequest(id, updates)` service
6. On success:
   - Hook updates the request list state in place.
   - Page updates selected request when needed.
   - Page re-fetches balance.

---

## Service Layer Notes

Current wiring in this module:

- `vacation-leave/services/vacationDoctorService.ts` re-exports from shared `modules/vacation/services/vacationLeaveApiService.ts`.
- `vacation-leave/components/VacationRequestModal.tsx` re-exports shared `modules/vacation/components/VacationRequestModal.tsx`.
- `vacation-leave/hooks/useVacationRequestValidation.ts` re-exports shared `modules/vacation/hooks/useVacationRequestValidation.ts`.
- So all vacation-leave hooks call the API-oriented vacation leave service contract.

Service contract used by hooks:

- `getVacationBalance(employeeId)`
- `listEmployeeVacationRequests(employeeId)`
- `submitVacationRequest(employeeId, data)`
- `updateVacationRequest(requestId, updates)`
- `cancelVacationRequest(requestId)`

Additional service behavior currently implemented:

- Backend DTO mapping from snake_case into UI-friendly request objects.
- Status normalization (for example `accepted` -> `approved`).
- Cancel compatibility fallback: if explicit cancel endpoint returns 404,
  service retries with a status patch to `cancelled`.

This keeps UI and hook logic stable while allowing the underlying implementation (mock or real API) to be swapped behind the same function names.

---

## One-Page Mental Model

Use this as a quick summary:

- Start in page: fetch balance + requests.
- Balance card is read-only and renders hook data.
- Request form captures user input, validates in hook, submits via submit hook to service, then updates local list + balance.
- Requests list shows all requests; modal handles view/edit/cancel.
- Edit/cancel actions go: component -> page handler -> request hook -> service -> hook state update -> UI refresh (+ balance refetch).