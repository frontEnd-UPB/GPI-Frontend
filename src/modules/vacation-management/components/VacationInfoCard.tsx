import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Clock } from "lucide-react";
import { VACATION_STATUS } from "../../../core/constants";
import type { VacationRequest } from "../../../core/mocks/data";

interface VacationInfoCardProps {
  doctorName?: string;
  department?: string;
  type?: string;
  submittedDate?: string;
  fromDate?: string;
  toDate?: string;
  totalDays?: number;
  message?: string;
  doctorRole?: string;
  avatarUrl?: string;
  status?: string;
  request?: VacationRequest;
}

export function VacationInfoCard({
  doctorName = "Dr. Alexander Mitchell",
  department = "Neurology",
  employeeFunction,
  status,
  type = "Vacation",
  submittedDate = "01/01/2012",
  fromDate = "15/01/2012",
  toDate = "22/01/2012",
  totalDays = 7,
  message = "I would like to formally request vacation leave. I will ensure that all my tasks and responsibilities are up to date before my leave.\n\nThank you for your consideration.\nBest regards,\n\nDr Alexander Mitchell",
  doctorRole = "CHIEF",
  avatarUrl = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop"
  ,
  request
}: VacationInfoCardProps & { employeeFunction?: string }) {
  // If a `request` is provided prefer its values (mock-driven)
  const typeValue = request ? "Vacation" : type;
  const submittedDateValue = request?.requestDate ?? submittedDate;
  const fromDateValue = request?.startDate ?? fromDate;
  const toDateValue = request?.endDate ?? toDate;
  const totalDaysValue = request?.days ?? totalDays;
  const messageValue = request?.reason ?? message;
  // Normalize name if it already contains a Dr. prefix
  const baseName = doctorName.replace(/^Dr\.?\s+/i, "");
  const displayName = employeeFunction
    ? employeeFunction === "Doctor"
      ? `Dr. ${baseName}`
      : `${baseName} (${employeeFunction})`
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
    <Card className="max-w-[1000px] mx-auto p-8 bg-card rounded-[32px] shadow-lg border-none overflow-hidden relative">
      <div className="flex justify-between items-start gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-primary leading-tight">{displayName}</h2>
                {status && (
                  <div className={`inline-flex items-center self-center px-4 py-1.5 rounded-full ${currentStatus.container}`}>
                    <span className={`text-base font-medium ${currentStatus.text}`}>{status}</span>
                  </div>
                )}
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-secondary hover:bg-secondary text-secondary-foreground px-4 py-0.5 rounded-full text-sm font-bold">
                {doctorRole}
              </Badge>
              <span className="text-lg text-primary font-medium">{department}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <p className="text-base text-primary font-semibold opacity-60">Type</p>
              <p className="text-lg text-primary font-bold">{typeValue}</p>
            </div>
            <div className="space-y-2">
              <p className="text-base text-primary font-semibold opacity-60">Submitted Date</p>
              <p className="text-lg text-primary font-bold">{submittedDateValue}</p>
            </div>
            <div className="space-y-2">
              <p className="text-base text-primary font-semibold opacity-60">From</p>
              <p className="text-lg text-primary font-bold">{fromDateValue}</p>
            </div>
            <div className="space-y-2">
              <p className="text-base text-primary font-semibold opacity-60">To</p>
              <p className="text-lg text-primary font-bold">{toDateValue}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3">
            <div className="w-12 h-12 bg-status-canceled-foreground rounded-2xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div className="space-y-0">
              <p className="text-base text-primary font-semibold opacity-60 leading-none">Total Days</p>
              <p className="text-2xl text-primary font-bold leading-none">{totalDaysValue} Days</p>
            </div>
          </div>
          
          {/* Progress Bar Visual */}
           <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden mt-6">
             <div className="absolute left-0 top-0 h-full w-[40%] bg-primary" />
             <div className="absolute left-[40%] top-0 h-full w-[15%] bg-secondary" />
          </div>
        </div>

        {/* Right Content - Profile Card */}
        <div className="w-56 bg-card rounded-[20px] shadow-md overflow-hidden border border-border/30 flex flex-col">
          <div className="h-40 overflow-hidden">
            <img 
              src={avatarUrl} 
              alt={doctorName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center space-y-1">
            <p className="text-primary font-bold text-sm uppercase">{baseName}</p>
            <p className="text-secondary font-bold text-base uppercase tracking-wider">{department}</p>
          </div>
        </div>
      </div>

      {/* Message Box */}
      <div className="mt-8 p-6 border border-border rounded-[16px]">
        <p className="text-primary text-base leading-relaxed whitespace-pre-line opacity-80">
          {messageValue}
        </p>
      </div>
      {/* Attachment area: show link if attached, otherwise show fallback text */}
      <div className="mt-4 p-4">
        {request?.attachmentUrl ? (
          <a
            href={request.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            View attached file
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">No files attached</p>
        )}
      </div>
    </Card>
  );
}
