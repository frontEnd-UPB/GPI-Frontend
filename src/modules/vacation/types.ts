import { VACATION_STATUS } from "../../core/constants";

export type VacationRequestStatus =
  (typeof VACATION_STATUS)[keyof typeof VACATION_STATUS];

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  rejectionReason?: string | null;
  reason: string;
  status: VacationRequestStatus;
  requestDate: string;
  comment: string | null;
  attachmentUrl: string | null;
  attachmentName?: string | null;
}

export interface VacationEmployeeProfile {
  firstname: string;
  lastname: string;
  department?: string;
  role?: string;
  specialty?: string;
  profilePicture?: string | null;
}