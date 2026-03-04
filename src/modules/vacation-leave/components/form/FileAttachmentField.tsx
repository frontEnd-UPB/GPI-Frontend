import type { RefObject } from "react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from "../../../../core/mocks/data";
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
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={onChange}
        className={`border-muted-foreground ${attachment ? "text-foreground" : "text-muted-foreground"}`}
      />

      {fileError && (
        <FormMessage>{fileError}</FormMessage>
      )}

      <p className="text-disabled text-xs mt-xs">
        Allowed: {ALLOWED_FILE_TYPES.join(", ")} — Max {MAX_FILE_SIZE_MB}MB
      </p>
    </FormItem>
  );
}
