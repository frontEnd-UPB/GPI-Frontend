import { format, parseISO } from "date-fns";
import type { VacationRequest } from "../../../core/mocks/data";
import StatusBadge from "./StatusBadge";
import styles from "./VacationStatusTable.module.css";

interface VacationStatusTableProps {
  vacations: VacationRequest[];
  onView: (vacation: VacationRequest) => void;
}

export default function VacationStatusTable({
  vacations,
  onView,
}: VacationStatusTableProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vacation Status</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Start date</th>
            <th>End date</th>
            <th>Reason</th>
            <th>State</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vacations.map((vacation) => (
            <tr key={vacation.id}>
              <td>{format(parseISO(vacation.startDate), "dd/MM/yyyy")}</td>
              <td>{format(parseISO(vacation.endDate), "dd/MM/yyyy")}</td>
              <td>{vacation.reason}</td>
              <td>
                <StatusBadge status={vacation.status} />
              </td>
              <td>
                <button
                  className={styles.viewButton}
                  onClick={() => onView(vacation)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}