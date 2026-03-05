import { mockEmployees } from "../../../core/mocks/data";

const RESET_STORE_KEY = "meddical:password-reset-requests";
const RESET_TTL_MS = 15 * 60 * 1000;

export type ForgotPasswordSource = "patient" | "doctor";

export interface ForgotPasswordRequestResult {
  success: boolean;
  message: string;
  token?: string;
}

interface MockResetRequest {
  token: string;
  email: string;
  from: ForgotPasswordSource;
  expiresAt: number;
  createdAt: number;
  used: boolean;
}

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

const generateToken = () =>
  `mock-reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const forgotPasswordService = {
  requestPasswordReset: async (
    email: string,
    from: ForgotPasswordSource
  ): Promise<ForgotPasswordRequestResult> => {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const normalizedEmail = email.toLowerCase().trim();
    const employee = mockEmployees.find(
      (emp) => emp.email.toLowerCase() === normalizedEmail
    );

    if (!employee) {
      return {
        success: false,
        message: "No account was found with that email.",
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
      message: "Gmail enviado. Revisa tu bandeja para continuar.",
      token,
    };
  },
};
