import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../utils";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import { Calendar } from "../calendar";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  valueClassName?: string;
  showIcon?: boolean;
  placeholderClassName?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select a date",
  disabled,
  className,
  valueClassName,
  showIcon = true,
  placeholderClassName,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date?: Date) => {
    onChange?.(date);
    if (date) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-[10px] border bg-input-background px-4 py-2 text-base text-left transition-colors",
            "border-border text-foreground",
            !value && "text-muted-foreground",
          disabled && "cursor-not-allowed pointer-events-none",
            className
          )}
        >
          <span className={value ? valueClassName : placeholderClassName}>
            {value ? format(value, "dd/MM/yyyy") : placeholder}
          </span>
          {showIcon && <CalendarIcon className="size-4 text-primary" />}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0 rounded-2xl bg-card text-card-foreground shadow-md border border-border"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          showOutsideDays
        />
      </PopoverContent>
    </Popover>
    
  );
};

export { DatePicker };
