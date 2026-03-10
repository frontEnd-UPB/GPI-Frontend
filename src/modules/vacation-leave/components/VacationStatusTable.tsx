import { format, parseISO } from "date-fns";
import type { VacationRequest } from "../../../core/mocks/data";
import StatusBadge from "./StatusBadge";
import { Button } from "../../../ui/button";

interface VacationStatusTableProps {
  vacations: VacationRequest[];
  onView: (vacation: VacationRequest) => void;
}

export default function VacationStatusTable({
  vacations,
  onView,
}: VacationStatusTableProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md bg-card">
      {/* Header */}
      <div className="bg-primary py-lg px-xxl">
        <h2 className="text-white m-0 text-xl font-bold">Vacation Status</h2>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            {["Start date", "End date", "Reason", "State", "Action"].map((h) => (
              <th
                key={h}
                className="text-left py-md px-xl text-sm font-bold text-primary capitalize"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vacations.map((vacation) => (
            <tr key={vacation.id} className="border-b border-border last:border-b-0">
              <td className="py-lg px-xl text-sm text-foreground">
                {format(parseISO(vacation.startDate), "dd/MM/yyyy")}
              </td>
              <td className="py-lg px-xl text-sm text-foreground">
                {format(parseISO(vacation.endDate), "dd/MM/yyyy")}
              </td>
              <td className="py-lg px-xl text-sm text-foreground">{vacation.reason}</td>
              <td className="py-lg px-xl">
                <StatusBadge status={vacation.status} />
              </td>
              <td className="py-lg px-xl">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => onView(vacation)}
                  className="p-0 h-auto"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}