import type { UserRole } from "../constants/roles";
import type { Employee } from "../mocks/data";

export interface AuthUser extends Employee {
  metadata?: Record<string, unknown>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}