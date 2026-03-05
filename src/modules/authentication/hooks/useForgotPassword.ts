import { useState } from "react";
import {
  forgotPasswordService,
  type ForgotPasswordSource,
} from "../services/forgotPasswordService";

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  token: string | null;
}

export const useForgotPassword = () => {
  const [state, setState] = useState<ForgotPasswordState>({
    loading: false,
    error: null,
    successMessage: null,
    token: null,
  });

  const requestReset = async (email: string, from: ForgotPasswordSource) => {
    setState({ loading: true, error: null, successMessage: null, token: null });

    try {
      const result = await forgotPasswordService.requestPasswordReset(email, from);

      if (!result.success || !result.token) {
        setState({
          loading: false,
          error: result.message,
          successMessage: null,
          token: null,
        });
        return false;
      }

      setState({
        loading: false,
        error: null,
        successMessage: result.message,
        token: result.token,
      });

      return true;
    } catch {
      setState({
        loading: false,
        error: "Unexpected error while processing your request.",
        successMessage: null,
        token: null,
      });
      return false;
    }
  };

  const clearFeedback = () => {
    setState((current) => ({
      ...current,
      error: null,
      successMessage: null,
      token: null,
    }));
  };

  return {
    ...state,
    requestReset,
    clearFeedback,
  };
};
