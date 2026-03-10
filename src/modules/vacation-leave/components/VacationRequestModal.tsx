import { useEffect, useState } from "react";
import { Modal } from "../../../ui/core/Modal";
import StatusBadge from "./StatusBadge";
import DateRangeDisplay from "./DateRangeDisplay";
import type { VacationRequest } from "../../../core/mocks/data";
import { VACATION_STATUS, getVacationDaysBetween, formatDisplayDate } from "../../../core/constants";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Button } from "../../../ui/button";

interface VacationRequestModalProps {
  open: boolean;
  onClose: () => void;
  vacation: VacationRequest | null;
  onCancelRequest: (id: string) => void;
  onResendRequest: (
    id: string,
    updatedReason: string,
    updatedComment: string
  ) => void;
}

export default function VacationRequestModal({
  open,
  onClose,
  vacation,
  onCancelRequest,
  onResendRequest,
}: VacationRequestModalProps) {
  const [editedReason, setEditedReason] = useState("");
  const [editedComment, setEditedComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (vacation) {
      setEditedReason(vacation.reason);
      setEditedComment(vacation.comment ?? "");
      setIsEditing(false);
    }
  }, [vacation]);

  if (!vacation) return null;

  const isPending = vacation.status === VACATION_STATUS.PENDING;
  const isRejected = vacation.status === VACATION_STATUS.REJECTED;

  const handleCancel = () => {
    onCancelRequest(vacation.id);
    onClose();
  };

  const handleResend = () => {
    onResendRequest(vacation.id, editedReason, editedComment);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Vacation Leave Request" size="xl">

      {/* Header actions */}
      {isPending && !isEditing && (
        <div className="flex justify-end mb-md">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit request
          </Button>
        </div>
      )}

      {/* Date Range */}
      <DateRangeDisplay
        startDate={vacation.startDate}
        endDate={vacation.endDate}
      />

      {/* Type + Status */}
      <div className="grid grid-cols-2 gap-lg mb-xl">
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">
            Type
          </p>
          {isPending && isEditing ? (
            <Input
              value={editedReason}
              onChange={(e) => setEditedReason(e.target.value)}
              className="w-full"
            />
          ) : (
            <p className="text-sm text-foreground">{vacation.reason}</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">
            Status
          </p>
          <StatusBadge status={vacation.status} />
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-2 gap-lg mb-xl">
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">
            Days Requested
          </p>
          <p className="text-sm text-foreground">
            {getVacationDaysBetween(vacation.startDate, vacation.endDate)} day
            {getVacationDaysBetween(vacation.startDate, vacation.endDate) !== 1
              ? "s"
              : ""}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">
            Requested On
          </p>
          <p className="text-sm text-foreground">
            {formatDisplayDate(vacation.requestDate)}
          </p>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-xl">
        <p className="text-xs font-semibold text-primary mb-xs uppercase tracking-wide">
          Comment
        </p>
        {isPending && isEditing ? (
          <Textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full min-h-[80px] resize-none text-sm"
          />
        ) : (
          <Textarea
            value={vacation.comment ?? ""}
            readOnly
            className="w-full min-h-[80px] resize-none text-sm bg-background"
          />
        )}
      </div>

      {/* Pending Buttons */}
      {isPending && (
        <div className="flex flex-wrap gap-sm mt-lg">
          {isEditing ? (
            <>
              <Button
                type="button"
                className="flex-1"
                onClick={handleResend}
              >
                Save &amp; resend
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditing(false);
                  if (vacation) {
                    setEditedReason(vacation.reason);
                    setEditedComment(vacation.comment ?? "");
                  }
                }}
              >
                Cancel edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel request
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
            >
              Cancel request
            </Button>
          )}
        </div>
      )}

      {/* Rejected message */}
      {isRejected && (
        <div className="bg-destructive/10 text-destructive p-md rounded-md text-sm">
          <span className="font-semibold">Rejection reason:</span>{" "}
          {vacation.rejectionReason || "No rejection reason provided."}
        </div>
      )}
    </Modal>
  );
}