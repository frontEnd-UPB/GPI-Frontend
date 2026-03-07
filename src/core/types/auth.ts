import type { UserRole } from "../constants/roles";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture: string | null;
  metadata?: Record<string, unknown>;
}

// El payload representa datos canónicos del usuario sin incluir metadata, 
// que es opcional y puede contener información adicional como timestamps, preferencias, etc. para logs
export type AuthUserPayload = Omit<AuthUser, "metadata">;

// Factory, permite crear un AuthUser a partir de un payload y opcionalmente agregar metadata
// de tal forma que si se usa createAuthUser ({ id, email... }, { lastLogin:... } ) se obtiene un AuthUser con metadata incluida
// y si se usa createAuthUser ({ id, email... }) se obtiene un AuthUser sin metadata
export const createAuthUser = (
  payload: AuthUserPayload,
  metadata?: Record<string, unknown>
): AuthUser => ({
  ...payload,
  ...(metadata ? { metadata } : {}),
});

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}