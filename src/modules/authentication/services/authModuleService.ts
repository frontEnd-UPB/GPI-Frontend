import { createAuthUser, type AuthUser } from "../../../core/types/auth";
import { AUTH_STORAGE_KEYS } from "../../../core/constants";
import { authApi } from "./authApi";

// This service simulates authentication logic. In a real application, this would involve API calls to a backend server.
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

function clearSessionStorage(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
}

function parseStoredUser(stored: string): AuthUser | null {
  try {
    const parsed = JSON.parse(stored) as Partial<AuthUser> | null;
    if (!parsed || typeof parsed !== "object") return null;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.role !== "string"
    ) {
      return null;
    }

    return parsed as AuthUser;
  } catch {
    return null;
  }
}

export const authModuleService = {
  /**
   * Authenticate user with email and password
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const { token, user } = await authApi.signIn(email, password);
    const baseAuthUser = createAuthUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
    }, { lastLogin: new Date().toISOString() });

    // se guarda una sesión base y luego se intenta enriquecer con datos actuales del backend
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(baseAuthUser));
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);

    let authUser = baseAuthUser;
    try {
      const currentUser = await authApi.getCurrentUserById(baseAuthUser.id);
      authUser = createAuthUser(currentUser, {
        ...(baseAuthUser.metadata ?? {}),
        lastSync: new Date().toISOString(),
      });
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(authUser));
    } catch (error) {
      if (authApi.isCurrentUserAuthError(error)) {
        clearSessionStorage();
        throw error;
      }
      // Si falla el refresh inicial, se mantiene la sesión base para no bloquear login.
    }

    return {
      token,
      user: authUser,
    };
  },

  /**
   * Get currently logged in user
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!stored) return null;

    const localUser = parseStoredUser(stored);
    if (!localUser) {
      clearSessionStorage();
      return null;
    }

    try {
      const currentUser = await authApi.getCurrentUserById(localUser.id);
      const refreshedUser = createAuthUser(currentUser, {
        ...(localUser.metadata ?? {}),
        lastSync: new Date().toISOString(),
      });

      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(refreshedUser));
      return refreshedUser;
    } catch (error) {
      if (authApi.isCurrentUserAuthError(error)) {
        clearSessionStorage();
        return null;
      }

      // Fallback local para mantener sesión utilizable ante fallos transitorios de red.
      return localUser;
    }
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    clearSessionStorage();
  }
};