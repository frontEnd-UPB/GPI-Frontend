import type { Control } from "react-hook-form";
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
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="mb-xl">
          <FormLabel className="text-sm font-bold text-primary">
            Type
          </FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="border-muted-foreground">
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
