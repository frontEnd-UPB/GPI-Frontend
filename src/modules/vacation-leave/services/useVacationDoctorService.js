import { mockVacationBalances } from "../../../core/mocks/data";

const USE_MOCKS = true;

export async function getVacationBalance(doctorId) {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const balance = mockVacationBalances.find((b) => b.employeeId === doctorId);
    return balance;
  }
}