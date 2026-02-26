"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-3 w-[240px] mx-auto",

        caption: "flex items-center justify-between pt-1 w-full",
        caption_label: "text-sm font-medium",

        nav: "flex items-center gap-2",
        nav_button:
          "inline-flex items-center justify-center rounded-full size-5 bg-transparent p-0 text-primary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed",

        table: "border-collapse table-fixed",

        head_cell:
          "text-muted-foreground w-8 text-center font-medium text-[0.8rem]",

        row: "mt-2",

        cell: "p-0 text-center",

        day: "h-8 w-8 rounded-md flex items-center justify-center text-sm font-normal transition-colors hover:bg-accent focus:outline-none",

        day_selected: "bg-primary text-primary-foreground",

        day_today: "bg-accent text-accent-foreground",

        day_outside: "text-muted-foreground",

        day_disabled: "text-muted-foreground opacity-50",

        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
