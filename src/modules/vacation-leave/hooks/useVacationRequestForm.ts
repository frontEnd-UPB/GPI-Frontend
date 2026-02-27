import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  VacationReason,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
} from "../../../core/mocks/data";

export interface VacationFormValues {
  startDate: Date | null;
  endDate: Date | null;
  type: VacationReason;
  comment: string;
}

export interface VacationSubmitData extends VacationFormValues {
  attachment: File | null;
}

export function useVacationRequestForm(
  onSubmit: (data: VacationSubmitData) => void,
  onCancel: () => void
) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VacationFormValues>({
    defaultValues: {
      startDate: null,
      endDate: null,
      type: VacationReason.Vacations,
      comment: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError("");

    if (file) {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(extension)) {
        setFileError(
          `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`
        );
        e.target.value = "";
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File too large. Maximum size: ${MAX_FILE_SIZE_MB}MB`);
        e.target.value = "";
        return;
      }
    }

    setAttachment(file);
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (
      data.startDate &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      form.setError("endDate", {
        message: "End date must be after start date.",
      });
      return;
    }
    onSubmit({ ...data, attachment });
    form.reset();
    setAttachment(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  });

  const handleCancel = () => {
    form.reset();
    setAttachment(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onCancel();
  };

  return {
    form,
    attachment,
    fileError,
    fileInputRef,
    handleFileChange,
    handleSubmit,
    handleCancel,
  };
}
