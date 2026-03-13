import type { Control } from "react-hook-form";
import { Textarea } from "../../../../ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import type { VacationFormValues } from "../../hooks/vacationRequestForm.types";

interface CommentFieldProps {
  control: Control<VacationFormValues>;
  readOnly?: boolean;
}

export default function CommentField({
  control,
  readOnly = false,
}: CommentFieldProps) {
  return (
    <FormField
      control={control}
      name="comment"
      render={({ field }) => (
        <FormItem className="mb-xl">
          <FormLabel className="text-sm font-semibold text-primary">
            Comment{" "}
            <span className="font-normal text-muted-foreground">
              (Optional)
            </span>
          </FormLabel>
         
            <FormControl>
              <Textarea
                placeholder="Add any additional comments..."
                rows={4}
                readOnly={readOnly}
                className={`w-full rounded-xl border border-border bg-primary-foreground py-3 pl-5 pr-4 text-sm placeholder:text-muted-foreground resize-none ${readOnly ? "text-muted-foreground pointer-events-none cursor-default" : "text-foreground"}`}
                {...field}
              />
            </FormControl>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
