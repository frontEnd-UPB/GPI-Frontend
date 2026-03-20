import { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Modal } from "../../../ui/core/Modal";
import { IconButton } from "../../../ui/core/IconButton";
import { Form } from "../../../ui/form";
import { Button } from "../../../ui/button";
import { StatusBadge } from "../../../core/components/StatusBadge";
import type { VacationRequest } from "../../../core/mocks/data";
import { useVacationRequestValidation } from "../hooks/useVacationRequestValidation";
import type { VacationFormValues } from "../hooks/vacationRequestForm.types";
import DateRangeFields from "./form/DateRangeFields";
import TypeSelector from "./form/TypeSelector";
import CommentField from "./form/CommentField";
import FileAttachmentField from "./form/FileAttachmentField";


interface VacationRequestModalProps {
  open: boolean;
  onClose: () => void;
  vacation: VacationRequest | null;
  readOnly?: boolean;
  availableDays?: number | null;
  isProcessing?: boolean;
  onCancelRequest?: (id: string) => Promise<boolean>;
  onUpdateRequest?: (
    id: string,
    updatedStartDate: Date,
    updatedEndDate: Date,
    updatedReason: string,
    updatedComment: string,
    updatedAttachment?: File | null,
    removeAttachment?: boolean
  ) => Promise<boolean>;
}

export default function VacationRequestModal({
  open,
  onClose,
  vacation,
  readOnly = false,
  availableDays,
  isProcessing = false,
  onCancelRequest,
  onUpdateRequest,
}: VacationRequestModalProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const showTemporaryError = (message: string) => {
    setActionError(message);

    setTimeout(() => {
      setActionError(null);
    }, 3000); // 3 segundos
  };
  const [isEditing, setIsEditing] = useState(false);
  const [existingAttachmentName, setExistingAttachmentName] = useState<
    string | undefined
  >(undefined);

  const form = useForm<VacationFormValues>({
    defaultValues: {
      startDate: null,
      endDate: null,
      type: "",
      comment: "",
    },
  });

  const {
    attachment,
    fileError,
    fileInputRef,
    handleFileChange,
    handleFileRemove,
    resetAttachmentState,
    validateFormValues,
  } = useVacationRequestValidation({
    availableDays,
    onValidFileSelected: () => setExistingAttachmentName(undefined),
    onFileRemoved: () => setExistingAttachmentName(undefined),
  });

  useEffect(() => {
    if (open && vacation) {
      form.reset({
        startDate: parseISO(vacation.startDate),
        endDate: parseISO(vacation.endDate),
        type: vacation.reason,
        comment: vacation.comment ?? "",
      });
      setExistingAttachmentName(
        vacation.attachmentName ??
          (vacation.attachmentUrl
            ? vacation.attachmentUrl.split("/").pop() ?? undefined
            : undefined)
      );
      resetAttachmentState();
      setIsEditing(false);
    }
  }, [open, vacation, form, resetAttachmentState]);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setExistingAttachmentName(undefined);
      resetAttachmentState();
    }
  }, [open, resetAttachmentState]);

  if (!vacation) return null;

  const isPending = vacation.status === "pending";
  const isRejected = vacation.status === "rejected";
  const rejectionReason = vacation.rejectionReason ?? "Reason not specified.";
  const canEdit =
    !readOnly &&
    isPending &&
    Boolean(onCancelRequest) &&
    Boolean(onUpdateRequest);
  const isReadOnly = !canEdit || !isEditing;
  const shouldRemoveExistingAttachment =
    Boolean(vacation.attachmentUrl) && !existingAttachmentName && !attachment;

  const handleCancel = async () => {
    if (!onCancelRequest) return;

    try {
      const didCancel = await onCancelRequest(vacation.id);

      if (didCancel) {
        onClose();
      }
    } catch (error: any) {
      showTemporaryError("Unable to cancel request. Server not available.");
    }
  };

  const handleSaveChanges = form.handleSubmit(async (data) => {
    if (!onUpdateRequest) return;
    if (!data.startDate || !data.endDate) return;
    if (!validateFormValues(form, data)) return;

    try {
      const didUpdate = await onUpdateRequest(
        vacation.id,
        data.startDate,
        data.endDate,
        data.type,
        data.comment,
        attachment,
        shouldRemoveExistingAttachment
      );

      if (didUpdate) {
        onClose();
      }
    } catch (error: any) {
      showTemporaryError("Unable to update request. Server not available.");
    }
  });

  const handleStartEdit = () => {
    if (!canEdit || isProcessing) return;
    setIsEditing(true);
  };

  return (
    <Modal open={open} onClose={onClose} size="xl" unstyled>
      <div
        className="rounded-3xl overflow-hidden shadow-md border border-border bg-card w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary px-12 py-5 flex items-center justify-between">
          <h2 className="text-primary-foreground text-2xl font-semibold tracking-tight">
            Vacation Leave Request
          </h2>
            <IconButton onClick={onClose} size="sm" disabled={isProcessing}>
            <X className="size-5 text-primary-foreground" />
          </IconButton>
        </div>

        <Form {...form}>
            <form
              onSubmit={handleSaveChanges}
              noValidate
              className="px-12 py-10 flex flex-col gap-4"
            >
              {actionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {actionError}
                </div>
              )}
            <DateRangeFields control={form.control} disabled={isReadOnly} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <TypeSelector control={form.control} readOnly={isReadOnly} />

              <div>
                <p className="text-sm font-semibold text-primary mb-1">Status</p>
                <div className="scale-125 origin-top-left py-2">
                  <StatusBadge status={vacation.status} />
                </div>
              </div>
            </div>

            <CommentField control={form.control} readOnly={isReadOnly} />

            <div className="flex flex-col gap-1">
              <FileAttachmentField
                attachment={attachment}
                existingFileName={existingAttachmentName}
                fileError={fileError}
                fileInputRef={fileInputRef}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
                disabled={!isEditing || isProcessing}
              />
            </div>

            {canEdit && (
              <div className="flex gap-4 mt-2">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStartEdit();
                    }}
                    disabled={isProcessing}
                    className="rounded-full px-10 py-2 text-primary-foreground bg-secondary hover:bg-secondary/90 transition"
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 rounded-full bg-success text-primary-foreground py-4 text-base font-semibold hover:bg-success/90 transition"
                    >
                      {isProcessing ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="rounded-full px-10 py-2 text-base"
                    >
                      {isProcessing ? "Processing..." : "Cancel Request"}
                    </Button>
                  </>
                )}
              </div>
            )}

            {readOnly && (
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-10 py-2 text-primary-foreground bg-secondary hover:bg-secondary/90 transition"
                >
                  Close
                </Button>
              </div>
            )}

            {isRejected && (
              <div className="bg-status-rejected-foreground border border-status-rejected rounded-2xl px-6 py-4 text-sm">
                <p className="font-bold text-status-rejected mb-1">Rejection Reason</p>
                <p className="text-status-rejected">{rejectionReason}</p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Modal>
  );
}