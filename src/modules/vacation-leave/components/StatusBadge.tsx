import type { VacationRequest } from "../../../core/mocks/data";

type VacationStatus = VacationRequest["status"];

const STATUS_CLASSES: Record<VacationStatus, string> = {
  pending:  "bg-warning/15 text-warning",
  approved: "bg-success/15 text-secondary",
  rejected: "bg-destructive/15 text-destructive",
  canceled: "bg-info/15 text-info",
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