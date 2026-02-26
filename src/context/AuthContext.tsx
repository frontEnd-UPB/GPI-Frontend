import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { UserRole } from "../core/constants/roles";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture: string | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthService {
  getCurrentUser: () => Promise<AuthUser | null>;
  signIn: (token: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const createMockAuthService = (): AuthService => {
  return {
    async getCurrentUser() {
      const stored = window.localStorage.getItem("meddical:user");
      if (!stored) return null;
      try {
        return JSON.parse(stored) as AuthUser;
      } catch {
        return null;
      }
    },
    async signIn(token: string) {
      // En modo mock interpretamos el token como JSON de AuthUser
      const parsed = JSON.parse(token) as AuthUser;
      window.localStorage.setItem("meddical:user", JSON.stringify(parsed));
      return parsed;
    },
    async signOut() {
      window.localStorage.removeItem("meddical:user");
    },
  };
};

const defaultAuthService = createMockAuthService();

export const AuthProvider: React.FC<{ children: ReactNode; authService?: AuthService }> = ({
  children,
  authService = defaultAuthService,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const current = await authService.getCurrentUser();
      if (!active) return;
      setUser(current);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [authService]);

  const signIn = async (token: string) => {
    const nextUser = await authService.signIn(token);
    setUser(nextUser);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
