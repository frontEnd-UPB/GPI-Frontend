import { Form } from "../../../../ui/form";
import { Button } from "../../../../ui/button";
import { useVacationRequestForm } from "../hooks/useVacationRequestForm";
import type { VacationSubmitData } from "../hooks/vacationRequestForm.types";
import DateRangeFields from "../../components/form/DateRangeFields";
import TypeSelector from "../../components/form/TypeSelector";
import CommentField from "../../components/form/CommentField";
import FileAttachmentField from "../../components/form/FileAttachmentField";

interface VacationRequestFormProps {
  visible: boolean;
  onSubmit: (data: VacationSubmitData) => Promise<boolean>;
  onCancel: () => void;
  availableDays?: number | null;
  isSubmitting?: boolean;
}

export default function VacationRequestForm({
  visible,
  onSubmit,
  onCancel,
  availableDays,
  isSubmitting = false,
}: VacationRequestFormProps) {
  const {
    form,
    attachment,
    fileError,
    fileInputRef,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
    handleCancel,
  } = useVacationRequestForm(onSubmit, onCancel, availableDays);

  return (
    <div
      className="overflow-hidden"
      style={{
        maxHeight: visible ? 1400 : 0,
        opacity: visible ? 1 : 0,
        marginBottom: visible ? "var(--spacing-xxl)" : 0,
        transition:
          "max-height 0.5s ease, opacity 0.4s ease, margin-bottom 0.4s ease",
      }}
    >
      <div className="rounded-3xl overflow-hidden shadow-md border border-border bg-card">
        <div className="bg-primary px-12 py-5">
          <h2 className="text-primary-foreground text-2xl font-semibold tracking-tight">
            Vacation Leave Request
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="px-12 py-10 flex flex-col gap-4"
          >
            <DateRangeFields control={form.control} />
            <TypeSelector control={form.control} />
            <CommentField control={form.control} />
            <div className="flex flex-col gap-1">
              <FileAttachmentField
                attachment={attachment}
                fileError={fileError}
                fileInputRef={fileInputRef}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
              />
            </div>
            <div className="flex gap-4 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-success text-primary-foreground py-4 text-base font-semibold hover:bg-success/90 transition"
              >
                {isSubmitting ? "Submitting..." : "Send Request"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-full px-10 py-2 text-base"
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