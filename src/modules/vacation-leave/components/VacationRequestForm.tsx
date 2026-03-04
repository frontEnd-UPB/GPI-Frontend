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
      className="overflow-hidden"
      style={{
        maxHeight: visible ? 1400 : 0,
        opacity: visible ? 1 : 0,
        marginBottom: visible ? "var(--spacing-xxl)" : 0,
        transition:
          "max-height 0.5s ease, opacity 0.4s ease, margin-bottom 0.4s ease",
      }}
    >
      {/* ---- Card ---- */}
      <div className="rounded-2xl overflow-hidden shadow-md bg-card">
        {/* ---- Header ---- */}
        <div className="bg-primary py-lg px-xxl">
          <h2 className="text-white m-0 text-lg font-bold">
            Vacation Leave Request
          </h2>
        </div>

        {/* ---- Form Body ---- */}
        <Form {...form}>
          <form onSubmit={handleSubmit} noValidate className="p-xxl">
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
            <div className="flex gap-lg mt-xxl">
              <Button
                type="submit"
                className="flex-1 rounded-full font-bold tracking-wide bg-success text-white text-base"
              >
                SEND
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 rounded-full text-base"
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

