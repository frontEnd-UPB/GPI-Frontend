import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../../ui/core/Button";
import { VACATION_STATUS } from "../../../core/constants";
import type { VacationRequest } from "../../../core/mocks/data";

const statusStyles: Record<
  string,
  { container: string; text: string; label: string }
> = {
  [VACATION_STATUS.PENDING]: {
    container: "bg-status-pending-foreground",
    text: "text-status-pending",
    label: "Pending",
  },
  [VACATION_STATUS.APPROVED]: {
    container: "bg-status-approved-foreground",
    text: "text-status-approved",
    label: "Approved",
  },
  [VACATION_STATUS.REJECTED]: {
    container: "bg-status-rejected-foreground",
    text: "text-status-rejected",
    label: "Denied",
  },
  [VACATION_STATUS.CANCELLED]: {
    container: "bg-status-canceled-foreground",
    text: "text-status-canceled",
    label: "Canceled",
  },
};

const getStatusStyles = (status: string) => {
  return statusStyles[status] ?? statusStyles[VACATION_STATUS.PENDING];
};

interface VacationRequestDetailsProps {
  request: VacationRequest;
}

export const VacationRequestDetails: React.FC<
  VacationRequestDetailsProps
> = ({ request }) => {
  const status = getStatusStyles(request.status);

  return (
    <div className="space-y-6">
      {/* Dates summary */}
      <div className="grid gap-4 rounded-[14px] border border-primary/10 bg-primary/5 px-6 py-5 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Start Date
            </p>
            <p className="text-lg font-semibold text-primary">
              {request.startDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              End Date
            </p>
            <p className="text-lg font-semibold text-primary">
              {request.endDate}
            </p>
          </div>
        </div>
      </div>

      {/* Type & Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary">Type</p>
          <div className="flex h-11 items-center rounded-[10px] border border-border bg-input-background px-4 text-sm text-muted-foreground">
            {request.reason}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary">
            Current Status
          </p>

          <div
            className={`
              inline-flex
              items-center
              justify-center
              px-5
              py-2
              rounded-full
              ${status.container}
            `}
          >
            <span
              className={`
                text-m
                font-semibold
                ${status.text}
              `}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-primary">
          Comment (Optional)
        </p>
        <div className="min-h-[96px] rounded-[10px] border border-border bg-input-background px-4 py-3 text-sm text-muted-foreground">
          {request.comment ?? "No additional comments provided."}
        </div>
      </div>

      {/* Rejection reason */}
      {request.rejectionReason && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary">
            Rejection reason
          </p>
          <div className="min-h-[64px] rounded-[14px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {request.rejectionReason}
          </div>
        </div>
      )}

      {/* Attachment */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-primary">
          Attach Document (if applicable)
        </p>
        <div className="flex items-center justify-between rounded-[10px] border border-border bg-input-background px-4 py-3 text-sm text-muted-foreground">
          {request.attachmentUrl ? (
            <>
              <span className="mr-4 truncate">
                {request.attachmentUrl}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  window.open(
                    request.attachmentUrl!,
                    "_blank",
                    "noreferrer"
                  );
                }}
              >
                View document
              </Button>
            </>
          ) : (
            <span>No file Attached</span>
          )}
        </div>
      </div>
    </div>
  );
};