/**
 * FE-140: Auth Service Integration
 * 
 * This module provides authentication orchestration following a layered architecture:
 * UI (pages) → hooks (useForgotPassword, useResetPassword) → authModuleService → mockBackendAuth/authApi
 * 
 * IMPLEMENTATION NOTES:
 * - Originally designed to work with mockdata from data.ts
 * - Now uses mockBackendAuth.ts which maintains the same contract but is more flexible
 * - Stores user and token in localStorage for session persistence
 * - Token is synthetic ("mockoon-session-${userId}") to simulate JWT behavior
 * - Future: Can be replaced with real authApi endpoints when backend is ready
 */
import { createAuthUser, isAuthUser, type AuthSession, type AuthUser } from "../../../core/types/auth";
import { AUTH_STORAGE_KEYS } from "../../../core/constants";
import { authApi } from "./authApi";

function clearSessionStorage(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
}

function parseStoredUser(stored: string): AuthUser | null {
  try {
    const parsed: unknown = JSON.parse(stored);
    return isAuthUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export const authModuleService = {
  /**
   * FE-140: Authenticate user with email and password
   * 
   * Flow:
   * 1. Calls mockBackendAuth.signInEmployee() to retrieve employee data and generate token
   * 2. Transforms employee response to AuthUser format with metadata (lastLogin)
   * 3. Persists user and token to localStorage for session restoration
   * 
   * Future: Will call authApi.signIn() pointing to real backend endpoint
   */
  signIn: async (email: string, password: string): Promise<AuthSession> => {
    const { token, user } = await authApi.signIn(email, password);
    const authUser = createAuthUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
    }, {
      lastLogin: new Date().toISOString(),
      sessionSource: "login",
    });

    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(authUser));
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);

    return {
      token,
      user: authUser,
    } satisfies AuthSession;
  },

  /**
   * FE-140: Retrieve currently logged in user from session storage
   * 
   * Flow:
   * 1. Reads localStorage for persisted user (meddical:user key)
   * 2. Parses JSON and returns user object, or null if not found
   * 
   * Security Note:
   * - Does NOT validate against backend; assumes localStorage is trusted
   * - Future: Can add backend refresh logic (getCurrentUserById) to validate session
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!stored) return null;

    const localUser = parseStoredUser(stored);
    if (!localUser) {
      clearSessionStorage();
      return null;
    }
    //ANTES SE OBTENIA LA IMAGEN DE USUARIO AQUÍ USANDO GET CUURENT USER BY ID, PERO POR FALTA DE DICHO ENPOINT SE QUITO
    return localUser;
  },

  /**
   * FE-140: Sign out current user by clearing session storage
   * 
   * Removes both user profile and authentication token from localStorage.
   * Simulates 300ms delay to mimic network latency.
   */
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    clearSessionStorage();
  }
};