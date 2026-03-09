import React from "react";
import { X } from "lucide-react";
import { cn } from "../utils";
import { IconButton } from "./IconButton";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  headerVariant?: "default" | "primary";
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  headerVariant = "default",
}) => {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-card text-card-foreground rounded-[14px] shadow-lg border border-border w-full mx-4",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        {title && (
          <div
            className={cn(
              "flex items-center justify-between px-6 py-4 border-b border-border",
              headerVariant === "primary" &&
                "rounded-t-[14px] border-none bg-primary text-primary-foreground"
            )}
          >
            <h2 className="text-xl font-semibold">{title}</h2>
            <IconButton
              onClick={onClose}
              size="sm"
              className={cn(
                headerVariant === "primary" &&
                  "hover:bg-primary/80"
              )}
            >
              <X
                className={cn(
                  "size-5 text-muted-foreground",
                  headerVariant === "primary" && "text-primary-foreground"
                )}
              />
            </IconButton>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
