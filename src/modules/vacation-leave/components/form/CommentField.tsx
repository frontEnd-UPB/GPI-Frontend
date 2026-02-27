import type { Control } from "react-hook-form";
import { theme } from "../../../../core/theme/index";
import { Textarea } from "../../../../ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import type { VacationFormValues } from "../../hooks/useVacationRequestForm";

interface CommentFieldProps {
  control: Control<VacationFormValues>;
}

export default function CommentField({ control }: CommentFieldProps) {
  const { colors, typography, spacing } = theme;

  return (
    <FormField
      control={control}
      name="comment"
      render={({ field }) => (
        <FormItem style={{ marginBottom: spacing.xl }}>
          <FormLabel
            style={{
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.bold,
              color: colors.primaryDark,
            }}
          >
            Comment{" "}
            <span
              style={{
                fontFamily: typography.fontFamily.regular,
                color: colors.textSecondary,
              }}
            >
              (Optional)
            </span>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add any additional comments..."
              rows={4}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
