import type { RefObject } from "react";
import {
  VACATION_ATTACHMENT_ALLOWED_FILE_TYPES,
  VACATION_ATTACHMENT_MAX_FILE_SIZE_MB,
} from "../../../../core/constants";
import { FormItem, FormLabel, FormMessage } from "../../../../ui/form";

interface FileAttachmentFieldProps {
  attachment: File | null;
  fileError: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  disabled?: boolean;
  existingFileName?: string;
}

export default function FileAttachmentField({
  attachment,
  fileError,
  fileInputRef,
  onChange,
  onRemove,
  disabled = false,
  existingFileName,
}: FileAttachmentFieldProps) {

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  return (
    <FormItem className="mb-xl">

      <FormLabel className="text-sm font-semibold text-primary">
        Attach Document
         <span className="font-normal text-muted-foreground">
              (if applicable)
            </span>
      </FormLabel>

      <div className="relative mt-2">

        {/* Paperclip */}
        <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-[18px] scale-70 rotate-[45deg] text-muted-foreground">
          attach_file
        </span>

        {/* File input (native text oculto, usamos placeholder custom) */}
        <input
          ref={fileInputRef}
          type="file"
          accept={VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.join(",")}
          onChange={onChange}
          disabled={disabled}
          className="w-full rounded-xl border border-border bg-primary-foreground py-3 pl-10 pr-10 text-sm file:hidden cursor-pointer hover:border-primary transition text-transparent caret-transparent disabled:opacity-70 disabled:cursor-not-allowed"
        />

        {/* Placeholder */}
        {!attachment && !existingFileName && (
          <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-regular pointer-events-none">
            Choose file...
          </span>
        )}

        {/* Existing file name from request data */}
        {!attachment && existingFileName && (
          <span className={`absolute left-11 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none ${disabled ? "text-muted-foreground" : "text-primary underline"}`}>
            {existingFileName}
          </span>
        )}

        {/* File name */}
        {attachment && (
          <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-primary font-medium underline pointer-events-none">
            {attachment.name}
          </span>
        )}

        {/* Remove button */}
        {(attachment || existingFileName) && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground/40 hover:text-destructive transition"
          >
            <span className="material-symbols-rounded text-[18px]">
              close_small
            </span>
          </button>
        )}

      </div>

      {fileError && <FormMessage>{fileError}</FormMessage>}

      <p className="text-xs text-muted-foreground mt-2">
        Allowed: {VACATION_ATTACHMENT_ALLOWED_FILE_TYPES.join(", ")} — Max {VACATION_ATTACHMENT_MAX_FILE_SIZE_MB}MB
      </p>

    </FormItem>
  );
}