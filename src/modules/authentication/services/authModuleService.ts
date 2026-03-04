import { mockEmployees } from "../../../core/mocks/data";
import { createAuthUser, type AuthUser } from "../../../core/types/auth";
import { API_ENDPOINTS } from "../../../core/constants";

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
    // Simulate network latency
    const networkDelay = Math.random() * 500 + 500;
    await new Promise(resolve => setTimeout(resolve, networkDelay));

    //busqueda en la base de datos simulada por email
    const normalizedEmail = email.toLowerCase().trim();
    const employee = mockEmployees.find(emp => emp.email.toLowerCase() === normalizedEmail);
    const isValid = employee && employee.password === password;
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Simula token generation y el payload selecciona del usuario que pasa al contexto
    const token = "mock-jwt-token-" + Date.now();
    const authUser = createAuthUser({
      id: employee.id,
      email: employee.email,
      name: employee.name,
      role: employee.role,
      profilePicture: employee.profilePicture,
    }, { lastLogin: new Date().toISOString() });
    // se guarda en localStorage para persistencia de sesión
    localStorage.setItem("meddical:user", JSON.stringify(authUser));
    localStorage.setItem("meddical:token", token);
    console.log(`[AUTH] SignIn to ${API_ENDPOINTS.AUTH.LOGIN} successful`);
    return {
      token,
      user: authUser,
    };
  },

  /**
   * Get currently logged in user
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const stored = localStorage.getItem("meddical:user");
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    console.log(`[AUTH] Calling ${API_ENDPOINTS.AUTH.LOGOUT}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem("meddical:user");
    localStorage.removeItem("meddical:token");
  }
};