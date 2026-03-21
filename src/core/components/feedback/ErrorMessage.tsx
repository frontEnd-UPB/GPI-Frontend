import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../../ui/utils";

export interface ErrorMessageProps {
  message?: string;
  variant?: "default" | "inline";
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An error occurred. Please try again.",
  variant = "default",
  className = "",
}) => {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
        <AlertCircle className="size-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className={cn("bg-destructive/10 border border-destructive/30 rounded-[10px] p-4", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 text-destructive mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-destructive mb-1">Error</h4>
          <p className="text-sm text-destructive">{message}</p>
        </div>
      </div>
    </div>
  );
};

export { ErrorMessage };
