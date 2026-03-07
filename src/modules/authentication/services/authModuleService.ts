import { createAuthUser, type AuthUser } from "../../../core/types/auth";
import { AUTH_STORAGE_KEYS } from "../../../core/constants";
import { mockBackendAuth } from "../../../core/services/mockBackendAuth";

// This service simulates authentication logic. In a real application, this would involve API calls to a backend server.
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authModuleService = {
  /**
   * Authenticate user with email and password
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const { employee, token } = await mockBackendAuth.signInEmployee(email, password);
    const authUser = createAuthUser({
      id: employee.id,
      email: employee.email,
      name: `${employee.firstname} ${employee.lastname}`.trim(),
      role: employee.role,
      profilePicture: employee.profilePicture,
    }, { lastLogin: new Date().toISOString() });
    // se guarda en localStorage para persistencia de sesión
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(authUser));
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
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
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  }
};