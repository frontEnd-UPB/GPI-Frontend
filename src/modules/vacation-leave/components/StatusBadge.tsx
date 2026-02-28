import type { VacationRequest } from "../../../core/mocks/data";

type VacationStatus = VacationRequest["status"];

const statusStyles: Record<
  VacationStatus,
  { backgroundColor: string; color: string }
> = {
  pending: {
    backgroundColor: "#FFF9C4",
    color: "#F9A825",
  },
  approved: {
    backgroundColor: "#C8E6C9",
    color: "#2E7D32",
  },
  rejected: {
    backgroundColor: "#FFCDD2",
    color: "#C62828",
  },
};

interface StatusBadgeProps {
  status: VacationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        padding: "4px 16px",
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "0.85rem",
        display: "inline-block",
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}