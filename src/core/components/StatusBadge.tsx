import { VACATION_STATUS } from "../constants";

type Status = (typeof VACATION_STATUS)[keyof typeof VACATION_STATUS];

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<Status, { bg: string; text: string; label: string }> = {
    [VACATION_STATUS.PENDING]: {
      bg: "bg-status-pending-foreground",
      text: "text-status-pending",
      label: "Pending",
    },
    [VACATION_STATUS.APPROVED]: {
      bg: "bg-status-approved-foreground",
      text: "text-status-approved",
      label: "Approved",
    },
    [VACATION_STATUS.CANCELLED]: {
      bg: "bg-status-canceled-foreground",
      text: "text-status-canceled",
      label: "Canceled",
    },
    [VACATION_STATUS.REJECTED]: {
      bg: "bg-status-rejected-foreground",
      text: "text-status-rejected",
      label: "Rejected",
    },
  };

  const style = styles[status];

  return (
    <div
      className={`inline-flex items-center justify-center h-[28px] px-4 rounded-[15px] ${style.bg}`}
    >
      <p className="font-medium text-sm">
        <span className={style.text}>{style.label}</span>
      </p>
    </div>
  );
}
