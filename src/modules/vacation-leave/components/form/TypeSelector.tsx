import type { Control } from "react-hook-form";
import { Input } from "../../../../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import type { VacationFormValues } from "../../hooks/useVacationRequestForm";

interface TypeSelectorProps {
  control: Control<VacationFormValues>;
}

export default function TypeSelector({ control }: TypeSelectorProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="mb-xl">
          <FormLabel className="text-sm font-bold text-primary">
            Type of absence
          </FormLabel>
          <FormControl>
            <Input
              placeholder="e.g. Family vacation, Medical leave"
              className="border-muted-foreground"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
