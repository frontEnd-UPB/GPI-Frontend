import { useState } from "react";
import { forgotPasswordService } from "../services/forgotPasswordService";
import type { ForgotPasswordSource } from "../services/forgotPasswordService";

interface ResetPasswordState {
  checkingToken: boolean;
  loading: boolean;
  isTokenValid: boolean;
  error: string | null;
  successMessage: string | null;
  from: ForgotPasswordSource | null;
}

export const useResetPassword = () => {
  const [state, setState] = useState<ResetPasswordState>({
    checkingToken: false,
    loading: false,
    isTokenValid: false,
    error: null,
    successMessage: null,
    from: null,
  });

  const validateToken = async (token: string) => {
    setState((current) => ({
      ...current,
      checkingToken: true,
      error: null,
      successMessage: null,
      isTokenValid: false,
      from: null,
    }));

    try {
      const result = await forgotPasswordService.validateResetToken(token);

      if (!result.success) {
        setState((current) => ({
          ...current,
          checkingToken: false,
          isTokenValid: false,
          error: result.message,
          from: null,
        }));
        return false;
      }

      setState((current) => ({
        ...current,
        checkingToken: false,
        isTokenValid: true,
        error: null,
        from: result.from ?? null,
      }));
      return true;
    } catch {
      setState((current) => ({
        ...current,
        checkingToken: false,
        isTokenValid: false,
        error: "Unexpected error while validating reset link.",
        from: null,
      }));
      return false;
    }
  };

  const submitNewPassword = async (token: string, newPassword: string) => {
    setState((current) => ({
      ...current,
      loading: true,
      error: null,
      successMessage: null,
    }));

    try {
      const result = await forgotPasswordService.completePasswordReset(
        token,
        newPassword
      );

      if (!result.success) {
        setState((current) => ({
          ...current,
          loading: false,
          error: result.message,
          successMessage: null,
        }));
        return false;
      }

      setState((current) => ({
        ...current,
        loading: false,
        isTokenValid: false,
        error: null,
        successMessage: result.message,
        from: result.from ?? current.from,
      }));
      return true;
    } catch {
      setState((current) => ({
        ...current,
        loading: false,
        error: "Unexpected error while updating password.",
        successMessage: null,
      }));
      return false;
    }
  };

  return {
    ...state,
    validateToken,
    submitNewPassword,
  };
};
