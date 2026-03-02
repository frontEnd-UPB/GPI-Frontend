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
      className="flex flex-col sm:flex-row sm:items-start"
      style={{
        gap: spacing.xxl,
        backgroundColor: colors.primaryLight,
        borderRadius: radius.xl,
        padding: `${spacing.lg}px ${spacing.xxl}px`,
        marginBottom: spacing.xl,
      }}
    >
      {/* Start Date */}
      <FormField
        control={control}
        name="startDate"
        rules={{ required: "Start date is required." }}
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[140px] flex flex-col items-center">
            <FormLabel
              style={{
                fontSize: typography.fontSize.md,
                fontFamily: typography.fontFamily.bold,
                color: colors.primaryDark,
                fontWeight: "bold",
              }}
            >
              Start Date
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ?? undefined}
                onChange={(d) => field.onChange(d ?? null)}
                placeholder="DD/MM/YYYY"
                className="border-0 bg-transparent justify-center gap-2 text-center"
                valueClassName="font-bold"
              />
            </FormControl>
            <FormMessage className="pl-1 pt-0.5" />
          </FormItem>
        )}
      />

      {/* End Date */}
      <FormField
        control={control}
        name="endDate"
        rules={{ required: "End date is required." }}
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[140px] flex flex-col items-center">
            <FormLabel
              style={{
                fontSize: typography.fontSize.md,
                fontFamily: typography.fontFamily.bold,
                color: colors.primaryDark,
                fontWeight: "bold",
              }}
            >
              End Date
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ?? undefined}
                onChange={(d) => field.onChange(d ?? null)}
                placeholder="DD/MM/YYYY"
                className="border-0 bg-transparent justify-center gap-2 text-center"
                valueClassName="font-bold"
              />
            </FormControl>
            <FormMessage className="pl-1 pt-0.5" />
          </FormItem>
        )}
      />
    </div>
  );
}
