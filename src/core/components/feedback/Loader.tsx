import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../../ui/utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "md", text }) => {
  const sizeClasses = {
    sm: "size-6",
    md: "size-10",
    lg: "size-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  );
};

export { Loader };
