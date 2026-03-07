import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthContextValue, AuthUser, SignInCredentials } from "../core/types/auth";
import { AUTH_STORAGE_KEYS, AUTH_DEBUG } from "../core/constants";
import { authModuleService } from "../modules/authentication/services/authModuleService";

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
        const userData = await authModuleService.getCurrentUser();
        if (userData) {
          setUser(userData);
          if (AUTH_DEBUG) console.log("Sesión restaurada para:", userData.email);
        } else {
          if (AUTH_DEBUG) console.log("ℹNo hay sesión activa");
        }
      } catch (error) {
        console.error(" Error al restaurar sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // SignIn function
  const signIn = async (credentials: SignInCredentials): Promise<AuthUser> => {
    if (AUTH_DEBUG) console.log("signIn llamado con:", credentials.email);
    setLoading(true);
    try {
      const response = await authModuleService.signIn(credentials.email, credentials.password);
      const authUser = response.user;
      setUser(authUser);
      // se coloca en el contexto el usuario obtenido del servicio
      // lo guarda en localStorage, si se recarga el useEffect del contexto restaura la sesión
      if (AUTH_DEBUG) console.log(" Usuario después de signIn:", response.user.email);
      return authUser;
    } catch (error) {
      if (AUTH_DEBUG) console.error(" signIn falló:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (AUTH_DEBUG) console.log("signOut llamado - usuario actual:", user?.email || "ninguno");
    setLoading(true);
    
    try {
      await authModuleService.signOut();
      if (AUTH_DEBUG) console.log(" signOut llamado - usuario actual:", user?.email || "ninguno");
      setUser(null);
      if (AUTH_DEBUG) {
        console.log(" signOut completado - usuario eliminado del contexto");
        console.log("localStorage user:", localStorage.getItem(AUTH_STORAGE_KEYS.USER));
      }
      
    } catch (error) {
      if (AUTH_DEBUG) console.error("Error en signOut:", error);
      setUser(null);
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