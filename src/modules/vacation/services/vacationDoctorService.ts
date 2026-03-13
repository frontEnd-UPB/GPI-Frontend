import {
  mockEmployees,
  type VacationRequest,
} from "../../../core/mocks/data";
import {
  type VacationBalance,
  computeVacationBalanceForEmployee,
} from "../../../core/constants";
import { VACATION_STATUS } from "../../../core/constants";
import {
  createVacationRequestId,
  getVacationRequestsSnapshot,
  setVacationRequestsSnapshot,
} from "../../../core/services/mockVacationRequestsStore";

const USE_MOCKS = true;

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function buildAttachment(file?: File | null) {
  if (!file) {
    return {
      attachmentUrl: null,
      attachmentName: null,
    };
  }

  const attachmentUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to encode attachment."));
    };

    reader.onerror = () => reject(new Error("Failed to read attachment."));
    reader.readAsDataURL(file);
  });

  return {
    attachmentUrl,
    attachmentName: file.name,
  };
}

export async function getVacationBalance(
  employeeId: string
): Promise<VacationBalance | null> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const employee = mockEmployees.find((e) => e.id === employeeId);
  if (!employee) return null;

  return computeVacationBalanceForEmployee(employee, getVacationRequestsSnapshot());
}

export interface SubmitVacationData {
  startDate: Date;
  endDate: Date;
  reason: string;
  comment?: string;
  attachment?: File | null;
}

export async function listEmployeeVacationRequests(
  employeeId: string
): Promise<VacationRequest[]> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  return getVacationRequestsSnapshot()
    .filter((request) => request.employeeId === employeeId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function submitVacationRequest(
  employeeId: string,
  submitData: SubmitVacationData
): Promise<VacationRequest> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const { startDate, endDate, reason, comment, attachment } = submitData;

  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required.");
  }

  const nextAttachment = await buildAttachment(attachment);

  const newRequest: VacationRequest = {
    id: createVacationRequestId(),
    employeeId,
    startDate: toLocalIsoDate(startDate),
    endDate: toLocalIsoDate(endDate),
    reason,
    status: VACATION_STATUS.PENDING,
    requestDate: toLocalIsoDate(new Date()),
    comment: comment ?? null,
    attachmentUrl: nextAttachment.attachmentUrl,
    attachmentName: nextAttachment.attachmentName,
  };

  setVacationRequestsSnapshot([...getVacationRequestsSnapshot(), newRequest]);

  return newRequest;
}

export interface UpdateVacationRequestData {
  startDate?: Date;
  endDate?: Date;
  reason: string;
  comment?: string;
  attachment?: File | null;
  removeAttachment?: boolean;
}

export async function updateVacationRequest(
  requestId: string,
  updates: UpdateVacationRequestData
): Promise<VacationRequest | null> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const currentRequests = getVacationRequestsSnapshot();
  const requestIndex = currentRequests.findIndex(
    (request) => request.id === requestId
  );

  if (requestIndex === -1) return null;

  const existing = currentRequests[requestIndex];
  const shouldReplaceAttachment = Boolean(updates.attachment);
  const shouldRemoveAttachment = updates.removeAttachment === true;
  const nextAttachment = shouldReplaceAttachment
    ? await buildAttachment(updates.attachment)
    : shouldRemoveAttachment
      ? { attachmentUrl: null, attachmentName: null }
      : {
          attachmentUrl: existing.attachmentUrl,
          attachmentName: existing.attachmentName ?? null,
        };

  const updated: VacationRequest = {
    ...existing,
    startDate: updates.startDate
      ? toLocalIsoDate(updates.startDate)
      : existing.startDate,
    endDate: updates.endDate
      ? toLocalIsoDate(updates.endDate)
      : existing.endDate,
    reason: updates.reason,
    comment: updates.comment ?? existing.comment,
    status: VACATION_STATUS.PENDING,
    attachmentUrl: nextAttachment.attachmentUrl,
    attachmentName: nextAttachment.attachmentName,
  };

  const nextRequests = [...currentRequests];
  nextRequests[requestIndex] = updated;
  setVacationRequestsSnapshot(nextRequests);

  return updated;
}

export async function cancelVacationRequest(
  requestId: string
): Promise<VacationRequest | null> {
  if (!USE_MOCKS) {
    throw new Error("Real API not implemented.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const currentRequests = getVacationRequestsSnapshot();
  const requestIndex = currentRequests.findIndex(
    (request) => request.id === requestId
  );

  if (requestIndex === -1) return null;

  const existing = currentRequests[requestIndex];

  const updated: VacationRequest = {
    ...existing,
    status: VACATION_STATUS.CANCELLED,
  };

  const nextRequests = [...currentRequests];
  nextRequests[requestIndex] = updated;
  setVacationRequestsSnapshot(nextRequests);

  return updated;
}
