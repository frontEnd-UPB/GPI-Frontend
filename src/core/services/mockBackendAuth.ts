import { mockEmployees } from "../mocks/data";
import type { Employee } from "../mocks/data";
import { API_ENDPOINTS, AUTH_DEBUG } from "../constants";
import type {
  ForgotPasswordSource,
  ForgotPasswordRequestResult,
  ValidateResetTokenResult,
  CompleteResetResult,
} from "../../modules/authentication/services/forgotPasswordService";

const RESET_STORE_KEY = "meddical:password-reset-requests";
const PASSWORD_OVERRIDES_KEY = "meddical:password-overrides";
const RESET_TTL_MS = 15 * 60 * 1000;

interface MockResetRequest {
  token: string;
  email: string;
  from: ForgotPasswordSource;
  expiresAt: number;
  createdAt: number;
  used: boolean;
}

type PasswordOverrides = Record<string, string>;

const readStore = (): MockResetRequest[] => {
  const raw = localStorage.getItem(RESET_STORE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as MockResetRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStore = (items: MockResetRequest[]) => {
  localStorage.setItem(RESET_STORE_KEY, JSON.stringify(items));
};

const readPasswordOverrides = (): PasswordOverrides => {
  const raw = localStorage.getItem(PASSWORD_OVERRIDES_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as PasswordOverrides;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writePasswordOverrides = (overrides: PasswordOverrides) => {
  localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides));
};

const generateToken = () =>
  `mock-reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const mockBackendAuth = {
  /**
   * Simula el endpoint de login de empleados.
   */
  async signInEmployee(email: string, password: string): Promise<{ employee: Employee; token: string }> {
    const networkDelay = Math.random() * 500 + 500;
    await new Promise((resolve) => setTimeout(resolve, networkDelay));

    const normalizedEmail = email.toLowerCase().trim();
    const overrides = readPasswordOverrides();
    const employee = mockEmployees.find(
      (emp) => emp.email.toLowerCase() === normalizedEmail
    );

    const effectivePassword =
      overrides[normalizedEmail] ?? employee?.password;

    if (!employee || effectivePassword !== password) {
      throw new Error("Invalid email or password");
    }

    const token = "mock-jwt-token-" + Date.now();
    if (AUTH_DEBUG) {
      console.log(`[MOCK AUTH] POST ${API_ENDPOINTS.AUTH.LOGIN} -> 200`);
    }

    return { employee, token };
  },

  async requestPasswordReset(
    email: string,
    from: ForgotPasswordSource
  ): Promise<ForgotPasswordRequestResult> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const normalizedEmail = email.toLowerCase().trim();
    const employee = mockEmployees.find(
      (emp) => emp.email.toLowerCase() === normalizedEmail
    );

    const neutralMessage =
      "If an account exists for that email, you will receive reset instructions shortly.";

    if (!employee) {
      return {
        success: true,
        message: neutralMessage,
      };
    }

    const now = Date.now();
    const token = generateToken();

    const activeRequests = readStore().filter(
      (item) => item.expiresAt > now && !item.used
    );

    const newRequest: MockResetRequest = {
      token,
      email: normalizedEmail,
      from,
      expiresAt: now + RESET_TTL_MS,
      createdAt: now,
      used: false,
    };

    writeStore([...activeRequests, newRequest]);

    return {
      success: true,
      message: neutralMessage,
      token,
    };
  },

  async validateResetToken(token: string): Promise<ValidateResetTokenResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!token.trim()) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    const normalizedToken = token.trim();
    const now = Date.now();
    const request = readStore().find((item) => item.token === normalizedToken);

    if (!request) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    if (request.used) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    if (request.expiresAt <= now) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    return {
      success: true,
      message: "Reset link verified.",
      email: request.email,
      from: request.from,
    };
  },

  async completePasswordReset(
    token: string,
    newPassword: string
  ): Promise<CompleteResetResult> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const normalizedToken = token.trim();
    const now = Date.now();
    const requests = readStore();
    const requestIndex = requests.findIndex((item) => item.token === normalizedToken);

    if (requestIndex === -1) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    const request = requests[requestIndex];

    if (request.used) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    if (request.expiresAt <= now) {
      return {
        success: false,
        message: "Reset link is invalid or expired.",
      };
    }

    const overrides = readPasswordOverrides();
    overrides[request.email] = newPassword;
    writePasswordOverrides(overrides);

    const updatedRequests = [...requests];
    updatedRequests[requestIndex] = { ...request, used: true };
    writeStore(updatedRequests);

    return {
      success: true,
      message: "Password updated successfully.",
      from: request.from,
    };
  },

  getPasswordForEmail(email: string): string | undefined {
    const normalizedEmail = email.toLowerCase().trim();
    const overrides = readPasswordOverrides();
    if (overrides[normalizedEmail]) {
      return overrides[normalizedEmail];
    }

    const employee = mockEmployees.find(
      (emp) => emp.email.toLowerCase() === normalizedEmail
    );

    return employee?.password;
  },
};
