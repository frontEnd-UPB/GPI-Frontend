import { useEffect } from "react";
import { createPortal } from "react-dom";
import { format, parseISO } from "date-fns";
import type { VacationRequest } from "../../../core/mocks/data";
import StatusBadge from "./StatusBadge";
import styles from "./VacationModal.module.css";

interface VacationModalProps {
  vacation: VacationRequest;
  onClose: () => void;
}

export default function VacationModal({
  vacation,
  onClose,
}: VacationModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Vacation Request Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Employee</label>
            <div className={styles.readOnlyField}>
              {vacation.employeeName}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Start Date</label>
            <div className={styles.readOnlyField}>
              {format(parseISO(vacation.startDate), "dd/MM/yyyy")}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>End Date</label>
            <div className={styles.readOnlyField}>
              {format(parseISO(vacation.endDate), "dd/MM/yyyy")}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Days</label>
            <div className={styles.readOnlyField}>
              {vacation.days}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Reason</label>
            <div className={styles.readOnlyField}>
              {vacation.reason}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Status</label>
            <StatusBadge status={vacation.status} />
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root")!
  );
}