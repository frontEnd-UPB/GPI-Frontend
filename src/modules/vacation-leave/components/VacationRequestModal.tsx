import { Modal } from "../../../ui/core/Modal";
import StatusBadge from "./StatusBadge";
import DateRangeDisplay from "./DateRangeDisplay";
import type { VacationRequest } from "../../../core/mocks/data";

interface VacationRequestModalProps {
  open: boolean;
  onClose: () => void;
  vacation: VacationRequest | null;
  onCancelRequest: (id: string) => void;
}

export default function VacationRequestModal({
  open,
  onClose,
  vacation,
  onCancelRequest,
}: VacationRequestModalProps) {
  if (!vacation) return null;

  const isPending = vacation.status === "pending";
  const isRejected = vacation.status === "rejected";

  const handleCancel = () => {
    onCancelRequest(vacation.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Vacation Leave Request" size="xl">

      {/* Date Range */}
      <DateRangeDisplay
        startDate={vacation.startDate}
        endDate={vacation.endDate}
      />

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-lg mb-xl">
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">Type</p>
          <p className="text-sm text-foreground">{vacation.reason}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">Status</p>
          <StatusBadge status={vacation.status} />
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-2 gap-lg mb-xl">
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">Days Requested</p>
          <p className="text-sm text-foreground">{vacation.days} day{vacation.days !== 1 ? "s" : ""}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">Requested On</p>
          <p className="text-sm text-foreground">{vacation.requestDate}</p>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-xl">
        <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">
          Comment
        </p>
        <textarea
          value={vacation.comment ?? ""}
          placeholder="No comment provided."
          readOnly
          className="w-full min-h-[80px] rounded-md border border-border p-md resize-none text-sm text-muted-foreground bg-background"
        />
      </div>

      {/* Pending Buttons */}
      {isPending && (
        <div className="flex gap-sm">
          <button className="flex-1 bg-secondary text-white py-sm px-lg rounded-md text-sm font-medium cursor-pointer border-0">
            Resend
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-destructive text-white py-sm px-lg rounded-md text-sm font-medium cursor-pointer border-0"
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Rejected message */}
      {isRejected && (
        <div className="bg-destructive/10 text-destructive p-md rounded-md text-sm">
          <span className="font-semibold">Rejection reason:</span> Insufficient staff
        </div>
      )}
    </Modal>
  );
}