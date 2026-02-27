import type { Control } from "react-hook-form";
import { theme } from "../../../../core/theme/index";
import { VacationReason } from "../../../../core/mocks/data";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import type { VacationFormValues } from "../../hooks/useVacationRequestForm";

interface TypeSelectorProps {
  control: Control<VacationFormValues>;
}

export default function TypeSelector({ control }: TypeSelectorProps) {
  const { colors, typography, spacing } = theme;

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem style={{ marginBottom: spacing.xl }}>
          <FormLabel
            style={{
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.bold,
              color: colors.primaryDark,
            }}
          >
            Type
          </FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.values(VacationReason).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
