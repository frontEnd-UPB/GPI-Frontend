import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser, SignInCredentials } from "../core/types/auth";
import { mockAuthService } from "../core/mocks/auth.mock";

// Define the context value shape
interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthUser>;
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
          console.log("Sesión restaurada para:", userData.email);
        } else {
          console.log("ℹNo hay sesión activa");
        }
      } catch (error) {
        console.error(" Error al restaurar sesión:", error);
        localStorage.removeItem("meddical:user");
        localStorage.removeItem("meddical:token");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // SignIn function
  const signIn = async (credentials: SignInCredentials) => {
    console.log("signIn llamado con:", credentials.email);
    setLoading(true);
    try {
      const userData = await mockAuthService.signIn(credentials.email, credentials.password);
      setUser(userData);
      console.log(" Usuario después de signIn:", userData.email);
      return userData;
    } catch (error) {
      console.error(" signIn falló:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log("signOut llamado - usuario actual:", user?.email || "ninguno");
    setLoading(true);
    
    try {
      await mockAuthService.signOut();
      console.log(" signOut llamado - usuario actual:", user?.email || "ninguno");
      localStorage.removeItem("meddical:user");
      localStorage.removeItem("meddical:token");
      
      setUser(null);
      
      console.log(" signOut completado - usuario eliminado del contexto");
      console.log("localStorage user:", localStorage.getItem("meddical:user")); // Debe ser null
      
    } catch (error) {
      console.error("Error en signOut:", error);
      // Aún así limpiamos el estado local
      setUser(null);
      localStorage.removeItem("meddical:user");
      localStorage.removeItem("meddical:token");
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signOut
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