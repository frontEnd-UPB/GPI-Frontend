import type { RefObject } from "react";
import {
  VACATION_ATTACHMENT_ALLOWED_FILE_TYPES,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_MB,
} from "../../../../core/constants";
import { Input } from "../../../../ui/input";
import { FormItem, FormLabel, FormMessage } from "../../../../ui/form";

interface FileAttachmentFieldProps {
  attachment: File | null;
  fileError: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileAttachmentField({
  attachment,
  fileError,
  fileInputRef,
  onChange,
}: FileAttachmentFieldProps) {
  return (
    <FormItem className="mb-xl">
      <FormLabel className="text-sm font-bold text-primary">
        Attach Document{" "}
        <span className="font-normal text-muted-foreground">
          (if applicable)
        </span>
      </FormLabel>

      <Input
        ref={fileInputRef}
        type="file"
        accept={VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.join(",")}
        onChange={onChange}
        className={`border-muted-foreground ${attachment ? "text-foreground" : "text-muted-foreground"}`}
      />

      {fileError && (
        <FormMessage>{fileError}</FormMessage>
      )}

      <p className="text-disabled text-xs mt-xs">
        Allowed: {VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.join(", ")} — Max {VACATION_ATTACHMENT_MAX_FILE_SIZE_MB}MB
      </p>
    </FormItem>
  );
}
