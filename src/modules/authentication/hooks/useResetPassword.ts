import { useCallback, useState } from "react";
import { forgotPasswordService } from "../services/forgotPasswordService";
import type { ForgotPasswordSource } from "../services/forgotPasswordService";

interface ResetPasswordState {
  verifyingCode: boolean;
  loading: boolean;
  isCodeVerified: boolean;
  error: string | null;
  successMessage: string | null;
  from: ForgotPasswordSource | null;
}

export const useResetPassword = () => {
  const [state, setState] = useState<ResetPasswordState>({
    verifyingCode: false,
    loading: false,
    isCodeVerified: false,
    error: null,
    successMessage: null,
    from: null,
  });

  const verifyCode = useCallback(async (
    email: string,
    code: string,
    from: ForgotPasswordSource
  ) => {
    setState((current) => ({
      ...current,
      verifyingCode: true,
      error: null,
      successMessage: null,
      isCodeVerified: false,
      from: null,
    }));

    try {
      const result = await forgotPasswordService.verifyResetCode(email, code, from);

      if (!result.success) {
        setState((current) => ({
          ...current,
          verifyingCode: false,
          isCodeVerified: false,
          error: result.message,
          from: null,
        }));
        return false;
      }

      setState((current) => ({
        ...current,
        verifyingCode: false,
        isCodeVerified: true,
        error: null,
        from: result.from ?? from,
      }));
      return true;
    } catch {
      setState((current) => ({
        ...current,
        verifyingCode: false,
        isCodeVerified: false,
        error: "Unexpected error while validating verification code.",
        from: null,
      }));
      return false;
    }
  }, []);

  const submitNewPassword = useCallback(async (
    email: string,
    newPassword: string,
    passwordConfirmation: string,
    from: ForgotPasswordSource
  ) => {
    setState((current) => ({
      ...current,
      loading: true,
      error: null,
      successMessage: null,
    }));

    try {
      const result = await forgotPasswordService.completePasswordReset(
        email,
        newPassword,
        passwordConfirmation,
        from
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
        isCodeVerified: false,
        error: null,
        successMessage: result.message,
        from: result.from ?? from,
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
  }, []);

  return {
    ...state,
    verifyCode,
    submitNewPassword,
  };
};
