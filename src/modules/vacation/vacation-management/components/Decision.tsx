import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../../../../ui/core/Button";
import { Modal } from "../../../../ui/core/Modal";
import { Textarea } from "../../../../ui/core/Textarea";
import { VACATION_STATUS } from "../../../../core/constants";
import type { VacationRequest } from "../../types";
import { ErrorMessage } from "../../../../core/components/feedback/ErrorMessage";

// Temporary backend compatibility flag.
// Backend currently does not allow editing/reverting already approved/rejected decisions.
const ENABLE_DECISION_EDIT = false;

interface DecisionProps {
  request: VacationRequest;
  approveRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
  setRequestPending: (id: string) => Promise<void>;
}

const Decision: React.FC<DecisionProps> = ({
  request,
  approveRequest,
  rejectRequest,
  setRequestPending,
}) => {
  const [mode, setMode] = useState<"deciding" | "approved" | "rejected">(
    request.status === VACATION_STATUS.APPROVED
      ? "approved"
      : request.status === VACATION_STATUS.REJECTED
      ? "rejected"
      : "deciding"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState(request.rejectionReason ?? "");
  const [reasonError, setReasonError] = useState("");
  const [actionError, setActionError] = useState("");

  const handleApprove = async () => {
    try {
      setActionError("");
      await approveRequest(request.id);
      setMode("approved");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to approve request.";
      setActionError(message);
    }
  };

  const openRejectModal = () => {
    setReason(request.rejectionReason ?? "");
    setReasonError("");
    setIsModalOpen(true);
  };

  const handleConfirmReject = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setReasonError("Rejection reason is required.");
      return;
    }

    try {
      setActionError("");
      await rejectRequest(request.id, trimmed);
      setIsModalOpen(false);
      setMode("rejected");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reject request.";
      setActionError(message);
    }
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setReasonError("");
  };

  return (
    <>
      <section className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-primary">Decision</h3>
        </div>

        <div className="rounded-[30px] bg-card px-10 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          {mode === "deciding" && (
            <div className="mx-auto flex w-full max-w-[540px] items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="flex-1 rounded-[30px] bg-[var(--status-approved)] text-white hover:bg-emerald-600 h-[54px] justify-center"
                onClick={handleApprove}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold tracking-wide">APPROVE</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="flex-1 rounded-[30px] border border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive h-[54px] justify-center"
                onClick={openRejectModal}
              >
                <XCircle className="h-5 w-5" />
                <span className="font-semibold tracking-wide">REJECT</span>
              </Button>
            </div>
          )}

          {mode === "approved" && (
            <div className="mx-auto flex w-full max-w-[540px] items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="flex-[2] rounded-[30px] bg-[var(--status-approved)] text-white h-[54px] justify-center pointer-events-none"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold tracking-wide">APPROVED</span>
              </Button>

              {ENABLE_DECISION_EDIT && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="flex-[0.5] rounded-[30px] border border-border text-primary hover:bg-muted h-[54px] justify-center"
                  onClick={async () => {
                    try {
                      setActionError("");
                      await setRequestPending(request.id);
                      setMode("deciding");
                    } catch (err) {
                      const message =
                        err instanceof Error
                          ? err.message
                          : "Failed to reopen decision.";
                      setActionError(message);
                    }
                  }}
                >
                  <span className="font-semibold tracking-wide">EDIT</span>
                </Button>
              )}
            </div>
          )}

          {mode === "rejected" && (
            <div className="mx-auto flex w-full max-w-[540px] items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="flex-[2] rounded-[30px] bg-destructive text-destructive-foreground h-[54px] justify-center pointer-events-none"
              >
                <XCircle className="h-5 w-5" />
                <span className="font-semibold tracking-wide">REJECTED</span>
              </Button>

              {ENABLE_DECISION_EDIT && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="flex-[0.5] rounded-[30px] border border-border text-primary hover:bg-muted h-[54px] justify-center"
                  onClick={async () => {
                    try {
                      setActionError("");
                      await setRequestPending(request.id);
                      setMode("deciding");
                    } catch (err) {
                      const message =
                        err instanceof Error
                          ? err.message
                          : "Failed to reopen decision.";
                      setActionError(message);
                    }
                  }}
                >
                  <span className="font-semibold tracking-wide">EDIT</span>
                </Button>
              )}
            </div>
          )}

          {actionError && (
            <ErrorMessage
              variant="inline"
              message={actionError}
              className="mt-4"
            />
          )}
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onClose={handleCancelModal}
        title="Decision"
        size="xl"
        footer={
          <div className="flex w-full gap-3">
            <Button
              type="button"
              className="flex-1 rounded-[10px] bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 justify-center"
              onClick={handleConfirmReject}
            >
              CONFIRM REJECTION
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-[10px] border border-border bg-card text-muted-foreground hover:bg-muted h-11 justify-center"
              onClick={handleCancelModal}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary">
            Rejection Reason <span className="text-destructive">*</span>
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            className="min-h-[140px]"
          />
          {reasonError && (
            <p className="text-xs text-destructive mt-1">{reasonError}</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Decision;
