/**
 * FE-164: Shared Authentication Component — PasswordInputWithEye
 * 
 * Reusable password input with optional visibility toggle, used across:
 * - ResetPasswordPage (new password, confirm password fields)
 * - SignUpPage (password fields)
 * - Any password-reset flow
 * 
 * Features:
 * - Toggles input type between "password" and "text" via Eye icon button
 * - Maintains core Input styling with password-specific UX patterns
 * - Accessible with proper aria-label for visibility button
 */
import React, { useState } from "react";
import { Input, type InputProps } from "../../../core/components";
import { cn } from "../../../ui/utils";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputWithEyeProps = Omit<InputProps, "type">;

export const PasswordInputWithEye: React.FC<PasswordInputWithEyeProps> = ({
  className,
  disabled,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-10", className)}
      />

      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40"
        disabled={disabled}
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? (
          <EyeOff
            className={cn(
              "size-5",
              disabled && "opacity-30"
            )}
          />
        ) : (
          <Eye
            className={cn(
              "size-5",
              disabled && "opacity-30"
            )}
          />
        )}
      </button>
    </div>
  );
};