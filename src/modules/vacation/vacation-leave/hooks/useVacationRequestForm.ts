import { useForm } from "react-hook-form";
import { useVacationRequestValidation } from "./useVacationRequestValidation";
import type {
  VacationFormValues,
  VacationSubmitData,
} from "./vacationRequestForm.types";

export function useVacationRequestForm(
  onSubmit: (data: VacationSubmitData) => Promise<boolean>,
  onCancel: () => void,
  availableDays?: number | null
) {
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
  } = useVacationRequestValidation({ availableDays });

  const resetFormState = () => {
    form.reset();
    resetAttachmentState();
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!validateFormValues(form, data)) {
      return;
    }

    const didSubmit = await onSubmit({ ...data, attachment });

    if (!didSubmit) {
      return;
    }

    resetFormState();
  });

  const handleCancel = () => {
    resetFormState();
    onCancel();
  };

  return {
    form,
    attachment,
    fileError,
    fileInputRef,
    handleFileChange,
    handleFileRemove,
    handleSubmit,
    handleCancel,
  };
}
