import type { Control } from "react-hook-form";
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
  return (
    <FormField
      control={control}
      name="comment"
      render={({ field }) => (
        <FormItem className="mb-xl">
          <FormLabel className="text-sm font-bold text-primary">
            Comment{" "}
            <span className="font-normal text-muted-foreground">
              (Optional)
            </span>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add any additional comments..."
              rows={4}
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
