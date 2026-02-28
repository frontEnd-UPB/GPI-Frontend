import { theme } from "../../../core/theme/index";
import { Form } from "../../../ui/form";
import { Button } from "../../../ui/button";
import {
  useVacationRequestForm,
  type VacationSubmitData,
} from "../hooks/useVacationRequestForm";
import DateRangeFields from "./form/DateRangeFields";
import TypeSelector from "./form/TypeSelector";
import CommentField from "./form/CommentField";
import FileAttachmentField from "./form/FileAttachmentField";

interface VacationRequestFormProps {
  visible: boolean;
  onSubmit: (data: VacationSubmitData) => void;
  onCancel: () => void;
  availableDays?: number | null;
}

export default function VacationRequestForm({
  visible,
  onSubmit,
  onCancel,
  availableDays,
}: VacationRequestFormProps) {
  const { colors, typography, radius, spacing } = theme;

  const {
    form,
    attachment,
    fileError,
    fileInputRef,
    handleFileChange,
    handleSubmit,
    handleCancel,
  } = useVacationRequestForm(onSubmit, onCancel, availableDays);

  return (
    /* ---- Expand / Collapse wrapper ---- */
    <div
      style={{
        maxHeight: visible ? 900 : 0,
        opacity: visible ? 1 : 0,
        overflow: "hidden",
        marginBottom: visible ? "1.5rem" : 0,
        transition:
          "max-height 0.5s ease, opacity 0.4s ease, margin-bottom 0.4s ease",
      }}
    >
      {/* ---- Card ---- */}
      <div
        style={{
          borderRadius: radius.xl,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          backgroundColor: colors.surface,
          fontFamily: typography.fontFamily.regular,
        }}
      >
        {/* ---- Header ---- */}
        <div
          style={{
            backgroundColor: colors.primaryDark,
            padding: `${spacing.lg}px ${spacing.xxl}px`,
          }}
        >
          <h2
            style={{
              color: colors.textOnPrimary,
              margin: 0,
              fontSize: typography.fontSize.lg,
              fontFamily: typography.fontFamily.bold,
            }}
          >
            Vacation Leave Request
          </h2>
        </div>

        {/* ---- Form Body ---- */}
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ padding: spacing.xxl }}
          >
            <DateRangeFields control={form.control} />

            <TypeSelector control={form.control} />

            <CommentField control={form.control} />

            <FileAttachmentField
              attachment={attachment}
              fileError={fileError}
              fileInputRef={fileInputRef}
              onChange={handleFileChange}
            />

            {/* ---- Actions ---- */}
            <div
              style={{
                display: "flex",
                gap: spacing.lg,
                marginTop: spacing.xxl,
              }}
            >
              <Button
                type="submit"
                className="flex-1 rounded-full font-bold tracking-wide"
                style={{
                  backgroundColor: colors.success,
                  color: colors.textOnPrimary,
                  fontSize: typography.fontSize.md,
                }}
              >
                SEND
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 rounded-full"
                style={{ fontSize: typography.fontSize.md }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

