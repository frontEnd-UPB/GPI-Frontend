import React from "react";
import { Search } from "lucide-react";
import { cn } from "../utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <input
          ref={ref}
          type="search"
          className={cn(
            "flex h-10 w-full rounded-[10px] border border-border bg-input-background pl-4 pr-10 py-2 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
