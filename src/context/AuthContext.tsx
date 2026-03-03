import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser, SignInCredentials } from "../core/types/auth";
import { mockAuthService } from "../core/mocks/auth.mock";

// Define the context value shape
interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (credentials: SignInCredentials) => {
    console.log("Login called with:", credentials);
    setLoading(true);
    try {
      const userData = await mockAuthService.signIn(credentials.email, credentials.password);
      setUser(userData);
      console.log("User after signIn:", userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Let the form handle the error
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    console.log("Logout called");
    setLoading(true);
    try {
      await mockAuthService.signOut();
      setUser(null);
      console.log("User after signOut:", user);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: AuthContextValue = {
    user,
    loading,
    signIn: login,
    signOut: logout
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