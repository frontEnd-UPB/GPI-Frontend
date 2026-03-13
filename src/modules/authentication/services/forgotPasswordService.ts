import { mockBackendAuth } from "../../../core/services/mockBackendAuth";

export type ForgotPasswordSource = "patient" | "doctor";

export interface ForgotPasswordRequestResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface ValidateResetTokenResult {
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

export const forgotPasswordService = {
  requestPasswordReset: async (
    email: string,
    from: ForgotPasswordSource
  ): Promise<ForgotPasswordRequestResult> => {
    return mockBackendAuth.requestPasswordReset(email, from);
  },

  validateResetToken: async (token: string): Promise<ValidateResetTokenResult> => {
    return mockBackendAuth.validateResetToken(token);
  },

  completePasswordReset: async (
    token: string,
    newPassword: string
  ): Promise<CompleteResetResult> => {
    return mockBackendAuth.completePasswordReset(token, newPassword);
  },

  getMockPasswordForEmail: (email: string): string | undefined => {
    return mockBackendAuth.getPasswordForEmail(email);
  },
};
