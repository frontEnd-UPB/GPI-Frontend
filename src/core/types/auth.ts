import type { UserRole } from "../constants/roles";
import type { Employee } from "../mocks/data";

export interface AuthUser extends Employee {
  metadata?: Record<string, unknown>;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthUser>;
  signOut: () => void;
}