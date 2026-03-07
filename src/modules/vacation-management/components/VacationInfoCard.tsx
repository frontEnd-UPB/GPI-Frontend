import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Clock, Paperclip } from "lucide-react";
import { VACATION_STATUS, formatDisplayDate } from "../../../core/constants";
import type { VacationRequest } from "../../../core/mocks/data";

interface VacationInfoCardProps {
  doctorName: string;
  department?: string;
  doctorRole?: string;
  avatarUrl?: string;
  status?: string;
  request: VacationRequest;
}

export function VacationInfoCard({
  doctorName,
  department,
  employeeFunction,
  status,
  doctorRole,
  avatarUrl,
  request,
}: VacationInfoCardProps & { employeeFunction?: string }) {
  // All domain data comes from the vacation request (mocks)
  const typeValue = request.reason;
  const submittedDateValue = formatDisplayDate(request.requestDate);
  const fromDateValue = formatDisplayDate(request.startDate);
  const toDateValue = formatDisplayDate(request.endDate);
  const totalDaysValue = (() => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  })();
  const hasComment = Boolean(request.comment && request.comment.trim());
  const hasAttachment = Boolean(request.attachmentUrl);
  const messageValue = request.comment?.trim() ?? "";
  // Normalize name if it already contains a Dr. prefix
  const baseName = doctorName.replace(/^Dr\.?\s+/i, "");
  const displayName = employeeFunction
    ? employeeFunction === "Doctor"
      ? `Dr. ${baseName}`
      : baseName
    : doctorName;

  // Status styles copied from VacationRequestDetails
  const statusStyles: Record<string, { container: string; text: string; label: string }> = {
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

  const getStatusStyles = (s?: string) => {
    return (s && statusStyles[s]) || statusStyles[VACATION_STATUS.PENDING];
  };

  const currentStatus = getStatusStyles(status);

  return (
    <Card className="max-w-[1100px] mx-auto p-8 bg-card rounded-[32px] shadow-[0_10px_40px_rgba(15,23,42,0.08)] border border-border/40 overflow-hidden relative">
      <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-start md:gap-10">
        {/* Left Content */}
        <div className="flex-1 space-y-7">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                {displayName}
              </h2>
              {status && (
                <div
                  className={`inline-flex items-center self-center rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase ${currentStatus.container}`}
                >
                  <span className={currentStatus.text}>{status}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-secondary hover:bg-secondary text-secondary-foreground px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase">
                {doctorRole}
              </Badge>
              <span className="text-base text-primary font-medium ">
                {department}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 md:gap-y-4">
            <div className="space-y-0.5">
              <p className="text-md text-primary font-semibold opacity-60">Type</p>
              <p className="text-lg text-primary font-bold">{typeValue}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-md text-primary font-semibold opacity-60">Submitted Date</p>
              <p className="text-lg text-primary font-bold">{submittedDateValue}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-base text-primary font-semibold opacity-60">From</p>
              <p className="text-xl text-primary font-bold">{fromDateValue}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-base text-primary font-semibold opacity-60">To</p>
              <p className="text-xl text-primary font-bold">{toDateValue}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50">
              <Clock className="w-7 h-7 text-secondary" />
            </div>
            <div className="space-y-1">
              <p className="text-base text-primary font-semibold opacity-60 leading-none">Total Days</p>
              <p className="text-2xl text-primary font-bold leading-none">{totalDaysValue} Days</p>
            </div>
          </div>
          
          {/* Decorative bar with theme colors */}
          <div className="mt-6 h-2 w-full flex gap-0.1">
            <div className="flex-1 bg-muted rounded-full"></div>
            <div className="flex-[2] bg-primary rounded-full"></div>
            <div className="flex-1 bg-info rounded-full"></div>
          </div>
        </div>

        {/* Right Content - Profile Card */}
        <div className="w-full max-w-[230px] self-center rounded-[20px] border border-border/30 bg-card shadow-md overflow-hidden flex flex-col md:self-start">
          <div className="h-52 overflow-hidden bg-muted">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={doctorName}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-4 text-center space-y-1">
            <p className="text-primary font-bold text-sm uppercase">{baseName}</p>
            <p className="text-secondary font-bold text-xs uppercase tracking-wider">
              {department}
            </p>
          </div>
        </div>
      </div>

      {(hasComment || hasAttachment) && (
        <>
          {hasComment && (
            <div className="mt-1 p-6 border border-border rounded-[16px]">
              <p className="text-primary text-base leading-relaxed whitespace-pre-line opacity-80">
                {messageValue}
              </p>
            </div>
          )}
          {hasAttachment && (
            <div className="mt-1">
              <div className="flex items-center gap-3 rounded-[16px] border border-border bg-card px-4 py-3">
                <span className="inline-flex h-5 w-5 items-center justify-center text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                </span>
                <a
                  href={request.attachmentUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info font-medium hover:underline"
                >
                  {request.attachmentUrl?.split("/").pop() ?? "View document"}
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
