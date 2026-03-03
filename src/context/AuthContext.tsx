import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser, LoginCredentials } from "../core/types/auth";
import { mockAuthService } from "../core/mocks/auth.mock";

// Define the context value shape
interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("meddical:user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log("Session restored for:", userData.email);
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("meddical:user");
        localStorage.removeItem("meddical:token");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    console.log("Login called with:", credentials);
    setIsLoading(true);
    try {
      const userData = await mockAuthService.login(credentials.email, credentials.password);
      setUser(userData);
      console.log("User after login:", userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Let the form handle the error
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    console.log("Logout called");
    setIsLoading(true);
    try {
      await mockAuthService.logout();
      setUser(null);
      console.log("User after logout:", user);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};