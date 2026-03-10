import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  VACATION_ATTACHMENT_ALLOWED_FILE_TYPES,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_MB,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_BYTES,
} from "../../../core/constants";

export interface VacationFormValues {
  startDate: Date | null;
  endDate: Date | null;
  type: string;
  comment: string;
}

export interface VacationSubmitData extends VacationFormValues {
  attachment: File | null;
}

export function useVacationRequestForm(
  onSubmit: (data: VacationSubmitData) => void,
  onCancel: () => void,
  availableDays?: number | null
) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VacationFormValues>({
    defaultValues: {
      startDate: null,
      endDate: null,
      type: "",
      comment: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError("");

    if (file) {
      const extension = ("." + file.name.split(".").pop()?.toLowerCase()) as (typeof VACATION_ATTACHMENT_ALLOWED_FILE_TYPES)[number];
      if (!VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.includes(extension)) {
        setFileError(
          `Invalid file type. Allowed: ${VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.join(", ")}`
        );
        e.target.value = "";
        return;
      }
      if (file.size > VACATION_ATTACHMENT_MAX_FILE_SIZE_BYTES) {
        setFileError(
          `File too large. Maximum size: ${VACATION_ATTACHMENT_MAX_FILE_SIZE_MB}MB`
        );
        e.target.value = "";
        return;
      }
    }

    setAttachment(file);
  };

  const handleSubmit = form.handleSubmit((data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.startDate) {
      const start = new Date(data.startDate);
      start.setHours(0, 0, 0, 0);
      if (start < today) {
        form.setError("startDate", {
          message: "Start date cannot be in the past.",
        });
        return;
      }
    }

    if (data.startDate && data.endDate) {
      if (data.endDate < data.startDate) {
        form.setError("endDate", {
          message: "End date must be after start date.",
        });
        return;
      }

      if (availableDays != null) {
        const days =
          Math.ceil(
            (data.endDate.getTime() - data.startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        if (days > availableDays) {
          form.setError("endDate", {
            message: `Request exceeds your available balance (${availableDays} day${availableDays === 1 ? "" : "s"}).`,
          });
          return;
        }
      }
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
