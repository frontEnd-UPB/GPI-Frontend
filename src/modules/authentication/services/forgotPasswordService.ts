import { mockEmployees } from "../../../core/mocks/data";

const RESET_STORE_KEY = "meddical:password-reset-requests";
const PASSWORD_OVERRIDES_KEY = "meddical:password-overrides";
const RESET_TTL_MS = 15 * 60 * 1000;

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
  // FUNCION MOCK DE STORAGE: this logic would be replaced by API USANDO READ
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
  // FUNCION MOCK DE STORAGE: this logic would be replaced by API USANDO WRITE
  localStorage.setItem(RESET_STORE_KEY, JSON.stringify(items));
};

const readPasswordOverrides = (): PasswordOverrides => {
  // FUNCION MOCK DE STORAGE: this logic would be replaced by API USANDO READ
  // su funcion es LEER las contraseñas reseteadas temporalmente 
  // para que el mock de autenticación pueda validar con ellas
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
  // FUNCION MOCK DE STORAGE: this logic would be replaced by API USANDO WRITE
  // su funcion es GUARDAR temporalmente las contraseñas reseteadas 
  // para que el mock de autenticación pueda validar con ellas,
  localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides));
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

  validateResetToken: async (token: string): Promise<ValidateResetTokenResult> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!token.trim()) {
      return {
        success: false,
        message: "Invalid reset link.",
      };
    }

    // REEMPLAZAR AQUÍ BACKEND: Replace localStorage token validation with API token verification.
    const normalizedToken = token.trim();
    const now = Date.now();
    const request = readStore().find((item) => item.token === normalizedToken);

    if (!request) {
      return {
        success: false,
        message: "Invalid reset link.",
      };
    }

    if (request.used) {
      return {
        success: false,
        message: "This reset link was already used.",
      };
    }

    if (request.expiresAt <= now) {
      return {
        success: false,
        message: "This reset link has expired.",
      };
    }

    return {
      success: true,
      message: "Reset link verified.",
      email: request.email,
      from: request.from,
    };
  },

  completePasswordReset: async (
    token: string,
    newPassword: string
  ): Promise<CompleteResetResult> => {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const normalizedToken = token.trim();
    const now = Date.now();
    const requests = readStore();
    const requestIndex = requests.findIndex((item) => item.token === normalizedToken);

    if (requestIndex === -1) {
      return {
        success: false,
        message: "Invalid reset link.",
      };
    }

    const request = requests[requestIndex];

    if (request.used) {
      return {
        success: false,
        message: "This reset link was already used.",
      };
    }

    if (request.expiresAt <= now) {
      return {
        success: false,
        message: "This reset link has expired.",
      };
    }

    // REEMPLAZAR AQUÍ BACKEND: Replace password override persistence with secure backend password update endpoint.
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

  getMockPasswordForEmail: (email: string): string | undefined => {
    // Ssu funcion es obtener la contraseña a validar en el mock de autenticación,
    const normalizedEmail = email.toLowerCase().trim();
    const overrides = readPasswordOverrides();
    if (overrides[normalizedEmail]) {
      // aqui se verifica si existe una contraseña reseteada temporalmente para ese email, y se devuelve en caso de existir
      return overrides[normalizedEmail];
    }

    const employee = mockEmployees.find(
      (emp) => emp.email.toLowerCase() === normalizedEmail
    );

    return employee?.password;
  },
};
