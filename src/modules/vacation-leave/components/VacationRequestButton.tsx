import { useState } from "react";
import { Button } from "../../../ui/button";
import VacationRequestForm from "./VacationRequestForm";
import type { VacationSubmitData } from "../hooks/useVacationRequestForm";

interface VacationRequestButtonProps {
  onSubmit?: (data: VacationSubmitData) => void;
  availableDays?: number | null;
}

export default function VacationRequestButton({
  onSubmit,
  availableDays,
}: VacationRequestButtonProps) {
  const [formVisible, setFormVisible] = useState(false);

  const handleOpen = () => setFormVisible(true);

  const handleSubmit = (data: VacationSubmitData) => {
    onSubmit?.(data);
    setFormVisible(false);
  };
  const handleCancel = () => setFormVisible(false);

  return (
    <div>
      <div
        className="overflow-hidden flex justify-center"
        style={{
          maxHeight: formVisible ? 0 : 60,
          opacity: formVisible ? 0 : 1,
          pointerEvents: formVisible ? "none" : "auto",
          marginBottom: formVisible ? 0 : "var(--spacing-xl)",
          transition: "max-height 0.4s ease, opacity 0.3s ease",
        }}
      >
        <Button
          type="button"
          onClick={handleOpen}
          className="rounded-full font-bold tracking-wide px-xxxl py-xxl flex justify-center items-center w-full sm:w-auto bg-brand text-white text-base"
        >
          + Request Vacation Leave
        </Button>
      </div>
        <VacationRequestForm
        visible={formVisible}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        availableDays={availableDays}
         />
     
    </div>
  );
}
