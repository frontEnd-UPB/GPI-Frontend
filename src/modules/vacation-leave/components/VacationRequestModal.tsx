import { Modal } from "../../../ui/core/Modal";
import StatusBadge from "./StatusBadge";
import DateRangeDisplay from "./DateRangeDisplay";
import type { VacationRequest } from "../../../core/mocks/data";
import { theme } from "../../../core/theme";


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
  const { colors, spacing, radius, typography } = theme;

  if (!vacation) return null;

  const isPending = vacation.status === "pending";
  const isRejected = vacation.status === "rejected";

  const handleCancel = () => {
    onCancelRequest(vacation.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Vacation Leave Request" size="lg">
      
      {/* Date Range */}
      <DateRangeDisplay
        startDate={vacation.startDate}
        endDate={vacation.endDate}
      />

      {/* Type + Status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: spacing.xl,
          flexWrap: "wrap",
        }}
      >
        {/* Type */}
        <div>
          <div
            style={{
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.semiBold,
              color: colors.primaryDark,
              marginBottom: spacing.xs,
            }}
          >
            Type
          </div>

          <div
            style={{
              fontSize: typography.fontSize.md,
              color: colors.textPrimary,
            }}
          >
            Vacation Leave
          </div>
        </div>

        {/* Status */}
        <div>
          <div
            style={{
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.semiBold,
              color: colors.primaryDark,
              marginBottom: spacing.xs,
            }}
          >
            Current Status
          </div>

          <StatusBadge status={vacation.status} />
        </div>
      </div>

      {/* Comment */}
      <div style={{ marginBottom: spacing.xl }}>
        <div
          style={{
            fontSize: typography.fontSize.sm,
            fontFamily: typography.fontFamily.semiBold,
            color: colors.primaryDark,
            marginBottom: spacing.sm,
          }}
        >
          Comment (Optional)
        </div>

        <textarea
          placeholder="Add comment..."
          disabled={!isPending}
          style={{
            width: "100%",
            minHeight: 90,
            borderRadius: radius.md,
            border: `1px solid ${colors.border}`,
            padding: spacing.md,
            resize: "none",
            fontSize: typography.fontSize.sm,
            color: colors.textPrimary,
            backgroundColor: isPending ? colors.surface : colors.background,
          }}
        />
      </div>

      {/* Pending Buttons */}
      {isPending && (
        <div
          style={{
            display: "flex",
            gap: spacing.md,
          }}
        >
          <button
            style={{
              backgroundColor: colors.secondary,
              color: colors.textOnPrimary,
              padding: `${spacing.sm}px ${spacing.lg}px`,
              borderRadius: radius.md,
              border: "none",
              cursor: "pointer",
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.fontSize.sm,
            }}
          >
            Resend
          </button>

          <button
            onClick={handleCancel}
            style={{
              backgroundColor: colors.error,
              color: colors.textOnPrimary,
              padding: `${spacing.sm}px ${spacing.lg}px`,
              borderRadius: radius.md,
              border: "none",
              cursor: "pointer",
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.fontSize.sm,
            }}
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Rejected message */}
      {isRejected && (
        <div
          style={{
            marginTop: spacing.sm,
            backgroundColor: "#fdecea",
            color: colors.error,
            padding: spacing.md,
            borderRadius: radius.md,
            fontSize: typography.fontSize.sm,
          }}
        >
          Rejection Reason: Insufficient staff
        </div>
      )}
    </Modal>
  );
}