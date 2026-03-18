import { ROLES, type UserRole } from "../constants/roles";

export interface AuthUserMetadata {
  lastLogin?: string;
  lastSync?: string;
  sessionSource?: "login" | "session-restore";
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture: string | null;
  metadata?: AuthUserMetadata;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

// El payload representa datos canónicos del usuario sin incluir metadata, 
// que es opcional y puede contener información adicional como timestamps, preferencias, etc. para logs
export type AuthUserPayload = Omit<AuthUser, "metadata">;

// Factory, permite crear un AuthUser a partir de un payload y opcionalmente agregar metadata
// de tal forma que si se usa createAuthUser ({ id, email... }, { lastLogin:... } ) se obtiene un AuthUser con metadata incluida
// y si se usa createAuthUser ({ id, email... }) se obtiene un AuthUser sin metadata
export const createAuthUser = (
  payload: AuthUserPayload,
  metadata?: AuthUserMetadata
): AuthUser => ({
  ...payload,
  ...(metadata ? { metadata } : {}),
});

export const isAuthUser = (value: unknown): value is AuthUser => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AuthUser>;
  const hasValidRole =
    typeof candidate.role === "string" &&
    (ROLES as readonly string[]).includes(candidate.role);
  const hasValidProfilePicture =
    candidate.profilePicture === null || typeof candidate.profilePicture === "string";
  const hasValidMetadata =
    candidate.metadata === undefined ||
    (typeof candidate.metadata === "object" && candidate.metadata !== null);

  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.name === "string" &&
    hasValidRole &&
    hasValidProfilePicture &&
    hasValidMetadata
  );
};

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}