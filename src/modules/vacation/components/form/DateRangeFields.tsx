import { useFormState, type Control } from "react-hook-form";
import { DatePicker } from "../../../../ui/core/DatePicker";
import { FiCalendar } from "react-icons/fi";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import type { VacationFormValues } from "../../hooks/vacationRequestForm.types";

interface DateRangeFieldsProps {
  control: Control<VacationFormValues>;
  disabled?: boolean;
}

export default function DateRangeFields({
  control,
  disabled = false,
}: DateRangeFieldsProps) {
  const { errors } = useFormState({ control, name: ["startDate", "endDate"] });
  const hasDateError = Boolean(errors.startDate) || Boolean(errors.endDate);

  const containerClassName = hasDateError
    ? "flex flex-col sm:flex-row items-center justify-center gap-55 bg-status-rejected-foreground border border-status-rejected rounded-2xl px-11 py-4 mb-1"
    : "flex flex-col sm:flex-row items-center justify-center gap-55 bg-muted/70 border border-muted rounded-2xl px-11 py-4 mb-1";

  const labelClassName = hasDateError
    ? "text-sm font-medium text-status-rejected mb-0 leading-tight"
    : "text-sm font-medium text-primary mb-0 leading-tight";

  const valueClassName = hasDateError
    ? "text-xl font-semibold text-status-rejected leading-tight"
    : disabled
    ? "text-xl font-semibold text-muted-foreground leading-tight"
    : "text-xl font-semibold text-primary leading-tight";

  return (
	<div className={containerClassName}>

      {/* Start Date */}
      <FormField
        control={control}
        name="startDate"
        rules={{ required: "Start date is required." }}
        render={({ field }) => (
	  		  <FormItem className="flex items-center gap-4">

            <FiCalendar
              size={26}
              className={hasDateError ? "text-status-rejected shrink-0" : disabled ? "text-muted-foreground shrink-0" : "text-primary shrink-0"}
            />

            <div className="flex flex-col leading-tight">

              <FormLabel className={labelClassName}>Start Date</FormLabel>

              <FormControl>
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={(d) => field.onChange(d ?? null)}
                  placeholder="01/01/1996"
                  disabled={disabled}
                  className="border-0 bg-transparent p-0 text-left h-auto"
                  valueClassName={valueClassName}
                  placeholderClassName={valueClassName}
                  showIcon={false}
                />
              </FormControl>

              <FormMessage className="mt-1 text-xs text-status-rejected" />
            </div>

          </FormItem>
        )}
      />

      {/* End Date */}
      <FormField
        control={control}
        name="endDate"
        rules={{ required: "End date is required." }}
        render={({ field }) => (
	   	  	  <FormItem className="flex items-center gap-4">

              <FiCalendar
                size={26}
                className={hasDateError ? "text-status-rejected shrink-0" : disabled ? "text-muted-foreground shrink-0" : "text-primary shrink-0"}
              />

            <div className="flex flex-col leading-tight">

              <FormLabel className={labelClassName}>End Date</FormLabel>

              <FormControl>
                <DatePicker
                  value={field.value ?? undefined}
                  onChange={(d) => field.onChange(d ?? null)}
                  placeholder="02/01/1996"
                  disabled={disabled}
                  className="border-0 bg-transparent p-0 text-left h-auto"
                  valueClassName={valueClassName}
                  placeholderClassName={valueClassName}
                  showIcon={false}
                />
              </FormControl>

              <FormMessage className="mt-1 text-xs text-status-rejected" />
            </div>

          </FormItem>
        )}
      />

    </div>
  );
}