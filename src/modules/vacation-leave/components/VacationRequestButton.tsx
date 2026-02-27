import { useState } from "react";
import { Button } from "../../../ui/button";
import { theme } from "../../../core/theme/index";
import VacationRequestForm from "./VacationRequestForm";
import type { VacationSubmitData } from "../hooks/useVacationRequestForm";

interface VacationRequestButtonProps {
  onSubmit?: (data: VacationSubmitData) => void;
}

export default function VacationRequestButton({
  onSubmit,
}: VacationRequestButtonProps) {
  const [formVisible, setFormVisible] = useState(false);
  const { colors, typography, radius, spacing } = theme;

  const handleOpen = () => setFormVisible(true);

  const handleSubmit = (data: VacationSubmitData) => {
    onSubmit?.(data);
    setFormVisible(false);
  };
  const handleCancel = () => setFormVisible(false);

  return (
    <div>
      <div
        style={{
          maxHeight: formVisible ? 0 : 60,
          opacity: formVisible ? 0 : 1,
          overflow: "hidden",
          pointerEvents: formVisible ? "none" : "auto",
          transition: "max-height 0.4s ease, opacity 0.3s ease",
          marginBottom: formVisible ? 0 : spacing.xl,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          type="button"
          onClick={handleOpen}
          className="rounded-full font-bold tracking-wide px-8 flex justify-center items-center"
          style={{
            backgroundColor: colors.primary,
            color: colors.textOnPrimary,
            fontSize: typography.fontSize.md,
            borderRadius: radius.lg,
            padding: `${spacing.xxl}px ${spacing.xxxl}px`,
          }}
        >
          + Request Vacation Leave
        </Button>
      </div>
        <VacationRequestForm
        visible={formVisible}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
         />
     
    </div>
  );
}
