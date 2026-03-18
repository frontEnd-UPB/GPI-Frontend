import type { Control } from "react-hook-form";
import { Input } from "../../../../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import type { VacationFormValues } from "../../hooks/vacationRequestForm.types";

interface TypeSelectorProps {
  control: Control<VacationFormValues>;
  readOnly?: boolean;
}

export default function TypeSelector({
  control,
  readOnly = false,
}: TypeSelectorProps) {
  return (
    <FormField
      control={control}
      name="type"
      rules={{
        required: "Type of absence is required.",
        validate: (value) =>
          value.trim().length > 0 || "Type of absence is required.",
      }}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        return (
          <FormItem className="mb-xl">
            <FormLabel
              className={`text-sm font-semibold ${
                hasError ? "text-status-rejected" : "text-primary"
              }`}
            >
              Type
            </FormLabel>
            <div className="relative mt-1">
              <FormControl>
                <Input
                  placeholder="Family Vacations"
                  readOnly={readOnly}
                  className={`w-full rounded-md border bg-primary-foreground py-3 pl-5 pr-4 text-sm placeholder:text-muted-foreground ${
                    hasError ? "border-status-rejected" : "border-border"
                  } ${readOnly ? "text-muted-foreground pointer-events-none cursor-default" : "text-foreground"}`}
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage
              className={hasError ? "text-status-rejected" : undefined}
            />
          </FormItem>
        );
      }}
    />
  );
}
