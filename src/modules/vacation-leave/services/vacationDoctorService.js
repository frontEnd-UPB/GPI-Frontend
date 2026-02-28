import {
  mockVacationBalances,
  mockVacationRequests,
  mockEmployees,
} from "../../../core/mocks/data";

const USE_MOCKS = true;

export async function getVacationBalance(doctorId) {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const balance = mockVacationBalances.find((b) => b.employeeId === doctorId);
    return balance;
  }
}

/**
 * Adds a new vacation request to the mock store and updates the employee's
 * balance (used / available) immediately.
 *
 * @param {string} employeeId
 * @param {{ startDate: Date, endDate: Date, type: string, comment: string, attachment: File|null }} submitData
 */
export async function submitVacationRequest(employeeId, submitData) {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const { startDate, endDate, type, comment } = submitData;

    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required.");
    }

    const days =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const employee = mockEmployees.find((e) => e.id === employeeId);
    const employeeName = employee?.name ?? "Unknown";

    const newRequest = {
      id: String(Date.now()),
      employeeId,
      employeeName,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      days,
      reason: type,
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
      comment: comment ?? "",
    };

    mockVacationRequests.push(newRequest);

    // Update in-memory balance
    const balanceIndex = mockVacationBalances.findIndex(
      (b) => b.employeeId === employeeId
    );
    if (balanceIndex !== -1) {
      const prev = mockVacationBalances[balanceIndex];
      mockVacationBalances[balanceIndex] = {
        ...prev,
        used: prev.used + days,
        available: Math.max(prev.available - days, 0),
      };
    }

    return newRequest;
  }
}