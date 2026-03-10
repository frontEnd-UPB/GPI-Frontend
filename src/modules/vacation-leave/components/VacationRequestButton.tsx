import { useState } from "react";
import { Button } from "../../../ui/button";
import VacationRequestForm from "./VacationRequestForm";
import type { VacationSubmitData } from "../hooks/vacationRequestForm.types";

interface VacationRequestButtonProps {
  onSubmit: (data: VacationSubmitData) => Promise<boolean>;
  availableDays?: number | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isSubmitting?: boolean;
}

export default function VacationRequestButton({
  onSubmit,
  availableDays,
  open,
  onOpenChange,
  isSubmitting = false,
}: VacationRequestButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const formVisible = open ?? internalOpen;

  const setFormVisible = (nextValue: boolean) => {
    if (open === undefined) {
      setInternalOpen(nextValue);
    }

    onOpenChange?.(nextValue);
  };

  const handleOpen = () => setFormVisible(true);

  const handleSubmit = async (data: VacationSubmitData) => {
    const didSubmit = await onSubmit(data);

    if (didSubmit) {
      setFormVisible(false);
    }

    return didSubmit;
  };

  const handleCancel = () => setFormVisible(false);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">
        <div
          className="overflow-hidden flex justify-start"
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
            disabled={isSubmitting}
            className="flex items-left justify-left gap-3 rounded-md font-semibold tracking-wide px-8 py-6 w-full sm:w-auto bg-secondary text-secondary-foreground text-base shadow-sm hover:bg-secondary/80 transition"
          >
            <span className="material-symbols-rounded text-[40px] leading-none">
              add
            </span>

            New Vacation Request
          </Button>
        </div>

        <VacationRequestForm
          visible={formVisible}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          availableDays={availableDays}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}