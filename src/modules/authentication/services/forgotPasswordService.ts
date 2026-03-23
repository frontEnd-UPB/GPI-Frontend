import { API_ENDPOINTS } from "../../../core/constants";
import { ApiError, apiClient } from "../../../core/services/httpClient";

export type ForgotPasswordSource = "patient" | "doctor";

export interface ForgotPasswordRequestResult {
  success: boolean;
  message: string;
  email?: string;
}

export interface VerifyResetCodeResult {
  success: boolean;
  message: string;
  email?: string;
  from?: ForgotPasswordSource;
}

export interface CompleteResetResult {
  success: boolean;
  message: string;
  from?: ForgotPasswordSource;
}

const NEUTRAL_FORGOT_PASSWORD_MESSAGE =
  "If an account exists for this email, you will receive a verification code shortly.";
const INVALID_OR_EXPIRED_CODE_MESSAGE =
  "Invalid or expired code. Request a new link and try again.";
const GENERIC_REQUEST_ERROR_MESSAGE =
  "We could not process your request right now. Please try again in a moment.";
const GENERIC_RESET_ERROR_MESSAGE =
  "We could not update your password. Request a new code and try again.";

function toTrimmedString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function readResponseMessage(payload: unknown): string {
  if (typeof payload === "object" && payload !== null) {
    const maybeMessage =
      "message" in payload && typeof payload.message === "string"
        ? payload.message
        : null;
    if (maybeMessage && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }

    const maybeDetail =
      "detail" in payload && typeof payload.detail === "string"
        ? payload.detail
        : null;
    if (maybeDetail && maybeDetail.trim().length > 0) {
      return maybeDetail;
    }
  }

  return "Request completed successfully.";
}

function mapApiError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const detail = readResponseMessage(error.data);
    if (detail && detail !== "Request completed successfully.") {
      return detail;
    }
    if (error.message && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}

export const forgotPasswordService = {
  requestPasswordReset: async (
    email: string,
    from: ForgotPasswordSource
  ): Promise<ForgotPasswordRequestResult> => {
    const normalizedEmail = toTrimmedString(email).toLowerCase();

    try {
      await apiClient.post<{ message?: string }>(
        API_ENDPOINTS.AUTH_CONTRACT.FORGOT_PASSWORD,
        undefined,
        {
          query: {
            email: normalizedEmail,
          },
          skipAuth: true,
        }
      );

      return {
        success: true,
        message: NEUTRAL_FORGOT_PASSWORD_MESSAGE,
        email: normalizedEmail,
      };
    } catch (error) {
      // Do not reveal whether the email exists. Treat user-not-found as success.
      if (error instanceof ApiError && error.status === 404) {
        return {
          success: true,
          message: NEUTRAL_FORGOT_PASSWORD_MESSAGE,
          email: normalizedEmail,
        };
      }

      return {
        success: false,
        message: GENERIC_REQUEST_ERROR_MESSAGE,
      };
    }
  },

  verifyResetCode: async (
    email: string,
    code: string,
    from: ForgotPasswordSource
  ): Promise<VerifyResetCodeResult> => {
    const normalizedEmail = toTrimmedString(email).toLowerCase();
    const normalizedCode = toTrimmedString(code);

    try {
      const response = await apiClient.post<{ message?: string; email?: string }>(
        API_ENDPOINTS.AUTH_CONTRACT.VERIFY,
        undefined,
        {
          query: {
            email: normalizedEmail,
            code: normalizedCode,
          },
          skipAuth: true,
        }
      );

      return {
        success: true,
        message: "Code verified successfully.",
        email: toTrimmedString(response?.email) || normalizedEmail,
        from,
      };
    } catch (error) {
      return {
        success: false,
        message: INVALID_OR_EXPIRED_CODE_MESSAGE,
        email: normalizedEmail,
        from,
      };
    }
  },

  completePasswordReset: async (
    email: string,
    newPassword: string,
    passwordConfirmation: string,
    from: ForgotPasswordSource
  ): Promise<CompleteResetResult> => {
    const normalizedEmail = toTrimmedString(email).toLowerCase();

    try {
      const response = await apiClient.post<{ message?: string }>(
        API_ENDPOINTS.AUTH_CONTRACT.RESET_PASSWORD,
        undefined,
        {
          query: {
            email: normalizedEmail,
            new_password: newPassword,
            password_confirmation: passwordConfirmation,
          },
          skipAuth: true,
        }
      );

      return {
        success: true,
        message: readResponseMessage(response) || "Password updated successfully.",
        from,
      };
    } catch (error) {
      if (
        error instanceof ApiError &&
        typeof error.data === "object" &&
        error.data !== null &&
        "detail" in error.data &&
        typeof error.data.detail === "string" &&
        error.data.detail.toLowerCase().includes("password")
      ) {
        return {
          success: false,
          message: "Passwords do not match.",
          from,
        };
      }

      return {
        success: false,
        message: GENERIC_RESET_ERROR_MESSAGE,
        from,
      };
    }
  },
};
