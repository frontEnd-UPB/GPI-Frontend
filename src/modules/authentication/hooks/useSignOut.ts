import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export const useSignOut = () => {
  const { signOut: ctxSignOut, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setError(null);
    try {
      await ctxSignOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      setError(message);
      throw err;
    }
  };

  return { signOut, signOutLoading: loading, error };
};
