import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export const useSignIn = () => {
  const { signIn: ctxSignIn, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const currentUser = await ctxSignIn({ email, password });
      return {
        user: currentUser,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    }
  };

  return { signIn, signInLoading: loading, error };
};
