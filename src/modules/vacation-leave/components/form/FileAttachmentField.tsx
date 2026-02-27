import type { RefObject } from "react";
import { theme } from "../../../../core/theme/index";
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
  const { colors, typography, spacing } = theme;

  return (
    <FormItem style={{ marginBottom: spacing.xl }}>
      <FormLabel
        style={{
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.bold,
          color: colors.primaryDark,
        }}
      >
        Attach Document{" "}
        <span
          style={{
            fontFamily: typography.fontFamily.regular,
            color: colors.textSecondary,
          }}
        >
          (if applicable)
        </span>
      </FormLabel>

      <Input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={onChange}
        className={attachment ? "text-foreground" : "text-muted-foreground"}
      />

      {fileError && (
        <FormMessage>{fileError}</FormMessage>
      )}

      <p
        style={{
          color: colors.textDisabled,
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fontFamily.regular,
          marginTop: spacing.xs,
        }}
      >
        Allowed: {ALLOWED_FILE_TYPES.join(", ")} — Max {MAX_FILE_SIZE_MB}MB
      </p>
    </FormItem>
  );
}
