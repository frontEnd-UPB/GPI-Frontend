import type { Control } from "react-hook-form";
import { theme } from "../../../../core/theme/index";
import { DatePicker } from "../../../../ui/core/DatePicker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import type { VacationFormValues } from "../../hooks/useVacationRequestForm";

interface DateRangeFieldsProps {
  control: Control<VacationFormValues>;
}

export default function DateRangeFields({ control }: DateRangeFieldsProps) {
  const { colors, typography, radius, spacing } = theme;

  return (
    <div
      style={{
        display: "flex",
        gap: spacing.xxl,
        backgroundColor: colors.background,
        borderRadius: radius.full,
        padding: `${spacing.lg}px ${spacing.xxl}px`,
        marginBottom: spacing.xl,
        flexWrap: "wrap",
      }}
    >
      {/* Start Date */}
      <FormField
        control={control}
        name="startDate"
        rules={{ required: "Start date is required." }}
        render={({ field }) => (
          <FormItem style={{ flex: 1, minWidth: 140 }}>
            <FormLabel
              style={{
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.semiBold,
                color: colors.primaryDark,
              }}
            >
              Start Date
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ?? undefined}
                onChange={(d) => field.onChange(d ?? null)}
                placeholder="DD/MM/YYYY"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* End Date */}
      <FormField
        control={control}
        name="endDate"
        rules={{ required: "End date is required." }}
        render={({ field }) => (
          <FormItem style={{ flex: 1, minWidth: 140 }}>
            <FormLabel
              style={{
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.semiBold,
                color: colors.primaryDark,
              }}
            >
              End Date
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ?? undefined}
                onChange={(d) => field.onChange(d ?? null)}
                placeholder="DD/MM/YYYY"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
