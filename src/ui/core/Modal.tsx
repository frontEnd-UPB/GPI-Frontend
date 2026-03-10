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
  /** When true, only overlay & positioning are provided; caller handles card layout */
  unstyled?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  unstyled = false,
}) => {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-4xl",
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
          "relative w-full mx-4",
          sizeClasses[size],
          !unstyled &&
            "bg-card text-card-foreground rounded-[14px] shadow-lg border border-border"
        )}
      >
        {/* Header (for styled variant) */}
        {!unstyled && title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <IconButton onClick={onClose} size="sm">
              <X className="size-5 text-muted-foreground" />
            </IconButton>
          </div>
        )}

        {/* Body */}
        <div className={unstyled ? "" : "px-6 py-4"}>{children}</div>

        {/* Footer (for styled variant) */}
        {!unstyled && footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
