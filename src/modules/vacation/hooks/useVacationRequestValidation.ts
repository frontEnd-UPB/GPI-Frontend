import { useCallback, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  VACATION_ATTACHMENT_ALLOWED_FILE_TYPES,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_BYTES,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_MB,
} from "../../../core/constants";
import type { VacationFormValues } from "./vacationRequestForm.types";

interface UseVacationRequestValidationOptions {
  availableDays?: number | null;
  onValidFileSelected?: (file: File) => void;
  onFileRemoved?: () => void;
}

function normalizeDate(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

export function useVacationRequestValidation(
  options: UseVacationRequestValidationOptions = {}
) {
  const { availableDays, onValidFileSelected, onFileRemoved } = options;
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetAttachmentState = useCallback(() => {
    setAttachment(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const validateAttachment = useCallback((file: File | null) => {
    if (!file) {
      return null;
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const isAllowedFileType = VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.includes(
      extension as (typeof VACATION_ATTACHMENT_ALLOWED_FILE_TYPES)[number]
    );

    if (!isAllowedFileType) {
      return `Invalid file type. Allowed: ${VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.join(", ")}`;
    }

    if (file.size > VACATION_ATTACHMENT_MAX_FILE_SIZE_BYTES) {
      return `File too large. Maximum size: ${VACATION_ATTACHMENT_MAX_FILE_SIZE_MB}MB`;
    }

    return null;
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      const validationError = validateAttachment(file);

      if (validationError) {
        setFileError(validationError);
        event.target.value = "";
        return;
      }

      setAttachment(file);
      setFileError("");

      if (file) {
        onValidFileSelected?.(file);
      }
    },
    [onValidFileSelected, validateAttachment]
  );

  const handleFileRemove = useCallback(() => {
    resetAttachmentState();
    onFileRemoved?.();
  }, [onFileRemoved, resetAttachmentState]);

  const validateFormValues = useCallback(
    (
      form: UseFormReturn<VacationFormValues>,
      data: VacationFormValues
    ): boolean => {
      form.clearErrors(["startDate", "endDate"]);

      const today = normalizeDate(new Date());

      if (data.startDate) {
        const startDate = normalizeDate(data.startDate);
        if (startDate < today) {
          form.setError("startDate", {
            message: "Start date cannot be in the past.",
          });
          return false;
        }
      }

      if (data.startDate && data.endDate) {
        const startDate = normalizeDate(data.startDate);
        const endDate = normalizeDate(data.endDate);

        if (endDate < startDate) {
          form.setError("endDate", {
            message: "End date must be after start date.",
          });
          return false;
        }

        if (availableDays != null) {
          const requestedDays =
            Math.ceil(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;

          if (requestedDays > availableDays) {
            form.setError("endDate", {
              message: `Request exceeds your available balance (${availableDays} day${availableDays === 1 ? "" : "s"}).`,
            });
            return false;
          }
        }
      }

      return true;
    },
    [availableDays]
  );

  return {
    attachment,
    fileError,
    fileInputRef,
    handleFileChange,
    handleFileRemove,
    resetAttachmentState,
    validateFormValues,
  };
}