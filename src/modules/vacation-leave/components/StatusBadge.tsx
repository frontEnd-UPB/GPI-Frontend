import type { VacationRequest } from "../../../core/mocks/data";
import { VACATION_STATUS } from "../../../core/constants";

type VacationStatus = VacationRequest["status"];

const STATUS_CLASSES: Record<VacationStatus, string> = {
  [VACATION_STATUS.PENDING]:
    "bg-status-pending-foreground text-status-pending",
  [VACATION_STATUS.APPROVED]:
    "bg-status-approved-foreground text-status-approved",
  [VACATION_STATUS.REJECTED]:
    "bg-status-rejected-foreground text-status-rejected",
  [VACATION_STATUS.CANCELLED]:
    "bg-status-canceled-foreground text-status-canceled",
};

interface StatusBadgeProps {
  status: VacationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block py-xs px-lg rounded-full font-semibold text-sm capitalize ${STATUS_CLASSES[status]}`}
    >
      {status}
    </span>
  );
}