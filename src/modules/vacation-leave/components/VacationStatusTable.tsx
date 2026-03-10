import { format, parseISO } from "date-fns";
import type { VacationRequest } from "../../../core/mocks/data";
import { StatusBadge } from "../../../core/components/StatusBadge";
import { VACATION_STATUS } from "../../../core/constants";

interface VacationStatusTableProps {
  vacations: VacationRequest[];
  onView: (vacation: VacationRequest) => void;
}

export default function VacationStatusTable({
  vacations,
  onView,
}: VacationStatusTableProps) {
  const vacationsSortedByPending = [...vacations].sort((a, b) => {
    const isAPending = a.status === VACATION_STATUS.PENDING;
    const isBPending = b.status === VACATION_STATUS.PENDING;

    if (isAPending === isBPending) return 0;

    return isAPending ? -1 : 1;
  });

  return (
    <div className="rounded-3xl overflow-hidden shadow-md bg-card border border-border">

      {/* Header */}
      <div className="bg-primary px-8 py-4">
        <h2 className="text-primary-foreground text-2xl font-semibold tracking-tight">
          Vacation Status
        </h2>
      </div>

      {/* Table header */}
      <div className="bg-muted flex items-center px-7 py-3 gap-10 border-b border-border/60 text-md font-semibold text-primary">

        <div className="w-[120px] flex justify-start">
          Start date
        </div>

        <div className="w-[120px] flex justify-start">
          End date
        </div>

        <div className="w-[120px] flex justify-start">
          Reason
        </div>

        <div className="w-[140px] flex justify-center">
          State
        </div>

        <div className="w-[80px] flex justify-end">
          Action
        </div>

      </div>

      {/* Rows */}
      <div className="px-3 py-3 space-y-1">

        {vacations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No vacation requests found
          </div>
        ) : (
          vacationsSortedByPending.map((vacation) => (
            <div
              key={vacation.id}
              className="flex items-center gap-10 py-3 px-4 rounded-xl hover:bg-muted/40 transition"
            >

              <div className="w-[120px] flex justify-start text-sm text-foreground">
                {format(parseISO(vacation.startDate), "dd/MM/yyyy")}
              </div>

              <div className="w-[120px] flex justify-start text-sm text-foreground">
                {format(parseISO(vacation.endDate), "dd/MM/yyyy")}
              </div>

              <div className="w-[120px] flex justify-start text-sm text-foreground">
                {vacation.reason}
              </div>

              <div className="w-[140px] flex justify-center">
                <StatusBadge status={vacation.status} />
              </div>

              <div className="w-[70px] flex justify-end">
                <button
                  onClick={() => onView(vacation)}
                  className="text-info underline text-sm hover:text-info/80 transition"
                >
                  View
                </button>
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}