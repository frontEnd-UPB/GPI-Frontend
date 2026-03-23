import { useState } from "react";
import { AUTH_DEBUG } from "../../../core/constants";
import {
  forgotPasswordService,
  type ForgotPasswordSource,
} from "../services/forgotPasswordService";

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  requestedEmail: string | null;
}

export const useForgotPassword = () => {
  const [state, setState] = useState<ForgotPasswordState>({
    loading: false,
    error: null,
    successMessage: null,
    requestedEmail: null,
  });

  const requestReset = async (
    email: string,
    from: ForgotPasswordSource
  ): Promise<string | null> => {
    setState({
      loading: true,
      error: null,
      successMessage: null,
      requestedEmail: null,
    });

    try {
      const result = await forgotPasswordService.requestPasswordReset(email, from);

      if (AUTH_DEBUG) {
        console.log("[FORGOT PASSWORD] request result", result);
      }

      if (!result.success) {
        setState({
          loading: false,
          error: result.message,
          successMessage: null,
          requestedEmail: null,
        });
        return null;
      }

      const normalizedEmail = (result.email ?? email).trim().toLowerCase();

      setState({
        loading: false,
        error: null,
        successMessage: result.message,
        requestedEmail: normalizedEmail,
      });

      return normalizedEmail;
    } catch {
      setState({
        loading: false,
        error: "Unexpected error while processing your request.",
        successMessage: null,
        requestedEmail: null,
      });
      return null;
    }
  };

  const clearFeedback = () => {
    setState((current) => ({
      ...current,
      error: null,
      successMessage: null,
      requestedEmail: null,
    }));
  };

  return {
    ...state,
    requestReset,
    clearFeedback,
  };
};
