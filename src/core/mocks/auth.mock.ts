import type { AuthUser } from "../types/auth";
import { mockEmployees } from "./data";
import { 
  API_ENDPOINTS,  // For API paths
  EMPLOYEE_STATUS, // For status values
  VACATION_STATUS, // For vacation statuses
} from "../constants"; // or from "./index" depending on your export

// Mock password hashes (in real app, this is on backend)

const PASSWORD_HASHES = {
  "esthera@example.com": "hashed_admin123",
  "alexa@example.com": "hashed_doctor123",
};

// Simple hash simulation (ONLY FOR MOCK)
const simulateHash = (password: string): string => `hashed_${password}`;

export const mockAuthService = {
  /**
   * Authenticate user with email and password
   */
  login: async (email: string, password: string): Promise<AuthUser> => {
    // Simulate network latency
    const networkDelay = Math.random() * 500 + 500;
    await new Promise(resolve => setTimeout(resolve, networkDelay));
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user
    const employee = mockEmployees.find(emp => 
      emp.email.toLowerCase() === normalizedEmail
    );
    
    // Verify password
    const expectedHash = PASSWORD_HASHES[normalizedEmail as keyof typeof PASSWORD_HASHES];
    const providedHash = simulateHash(password);
    
    const isValid = employee && expectedHash && expectedHash === providedHash;
    
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
    
    // Create auth user with metadata
    const authUser: AuthUser = {
      ...employee,
      metadata: {
        lastLogin: new Date().toISOString()
      }
    };
    
    // Store in localStorage
    localStorage.setItem("meddical:user", JSON.stringify(authUser));
    localStorage.setItem("meddical:token", "mock_jwt_token_" + Date.now());
    
    // Log using your constants if needed
    console.log(`[AUTH] Login to ${API_ENDPOINTS.AUTH.LOGIN} successful`);
    
    return authUser;
  },
  
  /**
   * Get currently logged in user
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const stored = localStorage.getItem("meddical:user");
    return stored ? JSON.parse(stored) : null;
  },
  
  /**
   * Log out current user
   */
  logout: async (): Promise<void> => {
    // Simulate API call to your endpoint
    console.log(`[AUTH] Calling ${API_ENDPOINTS.AUTH.LOGOUT}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    localStorage.removeItem("meddical:user");
    localStorage.removeItem("meddical:token");
  }
};