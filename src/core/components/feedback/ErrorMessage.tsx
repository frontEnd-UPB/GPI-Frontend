import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../../ui/utils";

export interface ErrorMessageProps {
  message?: string;
  variant?: "default" | "inline";
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An error occurred. Please try again.",
  variant = "default",
}) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="size-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-[10px] p-4">
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
